import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

// Get a specific truck
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const trucks = await executeQuery("SELECT * FROM trucks WHERE id = $1", [id])

    if (trucks.length === 0) {
      return NextResponse.json({ error: "Truck not found" }, { status: 404 })
    }

    return NextResponse.json(trucks[0])
  } catch (error) {
    console.error("Error fetching truck:", error)
    return NextResponse.json({ error: "Failed to fetch truck" }, { status: 500 })
  }
}

// Update a truck
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const { license_plate, model, capacity, status, fuel_efficiency, last_maintenance_date, next_maintenance_date } =
      await request.json()

    // Check if truck exists
    const existingTruck = await executeQuery("SELECT * FROM trucks WHERE id = $1", [id])

    if (existingTruck.length === 0) {
      return NextResponse.json({ error: "Truck not found" }, { status: 404 })
    }

    // Update truck
    const result = await executeQuery(
      `UPDATE trucks 
       SET license_plate = $1, model = $2, capacity = $3, status = $4, 
           fuel_efficiency = $5, last_maintenance_date = $6, next_maintenance_date = $7,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [license_plate, model, capacity, status, fuel_efficiency, last_maintenance_date, next_maintenance_date, id],
    )

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating truck:", error)
    return NextResponse.json({ error: "Failed to update truck" }, { status: 500 })
  }
}

// Delete a truck
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Check if truck exists
    const existingTruck = await executeQuery("SELECT * FROM trucks WHERE id = $1", [id])

    if (existingTruck.length === 0) {
      return NextResponse.json({ error: "Truck not found" }, { status: 404 })
    }

    // Check if truck is being used in any active routes
    const activeRoutes = await executeQuery(
      `SELECT * FROM routes 
       WHERE truck_id = $1 
       AND status NOT IN ('completed', 'cancelled')`,
      [id],
    )

    if (activeRoutes.length > 0) {
      return NextResponse.json({ error: "Cannot delete truck that is assigned to active routes" }, { status: 400 })
    }

    // Delete truck
    await executeQuery("DELETE FROM trucks WHERE id = $1", [id])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting truck:", error)
    return NextResponse.json({ error: "Failed to delete truck" }, { status: 500 })
  }
}
