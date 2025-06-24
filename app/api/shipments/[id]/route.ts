import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { auth } from "@/lib/auth"

// Get a specific shipment
export const GET = auth(async (req) => {
  if (!req.auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = req.url.split('/').pop();

  try {
    const shipments = await executeQuery(
      `SELECT s.*, 
              o.name as origin_name, o.address as origin_address, o.city as origin_city,
              d.name as destination_name, d.address as destination_address, d.city as destination_city,
              u.name as customer_name, u.email as customer_email
       FROM shipments s
       JOIN locations o ON s.origin_id = o.id
       JOIN locations d ON s.destination_id = d.id
       JOIN users u ON s.customer_id = u.id
       WHERE s.id = $1`,
      [id],
    )

    if (shipments.length === 0) {
      return NextResponse.json({ error: "Shipment not found" }, { status: 404 })
    }

    // Get associated route if exists
    const routes = await executeQuery(
      `SELECT r.*, 
              t.license_plate, t.model as truck_model,
              d.id as driver_id, u.name as driver_name
       FROM routes r
       LEFT JOIN trucks t ON r.truck_id = t.id
       LEFT JOIN drivers d ON r.driver_id = d.id
       LEFT JOIN users u ON d.user_id = u.id
       WHERE r.shipment_id = $1
       ORDER BY r.created_at DESC
       LIMIT 1`,
      [id],
    )

    const shipmentData = {
      ...shipments[0],
      route: routes.length > 0 ? routes[0] : null,
    }

    return NextResponse.json(shipmentData)
  } catch (error) {
    console.error("Error fetching shipment:", error)
    return NextResponse.json({ error: "Failed to fetch shipment" }, { status: 500 })
  }
});

// Update a shipment
export const PUT = auth(async (req) => {
  if (!req.auth || req.auth.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const id = req.url.split('/').pop();
  const { status, priority, weight, volume, scheduled_pickup, scheduled_delivery, actual_pickup, actual_delivery } =
    await req.json();

  try {
    // Check if shipment exists
    const existingShipment = await executeQuery("SELECT * FROM shipments WHERE id = $1", [id])

    if (existingShipment.length === 0) {
      return NextResponse.json({ error: "Shipment not found" }, { status: 404 })
    }

    // Update shipment
    const result = await executeQuery(
      `UPDATE shipments 
       SET status = $1, priority = $2, weight = $3, volume = $4,
           scheduled_pickup = $5, scheduled_delivery = $6,
           actual_pickup = $7, actual_delivery = $8,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [status, priority, weight, volume, scheduled_pickup, scheduled_delivery, actual_pickup, actual_delivery, id],
    )

    // Get related data
    const shipment = result[0]

    const [origin] = await executeQuery("SELECT * FROM locations WHERE id = $1", [shipment.origin_id])
    const [destination] = await executeQuery("SELECT * FROM locations WHERE id = $1", [shipment.destination_id])
    const [customer] = await executeQuery("SELECT name, email FROM users WHERE id = $1", [shipment.customer_id])

    const shipmentWithDetails = {
      ...shipment,
      origin_name: origin.name,
      origin_address: origin.address,
      origin_city: origin.city,
      destination_name: destination.name,
      destination_address: destination.address,
      destination_city: destination.city,
      customer_name: customer.name,
      customer_email: customer.email,
    }

    return NextResponse.json(shipmentWithDetails)
  } catch (error) {
    console.error("Error updating shipment:", error)
    return NextResponse.json({ error: "Failed to update shipment" }, { status: 500 })
  }
});

// Delete a shipment
export const DELETE = auth(async (req) => {
  if (!req.auth || req.auth.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const id = req.url.split('/').pop();

  try {
    // Check if shipment exists
    const existingShipment = await executeQuery("SELECT * FROM shipments WHERE id = $1", [id])

    if (existingShipment.length === 0) {
      return NextResponse.json({ error: "Shipment not found" }, { status: 404 })
    }

    // Check if shipment has active routes
    const activeRoutes = await executeQuery(
      `SELECT * FROM routes 
       WHERE shipment_id = $1 
       AND status NOT IN ('completed', 'cancelled')`,
      [id],
    )

    if (activeRoutes.length > 0) {
      return NextResponse.json({ error: "Cannot delete shipment with active routes" }, { status: 400 })
    }

    // Delete associated routes
    await executeQuery("DELETE FROM routes WHERE shipment_id = $1", [id])

    // Delete shipment
    await executeQuery("DELETE FROM shipments WHERE id = $1", [id])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting shipment:", error)
    return NextResponse.json({ error: "Failed to delete shipment" }, { status: 500 })
  }
});
