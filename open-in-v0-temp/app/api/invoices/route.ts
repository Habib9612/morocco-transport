import { type NextRequest, NextResponse } from "next/server"
import { executeQuery, buildPaginationQuery, buildFilterQuery, buildSortQuery } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

// Get all invoices
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
    }

    let query = `
      SELECT i.*, 
             s.tracking_number,
             c.name as customer_name, c.email as customer_email,
             car.name as carrier_name, car.email as carrier_email
      FROM invoices i
      LEFT JOIN shipments s ON i.shipment_id = s.id
      LEFT JOIN users c ON i.customer_id = c.id
      LEFT JOIN users car ON i.carrier_id = car.id
    `

    // Apply user-specific filters
    if (user.user_type === "individual") {
      filters.customer_id = user.id
    } else if (user.user_type === "carrier") {
      filters.carrier_id = user.id
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
    const invoices = await executeQuery(paginatedQuery, params)

    return NextResponse.json({
      invoices,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching invoices:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch invoices" }, { status: 500 })
  }
}

// Create a new invoice
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(["carrier", "company", "admin"])(request)

    const { shipment_id, subtotal, tax_amount = 0, due_date, notes } = await request.json()

    if (!shipment_id || !subtotal) {
      return NextResponse.json({ error: "Shipment ID and subtotal are required" }, { status: 400 })
    }

    // Verify shipment exists and user has permission
    const shipments = await executeQuery("SELECT * FROM shipments WHERE id = $1", [shipment_id])
    if (shipments.length === 0) {
      return NextResponse.json({ error: "Shipment not found" }, { status: 404 })
    }

    const shipment = shipments[0]
    if (user.role !== "admin" && user.id !== shipment.carrier_id) {
      return NextResponse.json({ error: "Unauthorized to create invoice for this shipment" }, { status: 403 })
    }

    // Check if invoice already exists for this shipment
    const existingInvoice = await executeQuery("SELECT * FROM invoices WHERE shipment_id = $1", [shipment_id])
    if (existingInvoice.length > 0) {
      return NextResponse.json({ error: "Invoice already exists for this shipment" }, { status: 409 })
    }

    // Generate invoice number
    const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    const totalAmount = subtotal + tax_amount

    const result = await executeQuery(
      `INSERT INTO invoices 
       (invoice_number, shipment_id, customer_id, carrier_id, subtotal, tax_amount, total_amount, due_date, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [invoiceNumber, shipment_id, shipment.customer_id, user.id, subtotal, tax_amount, totalAmount, due_date, notes],
    )

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating invoice:", error)
    return NextResponse.json({ error: error.message || "Failed to create invoice" }, { status: 500 })
  }
}
