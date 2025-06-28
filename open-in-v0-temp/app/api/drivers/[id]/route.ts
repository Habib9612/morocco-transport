import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

// Get a specific driver
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth()(request)
    const id = params.id

    const drivers = await executeQuery(
      `SELECT d.*, 
             u.name, u.email, u.city, u.country, u.address,
             l.name as current_location_name, l.address as current_location_address, l.city as current_location_city
       FROM drivers d
       LEFT JOIN users u ON d.user_id = u.id
       LEFT JOIN locations l ON d.current_location_id = l.id
       WHERE d.id = $1`,
      [id],
    )

    if (drivers.length === 0) {
      return NextResponse.json({ error: "Driver not found" }, { status: 404 })
    }

    const driver = drivers[0]

    // Check permissions
    if (user.role !== "admin" && user.id !== driver.user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json(driver)
  } catch (error) {
    console.error("Error fetching driver:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch driver" }, { status: 500 })
  }
}

// Update a driver
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth()(request)
    const id = params.id

    // Check if driver exists
    const existingDriver = await executeQuery("SELECT * FROM drivers WHERE id = $1", [id])

    if (existingDriver.length === 0) {
      return NextResponse.json({ error: "Driver not found" }, { status: 404 })
    }

    const driver = existingDriver[0]

    // Check permissions
    if (user.role !== "admin" && user.id !== driver.user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const updateData = await request.json()

    // Check if license number is being changed and if it's already taken
    if (updateData.license_number && updateData.license_number !== driver.license_number) {
      const licenseCheck = await executeQuery("SELECT id FROM drivers WHERE license_number = $1 AND id != $2", [
        updateData.license_number,
        id,
      ])

      if (licenseCheck.length > 0) {
        return NextResponse.json({ error: "License number already taken" }, { status: 409 })
      }
    }

    // Build update query
    const updateFields = Object.entries(updateData)
      .filter(([_, value]) => value !== undefined)
      .map(([key], index) => `${key} = $${index + 1}`)

    const updateValues = Object.values(updateData).filter((value) => value !== undefined)
    updateValues.push(id)

    const updateQuery = `
      UPDATE drivers 
      SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${updateValues.length}
      RETURNING *
    `

    const result = await executeQuery(updateQuery, updateValues)

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating driver:", error)
    return NextResponse.json({ error: error.message || "Failed to update driver" }, { status: 500 })
  }
}

// Delete a driver (soft delete)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(["admin"])(request)
    const id = params.id

    // Check if driver exists
    const existingDriver = await executeQuery("SELECT * FROM drivers WHERE id = $1", [id])

    if (existingDriver.length === 0) {
      return NextResponse.json({ error: "Driver not found" }, { status: 404 })
    }

    // Check if driver has active routes
    const activeRoutes = await executeQuery(
      "SELECT * FROM routes WHERE driver_id = $1 AND status IN ('planned', 'active')",
      [id],
    )

    if (activeRoutes.length > 0) {
      return NextResponse.json({ error: "Cannot delete driver with active routes" }, { status: 400 })
    }

    // Soft delete driver
    await executeQuery("UPDATE drivers SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = $1", [id])

    return NextResponse.json({ success: true, message: "Driver deactivated successfully" })
  } catch (error) {
    console.error("Error deleting driver:", error)
    return NextResponse.json({ error: error.message || "Failed to delete driver" }, { status: 500 })
  }
}
