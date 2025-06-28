import { type NextRequest, NextResponse } from "next/server"
import { executeQuery, buildPaginationQuery, buildFilterQuery, buildSortQuery } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

// Get all shipments
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()(request)
    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const sortBy = searchParams.get("sort_by")
    const sortOrder = (searchParams.get("sort_order") || "DESC") as "ASC" | "DESC"

    // Build filters based on user role
    const filters: any = {
      status: searchParams.get("status"),
      priority: searchParams.get("priority"),
      cargo_type: searchParams.get("cargo_type"),
    }

    // Add date range filters
    const startDate = searchParams.get("start_date")
    const endDate = searchParams.get("end_date")

    let query = `
      SELECT s.*, 
             c.name as customer_name, c.email as customer_email,
             car.name as carrier_name, car.email as carrier_email,
             o.name as origin_name, o.city as origin_city,
             d.name as destination_name, d.city as destination_city
      FROM shipments s
      LEFT JOIN users c ON s.customer_id = c.id
      LEFT JOIN users car ON s.carrier_id = car.id
      LEFT JOIN locations o ON s.origin_id = o.id
      LEFT JOIN locations d ON s.destination_id = d.id
    `

    // Apply user-specific filters
    if (user.user_type === "individual") {
      filters.customer_id = user.id
    } else if (user.user_type === "carrier") {
      filters.carrier_id = user.id
    }
    // Admin and company users can see all shipments

    const { whereClause, params } = buildFilterQuery(filters)
    const queryParams = [...params]

    query += whereClause

    // Add date range filter
    if (startDate || endDate) {
      const dateCondition = []
      if (startDate) {
        queryParams.push(startDate)
        dateCondition.push(`s.created_at >= $${queryParams.length}`)
      }
      if (endDate) {
        queryParams.push(endDate)
        dateCondition.push(`s.created_at <= $${queryParams.length}`)
      }

      const dateClause = dateCondition.join(" AND ")
      query += whereClause ? ` AND ${dateClause}` : ` WHERE ${dateClause}`
    }

    // Add sorting
    query += ` ${buildSortQuery(sortBy, sortOrder)}`

    // Get total count
    const countQuery = query.replace(/SELECT.*FROM/, "SELECT COUNT(*) as total FROM").split("ORDER BY")[0]
    const countResult = await executeQuery(countQuery, queryParams)
    const total = Number.parseInt(countResult[0].total)

    // Apply pagination
    const paginatedQuery = buildPaginationQuery(query, page, limit)
    const shipments = await executeQuery(paginatedQuery, queryParams)

    return NextResponse.json({
      shipments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching shipments:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch shipments" }, { status: 500 })
  }
}

// Create a new shipment
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(["individual", "company", "admin"])(request)

    const {
      origin_id,
      destination_id,
      cargo_type,
      cargo_description,
      weight,
      volume,
      value,
      special_instructions,
      scheduled_pickup,
      scheduled_delivery,
      priority = "medium",
      insurance_required = false,
      signature_required = true,
      photo_required = false,
    } = await request.json()

    // Validate required fields
    if (!origin_id || !destination_id || !weight) {
      return NextResponse.json({ error: "Origin, destination, and weight are required" }, { status: 400 })
    }

    // Verify locations exist
    const locations = await executeQuery("SELECT id FROM locations WHERE id IN ($1, $2)", [origin_id, destination_id])

    if (locations.length !== 2) {
      return NextResponse.json({ error: "Invalid origin or destination location" }, { status: 400 })
    }

    // Generate tracking number
    const trackingNumber = `SHP-${Date.now()}-${Math.floor(Math.random() * 1000)}`

    // Create shipment
    const result = await executeQuery(
      `INSERT INTO shipments 
       (tracking_number, customer_id, origin_id, destination_id, cargo_type, cargo_description,
        weight, volume, value, special_instructions, scheduled_pickup, scheduled_delivery,
        priority, insurance_required, signature_required, photo_required)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
       RETURNING *`,
      [
        trackingNumber,
        user.id,
        origin_id,
        destination_id,
        cargo_type,
        cargo_description,
        weight,
        volume,
        value,
        special_instructions,
        scheduled_pickup,
        scheduled_delivery,
        priority,
        insurance_required,
        signature_required,
        photo_required,
      ],
    )

    // Create initial tracking entry
    await executeQuery(
      `INSERT INTO shipment_tracking (shipment_id, status, notes, updated_by)
       VALUES ($1, $2, $3, $4)`,
      [result[0].id, "pending", "Shipment created", user.id],
    )

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating shipment:", error)
    return NextResponse.json({ error: error.message || "Failed to create shipment" }, { status: 500 })
  }
}
