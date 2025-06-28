import { type NextRequest, NextResponse } from "next/server"
import { executeQuery, buildPaginationQuery } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

// Get notifications for a user
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()(request)
    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const isRead = searchParams.get("is_read")
    const notificationType = searchParams.get("type")

    let query = "SELECT * FROM notifications WHERE user_id = $1"
    const params = [user.id]

    if (isRead !== null) {
      query += ` AND is_read = $${params.length + 1}`
      params.push(isRead === "true")
    }

    if (notificationType) {
      query += ` AND notification_type = $${params.length + 1}`
      params.push(notificationType)
    }

    query += " ORDER BY created_at DESC"

    // Get total count
    const countQuery = query.replace("SELECT *", "SELECT COUNT(*) as total")
    const countResult = await executeQuery(countQuery, params)
    const total = Number.parseInt(countResult[0].total)

    // Apply pagination
    const paginatedQuery = buildPaginationQuery(query, page, limit)
    const notifications = await executeQuery(paginatedQuery, params)

    // Get unread count
    const unreadResult = await executeQuery(
      "SELECT COUNT(*) as unread_count FROM notifications WHERE user_id = $1 AND is_read = FALSE",
      [user.id],
    )

    return NextResponse.json({
      notifications,
      unread_count: Number.parseInt(unreadResult[0].unread_count),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch notifications" }, { status: 500 })
  }
}

// Create a new notification
export async function POST(request: NextRequest) {
  try {
    await requireAuth(["admin"])(request)

    const { user_id, title, message, notification_type, related_id, send_via = "app" } = await request.json()

    if (!user_id || !title || !message || !notification_type) {
      return NextResponse.json(
        {
          error: "User ID, title, message, and notification type are required",
        },
        { status: 400 },
      )
    }

    const result = await executeQuery(
      `INSERT INTO notifications 
       (user_id, title, message, notification_type, related_id, send_via)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [user_id, title, message, notification_type, related_id, send_via],
    )

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating notification:", error)
    return NextResponse.json({ error: error.message || "Failed to create notification" }, { status: 500 })
  }
}
