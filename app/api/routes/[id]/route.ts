import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

// Get a specific route
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth()(request)
    const id = params.id

    const routes = await executeQuery(
      `SELECT r.*, 
             s.tracking_number, s.customer_id, s.carrier_id, s.origin_id, s.destination_id,
             t.license_plate, t.model as truck_model, t.owner_id as truck_owner_id,
             d.license_number, u.name as driver_name, d.user_id as driver_user_id,
             o.name as origin_name, o.city as origin_city,
             dest.name as destination_name, dest.city as destination_city
       FROM routes r
       LEFT JOIN shipments s ON r.shipment_id = s.id
       LEFT JOIN trucks t ON r.truck_id = t.id
       LEFT JOIN drivers d ON r.driver_id = d.id
       LEFT JOIN users u ON d.user_id = u.id
       LEFT JOIN locations o ON s.origin_id = o.id
       LEFT JOIN locations dest ON s.destination_id = dest.id
       WHERE r.id = $1`,
      [id],
    )

    if (routes.length === 0) {
      return NextResponse.json({ error: "Route not found" }, { status: 404 })
    }

    const route = routes[0]

    // Check permissions
    if (
      user.role !== "admin" &&
      user.id !== route.customer_id &&
      user.id !== route.carrier_id &&
      user.id !== route.truck_owner_id &&
      user.id !== route.driver_user_id
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get waypoints
    const waypoints = await executeQuery(
      `SELECT rw.*, l.name as location_name, l.address, l.city
       FROM route_waypoints rw
       LEFT JOIN locations l ON rw.location_id = l.id
       WHERE rw.route_id = $1
       ORDER BY rw.sequence_number`,
      [id],
    )

    return NextResponse.json({
      ...route,
      waypoints,
    })
  } catch (error) {
    console.error("Error fetching route:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch route" }, { status: 500 })
  }
}

// Update a route
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth()(request)
    const id = params.id

    // Check if route exists
    const existingRoute = await executeQuery(
      `SELECT r.*, t.owner_id as truck_owner_id, d.user_id as driver_user_id
       FROM routes r
       LEFT JOIN trucks t ON r.truck_id = t.id
       LEFT JOIN drivers d ON r.driver_id = d.id
       WHERE r.id = $1`,
      [id],
    )

    if (existingRoute.length === 0) {
      return NextResponse.json({ error: "Route not found" }, { status: 404 })
    }

    const route = existingRoute[0]

    // Check permissions
    if (user.role !== "admin" && user.id !== route.truck_owner_id && user.id !== route.driver_user_id) {
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
      UPDATE routes 
      SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${updateValues.length}
      RETURNING *
    `

    const result = await executeQuery(updateQuery, updateValues)

    // Update truck and driver status based on route status
    if (updateData.status === "completed") {
      await executeQuery("UPDATE trucks SET status = 'available' WHERE id = $1", [route.truck_id])
      await executeQuery("UPDATE drivers SET status = 'available' WHERE id = $1", [route.driver_id])
    } else if (updateData.status === "active") {
      await executeQuery("UPDATE trucks SET status = 'assigned' WHERE id = $1", [route.truck_id])
      await executeQuery("UPDATE drivers SET status = 'on_duty' WHERE id = $1", [route.driver_id])
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating route:", error)
    return NextResponse.json({ error: error.message || "Failed to update route" }, { status: 500 })
  }
}

// Cancel a route
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth()(request)
    const id = params.id

    // Check if route exists
    const existingRoute = await executeQuery(
      `SELECT r.*, t.owner_id as truck_owner_id, s.customer_id
       FROM routes r
       LEFT JOIN trucks t ON r.truck_id = t.id
       LEFT JOIN shipments s ON r.shipment_id = s.id
       WHERE r.id = $1`,
      [id],
    )

    if (existingRoute.length === 0) {
      return NextResponse.json({ error: "Route not found" }, { status: 404 })
    }

    const route = existingRoute[0]

    // Check permissions
    if (user.role !== "admin" && user.id !== route.truck_owner_id && user.id !== route.customer_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Check if route can be cancelled
    if (["completed", "cancelled"].includes(route.status)) {
      return NextResponse.json({ error: "Cannot cancel completed or already cancelled route" }, { status: 400 })
    }

    // Update route status to cancelled
    await executeQuery("UPDATE routes SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP WHERE id = $1", [id])

    // Update shipment status back to pending
    await executeQuery(
      "UPDATE shipments SET status = 'pending', carrier_id = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = $1",
      [route.shipment_id],
    )

    // Update truck and driver status back to available
    await executeQuery("UPDATE trucks SET status = 'available' WHERE id = $1", [route.truck_id])
    await executeQuery("UPDATE drivers SET status = 'available' WHERE id = $1", [route.driver_id])

    return NextResponse.json({ success: true, message: "Route cancelled successfully" })
  } catch (error) {
    console.error("Error cancelling route:", error)
    return NextResponse.json({ error: error.message || "Failed to cancel route" }, { status: 500 })
  }
}
