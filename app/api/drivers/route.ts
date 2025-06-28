import { type NextRequest, NextResponse } from "next/server"
import { executeQuery, buildPaginationQuery, buildFilterQuery, buildSortQuery } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

// Get all drivers
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
      license_type: searchParams.get("license_type"),
    }

    let query = `
      SELECT d.*, 
             u.name, u.email, u.city, u.country,
             l.name as current_location_name, l.city as current_location_city
      FROM drivers d
      LEFT JOIN users u ON d.user_id = u.id
      LEFT JOIN locations l ON d.current_location_id = l.id
    `

    // Add user-specific filters
    if (user.user_type === "carrier" || user.user_type === "company") {
      // For carriers/companies, show drivers associated with their trucks
      query = `
        SELECT DISTINCT d.*, 
               u.name, u.email, u.city, u.country,
               l.name as current_location_name, l.city as current_location_city
        FROM drivers d
        LEFT JOIN users u ON d.user_id = u.id
        LEFT JOIN locations l ON d.current_location_id = l.id
        LEFT JOIN trucks t ON t.owner_id = $1
        WHERE d.user_id = u.id
      `
      filters.user_id = user.id
    }

    const { whereClause, params } = buildFilterQuery(filters)

    // Adjust params for the modified query
    const queryParams = user.user_type === "carrier" || user.user_type === "company" ? [user.id, ...params] : params

    if (whereClause && (user.user_type === "carrier" || user.user_type === "company")) {
      query += ` AND ${whereClause.replace("WHERE ", "")}`
    } else {
      query += whereClause
    }

    // Add sorting
    query += ` ${buildSortQuery(sortBy, sortOrder)}`

    // Get total count
    const countQuery = query.replace(/SELECT.*FROM/, "SELECT COUNT(*) as total FROM").split("ORDER BY")[0]
    const countResult = await executeQuery(countQuery, queryParams)
    const total = Number.parseInt(countResult[0].total)

    // Apply pagination
    const paginatedQuery = buildPaginationQuery(query, page, limit)
    const drivers = await executeQuery(paginatedQuery, queryParams)

    return NextResponse.json({
      drivers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching drivers:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch drivers" }, { status: 500 })
  }
}

// Create a new driver
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(["carrier", "company", "admin"])(request)

    const {
      user_id,
      license_number,
      license_type,
      license_expiry_date,
      phone_number,
      emergency_contact_name,
      emergency_contact_phone,
      current_location_id,
    } = await request.json()

    // Validate required fields
    if (!user_id || !license_number || !license_type || !license_expiry_date || !phone_number) {
      return NextResponse.json(
        { error: "User ID, license number, license type, expiry date, and phone number are required" },
        { status: 400 },
      )
    }

    // Check if user exists and is not already a driver
    const existingUser = await executeQuery("SELECT * FROM users WHERE id = $1", [user_id])
    if (existingUser.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const existingDriver = await executeQuery("SELECT * FROM drivers WHERE user_id = $1", [user_id])
    if (existingDriver.length > 0) {
      return NextResponse.json({ error: "User is already registered as a driver" }, { status: 409 })
    }

    // Check if license number already exists
    const licenseCheck = await executeQuery("SELECT * FROM drivers WHERE license_number = $1", [license_number])
    if (licenseCheck.length > 0) {
      return NextResponse.json({ error: "License number already exists" }, { status: 409 })
    }

    // Create driver
    const result = await executeQuery(
      `INSERT INTO drivers 
       (user_id, license_number, license_type, license_expiry_date, phone_number, 
        emergency_contact_name, emergency_contact_phone, current_location_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        user_id,
        license_number,
        license_type,
        license_expiry_date,
        phone_number,
        emergency_contact_name,
        emergency_contact_phone,
        current_location_id,
      ],
    )

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating driver:", error)
    return NextResponse.json({ error: error.message || "Failed to create driver" }, { status: 500 })
  }
}
