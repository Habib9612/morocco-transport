import { type NextRequest, NextResponse } from "next/server"
import { executeQuery, buildPaginationQuery, buildFilterQuery, buildSortQuery } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

// Get all maintenance records
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
      maintenance_type: searchParams.get("maintenance_type"),
      priority: searchParams.get("priority"),
    }

    let query = `
      SELECT m.*, 
             t.license_plate, t.model as truck_model, t.owner_id,
             u.name as owner_name
      FROM maintenance m
      LEFT JOIN trucks t ON m.truck_id = t.id
      LEFT JOIN users u ON t.owner_id = u.id
    `

    // Apply user-specific filters
    if (user.user_type === "carrier" || user.user_type === "company") {
      filters.owner_id = user.id
    }

    const { whereClause, params } = buildFilterQuery(filters)
    query += whereClause

    // Add sorting
    query += ` ${buildSortQuery(sortBy, sortOrder)}`

    // Get total count
    const countQuery = query.replace(/SELECT.*FROM/, "SELECT COUNT(*) as total FROM").split("ORDER BY")[0]
    const countResult = await executeQuery(countQuery, params)
    const total = Number.parseInt(countResult[0].total)

    // Apply pagination
    const paginatedQuery = buildPaginationQuery(query, page, limit)
    const maintenance = await executeQuery(paginatedQuery, params)

    return NextResponse.json({
      maintenance,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching maintenance records:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch maintenance records" }, { status: 500 })
  }
}

// Create a new maintenance record
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(["carrier", "company", "admin"])(request)

    const {
      truck_id,
      maintenance_type,
      service_type,
      description,
      scheduled_date,
      cost,
      service_provider,
      service_provider_contact,
      priority = "medium",
      notes,
    } = await request.json()

    // Validate required fields
    if (!truck_id || !maintenance_type || !service_type || !description) {
      return NextResponse.json(
        { error: "Truck ID, maintenance type, service type, and description are required" },
        { status: 400 },
      )
    }

    // Verify truck exists and user has permission
    const trucks = await executeQuery("SELECT * FROM trucks WHERE id = $1", [truck_id])
    if (trucks.length === 0) {
      return NextResponse.json({ error: "Truck not found" }, { status: 404 })
    }

    const truck = trucks[0]
    if (user.role !== "admin" && user.id !== truck.owner_id) {
      return NextResponse.json({ error: "Unauthorized to schedule maintenance for this truck" }, { status: 403 })
    }

    // Create maintenance record
    const result = await executeQuery(
      `INSERT INTO maintenance 
       (truck_id, maintenance_type, service_type, description, scheduled_date, cost, 
        service_provider, service_provider_contact, priority, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        truck_id,
        maintenance_type,
        service_type,
        description,
        scheduled_date,
        cost,
        service_provider,
        service_provider_contact,
        priority,
        notes,
      ],
    )

    // Update truck status if maintenance is urgent or scheduled for today
    if (priority === "urgent" || (scheduled_date && new Date(scheduled_date) <= new Date())) {
      await executeQuery("UPDATE trucks SET status = 'maintenance' WHERE id = $1", [truck_id])
    }

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating maintenance record:", error)
    return NextResponse.json({ error: error.message || "Failed to create maintenance record" }, { status: 500 })
  }
}
