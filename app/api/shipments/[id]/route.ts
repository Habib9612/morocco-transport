import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

// Get a specific shipment
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth()(request)
    const id = params.id

    const shipments = await executeQuery(
      `SELECT s.*, 
             c.name as customer_name, c.email as customer_email, c.phone_number as customer_phone,
             car.name as carrier_name, car.email as carrier_email, car.phone_number as carrier_phone,
             o.name as origin_name, o.address as origin_address, o.city as origin_city, o.latitude as origin_lat, o.longitude as origin_lng,
             d.name as destination_name, d.address as destination_address, d.city as destination_city, d.latitude as dest_lat, d.longitude as dest_lng
       FROM shipments s
       LEFT JOIN users c ON s.customer_id = c.id
       LEFT JOIN users car ON s.carrier_id = car.id
       LEFT JOIN locations o ON s.origin_id = o.id
       LEFT JOIN locations d ON s.destination_id = d.id
       WHERE s.id = $1`,
      [id],
    )

    if (shipments.length === 0) {
      return NextResponse.json({ error: "Shipment not found" }, { status: 404 })
    }

    const shipment = shipments[0]

    // Check permissions
    if (user.role !== "admin" && user.id !== shipment.customer_id && user.id !== shipment.carrier_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json(shipment)
  } catch (error) {
    console.error("Error fetching shipment:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch shipment" }, { status: 500 })
  }
}

// Update a shipment
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth()(request)
    const id = params.id

    // Check if shipment exists and user has permission
    const existingShipment = await executeQuery("SELECT * FROM shipments WHERE id = $1", [id])

    if (existingShipment.length === 0) {
      return NextResponse.json({ error: "Shipment not found" }, { status: 404 })
    }

    const shipment = existingShipment[0]

    // Check permissions
    if (user.role !== "admin" && user.id !== shipment.customer_id && user.id !== shipment.carrier_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    let updateData = await request.json()

    // Customers can only update certain fields
    if (user.id === shipment.customer_id && user.role !== "admin") {
      const allowedFields = ["special_instructions", "scheduled_pickup", "scheduled_delivery"]
      const filteredData = Object.keys(updateData)
        .filter((key) => allowedFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = updateData[key]
          return obj
        }, {})

      if (Object.keys(filteredData).length === 0) {
        return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
      }

      updateData = filteredData
    }

    // Build update query
    const updateFields = Object.entries(updateData)
      .filter(([_, value]) => value !== undefined)
      .map(([key], index) => `${key} = $${index + 1}`)

    const updateValues = Object.values(updateData).filter((value) => value !== undefined)
    updateValues.push(id)

    const updateQuery = `
      UPDATE shipments 
      SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${updateValues.length}
      RETURNING *
    `

    const result = await executeQuery(updateQuery, updateValues)

    // Add tracking entry for status changes
    if (updateData.status) {
      await executeQuery(
        `INSERT INTO shipment_tracking (shipment_id, status, notes, updated_by)
         VALUES ($1, $2, $3, $4)`,
        [id, updateData.status, `Status updated to ${updateData.status}`, user.id],
      )
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating shipment:", error)
    return NextResponse.json({ error: error.message || "Failed to update shipment" }, { status: 500 })
  }
}

// Cancel a shipment
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth()(request)
    const id = params.id

    // Check if shipment exists
    const existingShipment = await executeQuery("SELECT * FROM shipments WHERE id = $1", [id])

    if (existingShipment.length === 0) {
      return NextResponse.json({ error: "Shipment not found" }, { status: 404 })
    }

    const shipment = existingShipment[0]

    // Check permissions
    if (user.role !== "admin" && user.id !== shipment.customer_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Check if shipment can be cancelled
    if (["delivered", "cancelled"].includes(shipment.status)) {
      return NextResponse.json({ error: "Cannot cancel completed or already cancelled shipment" }, { status: 400 })
    }

    // Update shipment status to cancelled
    await executeQuery("UPDATE shipments SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP WHERE id = $1", [id])

    // Add tracking entry
    await executeQuery(
      `INSERT INTO shipment_tracking (shipment_id, status, notes, updated_by)
       VALUES ($1, $2, $3, $4)`,
      [id, "cancelled", "Shipment cancelled by customer", user.id],
    )

    return NextResponse.json({ success: true, message: "Shipment cancelled successfully" })
  } catch (error) {
    console.error("Error cancelling shipment:", error)
    return NextResponse.json({ error: error.message || "Failed to cancel shipment" }, { status: 500 })
  }
}
