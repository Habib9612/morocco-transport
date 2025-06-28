import { type NextRequest, NextResponse } from "next/server"
import { executeQuery, buildPaginationQuery, buildFilterQuery, buildSortQuery } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

// Get all routes
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()(request)
    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const sortBy = searchParams.get("sort_by")
    const sortOrder = (searchParams.get("sort_order") || "DESC") as "ASC" | "DESC"

    // Build filters
    const filters: any = {
      status: searchParams.get("status"),
      truck_id: searchParams.get("truck_id"),
      driver_id: searchParams.get("driver_id"),
    }

    let query = `
      SELECT r.*, 
             s.tracking_number, s.customer_id, s.carrier_id,
             t.license_plate, t.model as truck_model,
             d.license_number, u.name as driver_name
      FROM routes r
      LEFT JOIN shipments s ON r.shipment_id = s.id
      LEFT JOIN trucks t ON r.truck_id = t.id
      LEFT JOIN drivers d ON r.driver_id = d.id
      LEFT JOIN users u ON d.user_id = u.id
    `

    // Apply user-specific filters
    if (user.user_type === "carrier" || user.user_type === "company") {
      // Show routes for trucks owned by the user
      query += ` WHERE t.owner_id = '${user.id}'`
    } else if (user.user_type === "individual") {
      // Show routes for shipments created by the user
      query += ` WHERE s.customer_id = '${user.id}'`
    }

    const { whereClause, params } = buildFilterQuery(filters)

    if (whereClause) {
      if (query.includes("WHERE")) {
        query += ` AND ${whereClause.replace("WHERE ", "")}`
      } else {
        query += whereClause
      }
    }

    // Add sorting
    query += ` ${buildSortQuery(sortBy, sortOrder)}`

    // Get total count
    const countQuery = query.replace(/SELECT.*FROM/, "SELECT COUNT(*) as total FROM").split("ORDER BY")[0]
    const countResult = await executeQuery(countQuery, params)
    const total = Number.parseInt(countResult[0].total)

    // Apply pagination
    const paginatedQuery = buildPaginationQuery(query, page, limit)
    const routes = await executeQuery(paginatedQuery, params)

    return NextResponse.json({
      routes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching routes:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch routes" }, { status: 500 })
  }
}

// Create a new route
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(["carrier", "company", "admin"])(request)

    const { shipment_id, truck_id, driver_id, route_name, start_time, estimated_duration, distance, notes } =
      await request.json()

    // Validate required fields
    if (!shipment_id || !truck_id || !driver_id) {
      return NextResponse.json({ error: "Shipment ID, truck ID, and driver ID are required" }, { status: 400 })
    }

    // Verify shipment exists and is available
    const shipments = await executeQuery("SELECT * FROM shipments WHERE id = $1", [shipment_id])
    if (shipments.length === 0) {
      return NextResponse.json({ error: "Shipment not found" }, { status: 404 })
    }

    const shipment = shipments[0]
    if (shipment.status !== "pending" && shipment.status !== "confirmed") {
      return NextResponse.json({ error: "Shipment is not available for routing" }, { status: 400 })
    }

    // Verify truck exists and is available
    const trucks = await executeQuery("SELECT * FROM trucks WHERE id = $1", [truck_id])
    if (trucks.length === 0) {
      return NextResponse.json({ error: "Truck not found" }, { status: 404 })
    }

    const truck = trucks[0]
    if (truck.status !== "available") {
      return NextResponse.json({ error: "Truck is not available" }, { status: 400 })
    }

    // Check truck ownership
    if (user.role !== "admin" && user.id !== truck.owner_id) {
      return NextResponse.json({ error: "Unauthorized to use this truck" }, { status: 403 })
    }

    // Verify driver exists and is available
    const drivers = await executeQuery("SELECT * FROM drivers WHERE id = $1", [driver_id])
    if (drivers.length === 0) {
      return NextResponse.json({ error: "Driver not found" }, { status: 404 })
    }

    const driver = drivers[0]
    if (driver.status !== "available") {
      return NextResponse.json({ error: "Driver is not available" }, { status: 400 })
    }

    // Create route
    const result = await executeQuery(
      `INSERT INTO routes 
       (shipment_id, truck_id, driver_id, route_name, start_time, estimated_duration, distance, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [shipment_id, truck_id, driver_id, route_name, start_time, estimated_duration, distance, notes],
    )

    // Update shipment status and assign carrier
    await executeQuery(
      "UPDATE shipments SET status = 'confirmed', carrier_id = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
      [user.id, shipment_id],
    )

    // Update truck and driver status
    await executeQuery("UPDATE trucks SET status = 'assigned' WHERE id = $1", [truck_id])
    await executeQuery("UPDATE drivers SET status = 'assigned' WHERE id = $1", [driver_id])

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating route:", error)
    return NextResponse.json({ error: error.message || "Failed to create route" }, { status: 500 })
  }
}
