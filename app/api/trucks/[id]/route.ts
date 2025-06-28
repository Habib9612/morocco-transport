import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

// Get a specific truck
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth()(request)
    const id = params.id

    const trucks = await executeQuery(
      `SELECT t.*, 
             u.name as owner_name, u.email as owner_email,
             l.name as current_location_name, l.address as current_location_address, l.city as current_location_city
       FROM trucks t
       LEFT JOIN users u ON t.owner_id = u.id
       LEFT JOIN locations l ON t.current_location_id = l.id
       WHERE t.id = $1`,
      [id],
    )

    if (trucks.length === 0) {
      return NextResponse.json({ error: "Truck not found" }, { status: 404 })
    }

    const truck = trucks[0]

    // Check permissions
    if (user.role !== "admin" && user.id !== truck.owner_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json(truck)
  } catch (error) {
    console.error("Error fetching truck:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch truck" }, { status: 500 })
  }
}

// Update a truck
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth()(request)
    const id = params.id

    // Check if truck exists and user has permission
    const existingTruck = await executeQuery("SELECT * FROM trucks WHERE id = $1", [id])

    if (existingTruck.length === 0) {
      return NextResponse.json({ error: "Truck not found" }, { status: 404 })
    }

    const truck = existingTruck[0]

    // Check permissions
    if (user.role !== "admin" && user.id !== truck.owner_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const updateData = await request.json()

    // Check if license plate is being changed and if it's already taken
    if (updateData.license_plate && updateData.license_plate !== truck.license_plate) {
      const plateCheck = await executeQuery("SELECT id FROM trucks WHERE license_plate = $1 AND id != $2", [
        updateData.license_plate,
        id,
      ])

      if (plateCheck.length > 0) {
        return NextResponse.json({ error: "License plate already taken" }, { status: 409 })
      }
    }

    // Build update query
    const updateFields = Object.entries(updateData)
      .filter(([_, value]) => value !== undefined)
      .map(([key], index) => `${key} = $${index + 1}`)

    const updateValues = Object.values(updateData).filter((value) => value !== undefined)
    updateValues.push(id)

    const updateQuery = `
      UPDATE trucks 
      SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${updateValues.length}
      RETURNING *
    `

    const result = await executeQuery(updateQuery, updateValues)

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating truck:", error)
    return NextResponse.json({ error: error.message || "Failed to update truck" }, { status: 500 })
  }
}

// Delete a truck (soft delete)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth()(request)
    const id = params.id

    // Check if truck exists
    const existingTruck = await executeQuery("SELECT * FROM trucks WHERE id = $1", [id])

    if (existingTruck.length === 0) {
      return NextResponse.json({ error: "Truck not found" }, { status: 404 })
    }

    const truck = existingTruck[0]

    // Check permissions
    if (user.role !== "admin" && user.id !== truck.owner_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Check if truck has active routes
    const activeRoutes = await executeQuery(
      "SELECT * FROM routes WHERE truck_id = $1 AND status IN ('planned', 'active')",
      [id],
    )

    if (activeRoutes.length > 0) {
      return NextResponse.json({ error: "Cannot delete truck with active routes" }, { status: 400 })
    }

    // Soft delete truck
    await executeQuery("UPDATE trucks SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = $1", [id])

    return NextResponse.json({ success: true, message: "Truck deactivated successfully" })
  } catch (error) {
    console.error("Error deleting truck:", error)
    return NextResponse.json({ error: error.message || "Failed to delete truck" }, { status: 500 })
  }
}
