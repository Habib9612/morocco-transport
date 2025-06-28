import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

// Get tracking history for a shipment
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth()(request)
    const shipmentId = params.id

    // Verify shipment exists and user has permission
    const shipments = await executeQuery("SELECT * FROM shipments WHERE id = $1", [shipmentId])

    if (shipments.length === 0) {
      return NextResponse.json({ error: "Shipment not found" }, { status: 404 })
    }

    const shipment = shipments[0]

    // Check permissions
    if (user.role !== "admin" && user.id !== shipment.customer_id && user.id !== shipment.carrier_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get tracking history
    const tracking = await executeQuery(
      `SELECT st.*, 
             l.name as location_name, l.address, l.city, l.latitude, l.longitude,
             u.name as updated_by_name
       FROM shipment_tracking st
       LEFT JOIN locations l ON st.location_id = l.id
       LEFT JOIN users u ON st.updated_by = u.id
       WHERE st.shipment_id = $1
       ORDER BY st.timestamp DESC`,
      [shipmentId],
    )

    return NextResponse.json({
      shipment_id: shipmentId,
      tracking_history: tracking,
      total_updates: tracking.length,
    })
  } catch (error) {
    console.error("Error fetching tracking:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch tracking" }, { status: 500 })
  }
}

// Add tracking update
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth()(request)
    const shipmentId = params.id
    const { status, location_id, latitude, longitude, notes } = await request.json()

    // Verify shipment exists
    const shipments = await executeQuery("SELECT * FROM shipments WHERE id = $1", [shipmentId])

    if (shipments.length === 0) {
      return NextResponse.json({ error: "Shipment not found" }, { status: 404 })
    }

    const shipment = shipments[0]

    // Check permissions - only carrier or admin can add tracking updates
    if (user.role !== "admin" && user.id !== shipment.carrier_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Validate status
    const validStatuses = ["pending", "confirmed", "picked_up", "in_transit", "delivered", "cancelled"]
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // Add tracking entry
    const result = await executeQuery(
      `INSERT INTO shipment_tracking 
       (shipment_id, status, location_id, latitude, longitude, notes, updated_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [shipmentId, status, location_id, latitude, longitude, notes, user.id],
    )

    // Update shipment status if provided
    if (status) {
      await executeQuery("UPDATE shipments SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2", [
        status,
        shipmentId,
      ])

      // Update timestamps based on status
      if (status === "picked_up") {
        await executeQuery("UPDATE shipments SET actual_pickup = CURRENT_TIMESTAMP WHERE id = $1", [shipmentId])
      } else if (status === "delivered") {
        await executeQuery("UPDATE shipments SET actual_delivery = CURRENT_TIMESTAMP WHERE id = $1", [shipmentId])
      }
    }

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error adding tracking:", error)
    return NextResponse.json({ error: error.message || "Failed to add tracking" }, { status: 500 })
  }
}
