import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

// Get a specific location
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth()(request)
    const id = params.id

    const locations = await executeQuery("SELECT * FROM locations WHERE id = $1", [id])

    if (locations.length === 0) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 })
    }

    return NextResponse.json(locations[0])
  } catch (error) {
    console.error("Error fetching location:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch location" }, { status: 500 })
  }
}

// Update a location
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(["admin", "company", "carrier"])(request)
    const id = params.id

    // Check if location exists
    const existingLocation = await executeQuery("SELECT * FROM locations WHERE id = $1", [id])

    if (existingLocation.length === 0) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 })
    }

    const updateData = await request.json()

    // Build update query
    const updateFields = Object.entries(updateData)
      .filter(([_, value]) => value !== undefined)
      .map(([key], index) => `${key} = $${index + 1}`)

    const updateValues = Object.values(updateData).filter((value) => value !== undefined)
    updateValues.push(id)

    const updateQuery = `
      UPDATE locations 
      SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${updateValues.length}
      RETURNING *
    `

    const result = await executeQuery(updateQuery, updateValues)

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating location:", error)
    return NextResponse.json({ error: error.message || "Failed to update location" }, { status: 500 })
  }
}

// Delete a location (soft delete)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(["admin"])(request)
    const id = params.id

    // Check if location exists
    const existingLocation = await executeQuery("SELECT * FROM locations WHERE id = $1", [id])

    if (existingLocation.length === 0) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 })
    }

    // Check if location is being used in shipments
    const activeShipments = await executeQuery(
      "SELECT * FROM shipments WHERE (origin_id = $1 OR destination_id = $1) AND status NOT IN ('delivered', 'cancelled')",
      [id],
    )

    if (activeShipments.length > 0) {
      return NextResponse.json({ error: "Cannot delete location with active shipments" }, { status: 400 })
    }

    // Soft delete location
    await executeQuery("UPDATE locations SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = $1", [id])

    return NextResponse.json({ success: true, message: "Location deactivated successfully" })
  } catch (error) {
    console.error("Error deleting location:", error)
    return NextResponse.json({ error: error.message || "Failed to delete location" }, { status: 500 })
  }
}
