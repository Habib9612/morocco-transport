import { type NextRequest, NextResponse } from "next/server"
import { executeQuery, buildPaginationQuery, buildFilterQuery, buildSortQuery } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

// Get all trucks
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
      truck_type: searchParams.get("truck_type"),
      fuel_type: searchParams.get("fuel_type"),
    }

    // Add owner filter based on user type
    if (user.user_type === "carrier" || user.user_type === "company") {
      filters.owner_id = user.id
    }

    let query = `
      SELECT t.*, 
             u.name as owner_name, u.email as owner_email,
             l.name as current_location_name, l.city as current_location_city
      FROM trucks t
      LEFT JOIN users u ON t.owner_id = u.id
      LEFT JOIN locations l ON t.current_location_id = l.id
    `

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
    const trucks = await executeQuery(paginatedQuery, params)

    return NextResponse.json({
      trucks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching trucks:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch trucks" }, { status: 500 })
  }
}

// Create a new truck
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(["carrier", "company", "admin"])(request)

    const {
      license_plate,
      model,
      make,
      year,
      capacity,
      volume_capacity,
      truck_type,
      fuel_type = "diesel",
      fuel_efficiency,
      current_location_id,
      insurance_expiry,
      registration_expiry,
    } = await request.json()

    // Validate required fields
    if (!license_plate || !model || !capacity || !truck_type) {
      return NextResponse.json(
        { error: "License plate, model, capacity, and truck type are required" },
        { status: 400 },
      )
    }

    // Check if license plate already exists
    const existingTruck = await executeQuery("SELECT id FROM trucks WHERE license_plate = $1", [license_plate])

    if (existingTruck.length > 0) {
      return NextResponse.json({ error: "Truck with this license plate already exists" }, { status: 409 })
    }

    // Create truck
    const result = await executeQuery(
      `INSERT INTO trucks 
       (owner_id, license_plate, model, make, year, capacity, volume_capacity, truck_type, 
        fuel_type, fuel_efficiency, current_location_id, insurance_expiry, registration_expiry)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING *`,
      [
        user.id,
        license_plate,
        model,
        make,
        year,
        capacity,
        volume_capacity,
        truck_type,
        fuel_type,
        fuel_efficiency,
        current_location_id,
        insurance_expiry,
        registration_expiry,
      ],
    )

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating truck:", error)
    return NextResponse.json({ error: error.message || "Failed to create truck" }, { status: 500 })
  }
}
