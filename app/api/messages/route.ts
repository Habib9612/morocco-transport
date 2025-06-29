import { type NextRequest, NextResponse } from "next/server"
import { executeQuery, buildPaginationQuery } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

// Get messages for a user
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()(request)
    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const conversationWith = searchParams.get("conversation_with")
    const shipmentId = searchParams.get("shipment_id")

    let query = `
      SELECT m.*, 
             s.name as sender_name, s.email as sender_email,
             r.name as receiver_name, r.email as receiver_email,
             sh.tracking_number
      FROM messages m
      LEFT JOIN users s ON m.sender_id = s.id
      LEFT JOIN users r ON m.receiver_id = r.id
      LEFT JOIN shipments sh ON m.shipment_id = sh.id
      WHERE (m.sender_id = $1 OR m.receiver_id = $1)
    `
    const params = [user.id]

    if (conversationWith) {
      query += ` AND (m.sender_id = $${params.length + 1} OR m.receiver_id = $${params.length + 1})`
      params.push(conversationWith)
    }

    if (shipmentId) {
      query += ` AND m.shipment_id = $${params.length + 1}`
      params.push(shipmentId)
    }

    query += " ORDER BY m.created_at DESC"

    // Get total count
    const countQuery = query.replace(/SELECT.*FROM/, "SELECT COUNT(*) as total FROM")
    const countResult = await executeQuery(countQuery, params)
    const total = Number.parseInt(countResult[0].total)

    // Apply pagination
    const paginatedQuery = buildPaginationQuery(query, page, limit)
    const messages = await executeQuery(paginatedQuery, params)

    return NextResponse.json({
      messages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch messages" }, { status: 500 })
  }
}

// Send a new message
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()(request)

    const { receiver_id, shipment_id, subject, message, message_type = "text" } = await request.json()

    if (!receiver_id || !message) {
      return NextResponse.json({ error: "Receiver ID and message are required" }, { status: 400 })
    }

    // Verify receiver exists
    const receiver = await executeQuery("SELECT * FROM users WHERE id = $1", [receiver_id])
    if (receiver.length === 0) {
      return NextResponse.json({ error: "Receiver not found" }, { status: 404 })
    }

    // If shipment_id is provided, verify user has access to it
    if (shipment_id) {
      const shipment = await executeQuery("SELECT * FROM shipments WHERE id = $1", [shipment_id])
      if (shipment.length === 0) {
        return NextResponse.json({ error: "Shipment not found" }, { status: 404 })
      }

      const ship = shipment[0]
      if (user.role !== "admin" && user.id !== ship.customer_id && user.id !== ship.carrier_id) {
        return NextResponse.json({ error: "Unauthorized to send message for this shipment" }, { status: 403 })
      }
    }

    const result = await executeQuery(
      `INSERT INTO messages 
       (sender_id, receiver_id, shipment_id, subject, message, message_type)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [user.id, receiver_id, shipment_id, subject, message, message_type],
    )

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json({ error: error.message || "Failed to send message" }, { status: 500 })
  }
}
