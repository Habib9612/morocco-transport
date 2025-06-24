import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

// Get all shipments
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const customerId = searchParams.get("customer_id")

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

    const params: (string | number)[] = []
    const conditions: string[] = []

    if (status) {
      conditions.push("s.status = $" + (params.length + 1))
      params.push(status)
    }

    if (customerId) {
      conditions.push("s.customer_id = $" + (params.length + 1))
      params.push(customerId)
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ")
    }

    query += " ORDER BY s.created_at DESC"

    const shipments = await executeQuery(query, params)

    return NextResponse.json(shipments)
  } catch (error) {
    console.error("Error fetching shipments:", error)
    return NextResponse.json({ error: "Failed to fetch shipments" }, { status: 500 })
  }
}

// Create a new shipment
export async function POST(request: NextRequest) {
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
    } = await request.json()

    // Validate input
    if (!customer_id || !origin_id || !destination_id) {
      return NextResponse.json({ error: "Customer ID, origin ID, and destination ID are required" }, { status: 400 })
    }

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

    return NextResponse.json(shipmentWithDetails, { status: 201 })
  } catch (error) {
    console.error("Error creating shipment:", error)
    return NextResponse.json({ error: "Failed to create shipment" }, { status: 500 })
  }
}
