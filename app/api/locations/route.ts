import { type NextRequest, NextResponse } from "next/server"
import { executeQuery, buildPaginationQuery, buildFilterQuery, buildSortQuery } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

// Get all locations
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
      location_type: searchParams.get("location_type"),
      city: searchParams.get("city"),
      country: searchParams.get("country"),
      is_active: searchParams.get("is_active") === "false" ? false : true,
    }

    let query = "SELECT * FROM locations"

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
    const locations = await executeQuery(paginatedQuery, params)

    return NextResponse.json({
      locations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching locations:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch locations" }, { status: 500 })
  }
}

// Create a new location
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(["admin", "company", "carrier"])(request)

    const {
      name,
      address,
      city,
      state,
      country = "Morocco",
      postal_code,
      latitude,
      longitude,
      location_type = "address",
    } = await request.json()

    // Validate required fields
    if (!name || !address || !city || !country) {
      return NextResponse.json({ error: "Name, address, city, and country are required" }, { status: 400 })
    }

    // Create location
    const result = await executeQuery(
      `INSERT INTO locations 
       (name, address, city, state, country, postal_code, latitude, longitude, location_type)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [name, address, city, state, country, postal_code, latitude, longitude, location_type],
    )

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating location:", error)
    return NextResponse.json({ error: error.message || "Failed to create location" }, { status: 500 })
  }
}
