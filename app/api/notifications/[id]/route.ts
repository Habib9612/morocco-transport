import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

// Mark notification as read/unread
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth()(request)
    const id = params.id
    const { is_read } = await request.json()

    // Verify notification belongs to user
    const notification = await executeQuery("SELECT * FROM notifications WHERE id = $1 AND user_id = $2", [id, user.id])

    if (notification.length === 0) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 })
    }

    const result = await executeQuery("UPDATE notifications SET is_read = $1 WHERE id = $2 RETURNING *", [is_read, id])

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating notification:", error)
    return NextResponse.json({ error: error.message || "Failed to update notification" }, { status: 500 })
  }
}

// Delete notification
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth()(request)
    const id = params.id

    // Verify notification belongs to user
    const notification = await executeQuery("SELECT * FROM notifications WHERE id = $1 AND user_id = $2", [id, user.id])

    if (notification.length === 0) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 })
    }

    await executeQuery("DELETE FROM notifications WHERE id = $1", [id])

    return NextResponse.json({ success: true, message: "Notification deleted successfully" })
  } catch (error) {
    console.error("Error deleting notification:", error)
    return NextResponse.json({ error: error.message || "Failed to delete notification" }, { status: 500 })
  }
}
