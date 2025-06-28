import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

// Get a specific maintenance record
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth()(request)
    const id = params.id

    const maintenance = await executeQuery(
      `SELECT m.*, 
             t.license_plate, t.model as truck_model, t.owner_id,
             u.name as owner_name, u.email as owner_email
       FROM maintenance m
       LEFT JOIN trucks t ON m.truck_id = t.id
       LEFT JOIN users u ON t.owner_id = u.id
       WHERE m.id = $1`,
      [id],
    )

    if (maintenance.length === 0) {
      return NextResponse.json({ error: "Maintenance record not found" }, { status: 404 })
    }

    const record = maintenance[0]

    // Check permissions
    if (user.role !== "admin" && user.id !== record.owner_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json(record)
  } catch (error) {
    console.error("Error fetching maintenance record:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch maintenance record" }, { status: 500 })
  }
}

// Update a maintenance record
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth()(request)
    const id = params.id

    // Check if maintenance record exists
    const existingMaintenance = await executeQuery(
      `SELECT m.*, t.owner_id
       FROM maintenance m
       LEFT JOIN trucks t ON m.truck_id = t.id
       WHERE m.id = $1`,
      [id],
    )

    if (existingMaintenance.length === 0) {
      return NextResponse.json({ error: "Maintenance record not found" }, { status: 404 })
    }

    const record = existingMaintenance[0]

    // Check permissions
    if (user.role !== "admin" && user.id !== record.owner_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const updateData = await request.json()

    // Build update query
    const updateFields = Object.entries(updateData)
      .filter(([_, value]) => value !== undefined)
      .map(([key], index) => `${key} = $${index + 1}`)

    const updateValues = Object.values(updateData).filter((value) => value !== undefined)
    updateValues.push(id)

    const updateQuery = `
      UPDATE maintenance 
      SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${updateValues.length}
      RETURNING *
    `

    const result = await executeQuery(updateQuery, updateValues)

    // Update truck status based on maintenance status
    if (updateData.status === "completed") {
      await executeQuery("UPDATE trucks SET status = 'available', last_maintenance_date = CURRENT_DATE WHERE id = $1", [
        record.truck_id,
      ])
    } else if (updateData.status === "in_progress") {
      await executeQuery("UPDATE trucks SET status = 'maintenance' WHERE id = $1", [record.truck_id])
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating maintenance record:", error)
    return NextResponse.json({ error: error.message || "Failed to update maintenance record" }, { status: 500 })
  }
}

// Delete a maintenance record
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth()(request)
    const id = params.id

    // Check if maintenance record exists
    const existingMaintenance = await executeQuery(
      `SELECT m.*, t.owner_id
       FROM maintenance m
       LEFT JOIN trucks t ON m.truck_id = t.id
       WHERE m.id = $1`,
      [id],
    )

    if (existingMaintenance.length === 0) {
      return NextResponse.json({ error: "Maintenance record not found" }, { status: 404 })
    }

    const record = existingMaintenance[0]

    // Check permissions
    if (user.role !== "admin" && user.id !== record.owner_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Only allow deletion if maintenance is not in progress or completed
    if (["in_progress", "completed"].includes(record.status)) {
      return NextResponse.json(
        { error: "Cannot delete maintenance record that is in progress or completed" },
        { status: 400 },
      )
    }

    // Delete maintenance record
    await executeQuery("DELETE FROM maintenance WHERE id = $1", [id])

    return NextResponse.json({ success: true, message: "Maintenance record deleted successfully" })
  } catch (error) {
    console.error("Error deleting maintenance record:", error)
    return NextResponse.json({ error: error.message || "Failed to delete maintenance record" }, { status: 500 })
  }
}
