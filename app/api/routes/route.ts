import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

// Get all routes
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const truckId = searchParams.get("truck_id")
    const driverId = searchParams.get("driver_id")

    let query = `
      SELECT r.*, 
             s.tracking_number, s.status as shipment_status,
             t.license_plate, t.model as truck_model,
             d.id as driver_id, u.name as driver_name
      FROM routes r
      JOIN shipments s ON r.shipment_id = s.id
      LEFT JOIN trucks t ON r.truck_id = t.id
      LEFT JOIN drivers d ON r.driver_id = d.id
      LEFT JOIN users u ON d.user_id = u.id
    `

    const params: any[] = []
    const conditions: string[] = []

    if (status) {
      conditions.push("r.status = $" + (params.length + 1))
      params.push(status)
    }

    if (truckId) {
      conditions.push("r.truck_id = $" + (params.length + 1))
      params.push(truckId)
    }

    if (driverId) {
      conditions.push("r.driver_id = $" + (params.length + 1))
      params.push(driverId)
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ")
    }

    query += " ORDER BY r.created_at DESC"

    const routes = await executeQuery(query, params)

    return NextResponse.json(routes)
  } catch (error) {
    console.error("Error fetching routes:", error)
    return NextResponse.json({ error: "Failed to fetch routes" }, { status: 500 })
  }
}

// Create a new route
export async function POST(request: NextRequest) {
  try {
    const { shipment_id, truck_id, driver_id, start_time, end_time, distance, status } = await request.json()

    // Validate input
    if (!shipment_id) {
      return NextResponse.json({ error: "Shipment ID is required" }, { status: 400 })
    }

    // Check if shipment exists
    const shipments = await executeQuery("SELECT * FROM shipments WHERE id = $1", [shipment_id])

    if (shipments.length === 0) {
      return NextResponse.json({ error: "Shipment not found" }, { status: 404 })
    }

    // Check if truck exists and is available
    if (truck_id) {
      const trucks = await executeQuery("SELECT * FROM trucks WHERE id = $1", [truck_id])

      if (trucks.length === 0) {
        return NextResponse.json({ error: "Truck not found" }, { status: 404 })
      }

      if (trucks[0].status !== "available") {
        return NextResponse.json({ error: "Truck is not available" }, { status: 400 })
      }
    }

    // Check if driver exists and is available
    if (driver_id) {
      const drivers = await executeQuery("SELECT * FROM drivers WHERE id = $1", [driver_id])

      if (drivers.length === 0) {
        return NextResponse.json({ error: "Driver not found" }, { status: 404 })
      }

      if (drivers[0].status !== "available") {
        return NextResponse.json({ error: "Driver is not available" }, { status: 400 })
      }
    }

    // Create route
    const result = await executeQuery(
      `INSERT INTO routes 
       (shipment_id, truck_id, driver_id, start_time, end_time, distance, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [shipment_id, truck_id, driver_id, start_time, end_time, distance, status || "planned"],
    )

    // Update truck status if assigned
    if (truck_id) {
      await executeQuery("UPDATE trucks SET status = $1 WHERE id = $2", ["assigned", truck_id])
    }

    // Update driver status if assigned
    if (driver_id) {
      await executeQuery("UPDATE drivers SET status = $1 WHERE id = $2", ["assigned", driver_id])
    }

    // Get related data
    const route = result[0]

    const [shipment] = await executeQuery("SELECT tracking_number, status FROM shipments WHERE id = $1", [shipment_id])

    let truckData = null
    if (truck_id) {
      const [truck] = await executeQuery("SELECT license_plate, model FROM trucks WHERE id = $1", [truck_id])
      truckData = truck
    }

    let driverData = null
    if (driver_id) {
      const [driver] = await executeQuery(
        "SELECT d.id, u.name FROM drivers d JOIN users u ON d.user_id = u.id WHERE d.id = $1",
        [driver_id],
      )
      driverData = driver
    }

    const routeWithDetails = {
      ...route,
      tracking_number: shipment.tracking_number,
      shipment_status: shipment.status,
      license_plate: truckData?.license_plate,
      truck_model: truckData?.model,
      driver_id: driverData?.id,
      driver_name: driverData?.name,
    }

    return NextResponse.json(routeWithDetails, { status: 201 })
  } catch (error) {
    console.error("Error creating route:", error)
    return NextResponse.json({ error: "Failed to create route" }, { status: 500 })
  }
}
