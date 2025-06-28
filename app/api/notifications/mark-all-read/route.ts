import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

// Mark all notifications as read for a user
export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth()(request)

    await executeQuery("UPDATE notifications SET is_read = TRUE WHERE user_id = $1 AND is_read = FALSE", [user.id])

    return NextResponse.json({ success: true, message: "All notifications marked as read" })
  } catch (error) {
    console.error("Error marking notifications as read:", error)
    return NextResponse.json({ error: error.message || "Failed to mark notifications as read" }, { status: 500 })
  }
}
