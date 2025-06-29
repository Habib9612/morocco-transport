import { type NextRequest, NextResponse } from "next/server"
import { executeQuery, buildPaginationQuery, buildSearchQuery, buildFilterQuery, buildSortQuery } from "@/lib/db"
import { requireAuth, hashPassword } from "@/lib/auth"

// Get all users with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    await requireAuth(["admin"])(request)

    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search")
    const sortBy = searchParams.get("sort_by")
    const sortOrder = (searchParams.get("sort_order") || "DESC") as "ASC" | "DESC"

    // Build filters
    const filters = {
      user_type: searchParams.get("user_type"),
      role: searchParams.get("role"),
      is_active:
        searchParams.get("is_active") === "true" ? true : searchParams.get("is_active") === "false" ? false : undefined,
      country: searchParams.get("country"),
    }

    let query = `
      SELECT id, name, email, role, user_type, phone_number, address, city, state, country, 
             postal_code, is_verified, is_active, created_at, updated_at
      FROM users
    `

    const { whereClause, params } = buildFilterQuery(filters)
    const queryParams = [...params]

    // Add search condition
    if (search) {
      const searchCondition = buildSearchQuery(search, ["name", "email", "city"])
      if (searchCondition) {
        const searchClause = whereClause ? ` AND ${searchCondition}` : ` WHERE ${searchCondition}`
        query += whereClause + searchClause
      } else {
        query += whereClause
      }
    } else {
      query += whereClause
    }

    // Add sorting
    query += ` ${buildSortQuery(sortBy, sortOrder)}`

    // Get total count for pagination
    const countQuery = query.replace(/SELECT.*FROM/, "SELECT COUNT(*) as total FROM").split("ORDER BY")[0]
    const countResult = await executeQuery(countQuery, queryParams)
    const total = Number.parseInt(countResult[0].total)

    // Apply pagination
    const paginatedQuery = buildPaginationQuery(query, page, limit)
    const users = await executeQuery(paginatedQuery, queryParams)

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch users" }, { status: 500 })
  }
}

// Create a new user
export async function POST(request: NextRequest) {
  try {
    await requireAuth(["admin"])(request)

    const {
      name,
      email,
      password,
      role = "user",
      user_type = "individual",
      phone_number,
      address,
      city,
      state,
      country = "Morocco",
      postal_code,
    } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await executeQuery("SELECT * FROM users WHERE email = $1", [email])

    if (existingUser.length > 0) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const result = await executeQuery(
      `INSERT INTO users 
       (name, email, password_hash, role, user_type, phone_number, address, city, state, country, postal_code) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
       RETURNING id, name, email, role, user_type, phone_number, address, city, state, country, postal_code, is_verified, is_active, created_at`,
      [name, email, hashedPassword, role, user_type, phone_number, address, city, state, country, postal_code],
    )

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: error.message || "Failed to create user" }, { status: 500 })
  }
}
