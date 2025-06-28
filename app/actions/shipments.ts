"use server"

import { executeQuery } from "@/lib/db"

export async function getShipments(filters?: {
  status?: string
  customer_id?: string
}) {
  try {
    let query = `
      SELECT s.*, 
             o.name as origin_name, o.address as origin_address, o.city as origin_city,
             d.name as destination_name, d.address as destination_address, d.city as destination_city,
             u.name as customer_name, u.email as customer_email
      FROM shipments s
      JOIN locations o ON s.origin_id = o.id
      JOIN locations d ON s.destination_id = d.id
      JOIN users u ON s.customer_id = u.id
    `

    const params: any[] = []
    const conditions: string[] = []

    if (filters?.status) {
      conditions.push("s.status = $" + (params.length + 1))
      params.push(filters.status)
    }

    if (filters?.customer_id) {
      conditions.push("s.customer_id = $" + (params.length + 1))
      params.push(filters.customer_id)
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ")
    }

    query += " ORDER BY s.created_at DESC"

    const shipments = await executeQuery(query, params)

    return { success: true, shipments }
  } catch (error) {
    console.error("Error fetching shipments:", error)
    return { success: false, error: "Failed to fetch shipments" }
  }
}

export async function getShipmentById(id: string) {
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
      return { success: false, error: "Shipment not found" }
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

    return { success: true, shipment: shipmentData }
  } catch (error) {
    console.error("Error fetching shipment:", error)
    return { success: false, error: "Failed to fetch shipment" }
  }
}

export async function createShipment(data: {
  customer_id: string
  origin_id: string
  destination_id: string
  status?: string
  priority?: string
  weight?: number
  volume?: number
  scheduled_pickup?: string
  scheduled_delivery?: string
}) {
  try {
    const {
      customer_id,
      origin_id,
      destination_id,
      status,
      priority,
      weight,
      volume,
      scheduled_pickup,
      scheduled_delivery,
    } = data

    // Generate tracking number
    const trackingNumber = "SHP-" + Date.now() + "-" + Math.floor(Math.random() * 1000)

    // Create shipment
    const result = await executeQuery(
      `INSERT INTO shipments 
       (tracking_number, customer_id, origin_id, destination_id, status, priority, 
        weight, volume, scheduled_pickup, scheduled_delivery) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       RETURNING *`,
      [
        trackingNumber,
        customer_id,
        origin_id,
        destination_id,
        status || "pending",
        priority || "medium",
        weight,
        volume,
        scheduled_pickup,
        scheduled_delivery,
      ],
    )

    // Get related data
    const shipment = result[0]

    const [origin] = await executeQuery("SELECT * FROM locations WHERE id = $1", [origin_id])
    const [destination] = await executeQuery("SELECT * FROM locations WHERE id = $1", [destination_id])
    const [customer] = await executeQuery("SELECT name, email FROM users WHERE id = $1", [customer_id])

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

    return { success: true, shipment: shipmentWithDetails }
  } catch (error) {
    console.error("Error creating shipment:", error)
    return { success: false, error: "Failed to create shipment" }
  }
}

export async function updateShipment(
  id: string,
  data: {
    status?: string
    priority?: string
    weight?: number
    volume?: number
    scheduled_pickup?: string
    scheduled_delivery?: string
    actual_pickup?: string
    actual_delivery?: string
  },
) {
  try {
    const { status, priority, weight, volume, scheduled_pickup, scheduled_delivery, actual_pickup, actual_delivery } =
      data

    // Check if shipment exists
    const existingShipment = await executeQuery("SELECT * FROM shipments WHERE id = $1", [id])

    if (existingShipment.length === 0) {
      return { success: false, error: "Shipment not found" }
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

    return { success: true, shipment: shipmentWithDetails }
  } catch (error) {
    console.error("Error updating shipment:", error)
    return { success: false, error: "Failed to update shipment" }
  }
}

export async function deleteShipment(id: string) {
  try {
    // Check if shipment exists
    const existingShipment = await executeQuery("SELECT * FROM shipments WHERE id = $1", [id])

    if (existingShipment.length === 0) {
      return { success: false, error: "Shipment not found" }
    }

    // Check if shipment has active routes
    const activeRoutes = await executeQuery(
      `SELECT * FROM routes 
       WHERE shipment_id = $1 
       AND status NOT IN ('completed', 'cancelled')`,
      [id],
    )

    if (activeRoutes.length > 0) {
      return { success: false, error: "Cannot delete shipment with active routes" }
    }

    // Delete associated routes
    await executeQuery("DELETE FROM routes WHERE shipment_id = $1", [id])

    // Delete shipment
    await executeQuery("DELETE FROM shipments WHERE id = $1", [id])

    return { success: true }
  } catch (error) {
    console.error("Error deleting shipment:", error)
    return { success: false, error: "Failed to delete shipment" }
  }
}
