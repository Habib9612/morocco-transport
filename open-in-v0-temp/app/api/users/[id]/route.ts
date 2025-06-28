import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

// Get a specific user
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth()(request)
    const id = params.id

    // Users can only view their own profile unless they're admin
    if (user.role !== "admin" && user.id !== id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const users = await executeQuery(
      `SELECT id, name, email, role, user_type, phone_number, address, city, state, country, postal_code,
              is_verified, is_active, created_at, updated_at
       FROM users WHERE id = $1`,
      [id],
    )

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(users[0])
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch user" }, { status: 500 })
  }
}

// Update a user
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth()(request)
    const id = params.id

    // Users can only update their own profile unless they're admin
    if (user.role !== "admin" && user.id !== id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const {
      name,
      email,
      role,
      user_type,
      phone_number,
      address,
      city,
      state,
      country,
      postal_code,
      is_verified,
      is_active,
    } = await request.json()

    // Check if user exists
    const existingUser = await executeQuery("SELECT * FROM users WHERE id = $1", [id])

    if (existingUser.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if email is already taken by another user
    if (email && email !== existingUser[0].email) {
      const emailCheck = await executeQuery("SELECT * FROM users WHERE email = $1 AND id != $2", [email, id])
      if (emailCheck.length > 0) {
        return NextResponse.json({ error: "Email already taken" }, { status: 409 })
      }
    }

    // Non-admin users cannot change role, user_type, is_verified, or is_active
    const updateData =
      user.role === "admin"
        ? {
            name,
            email,
            role,
            user_type,
            phone_number,
            address,
            city,
            state,
            country,
            postal_code,
            is_verified,
            is_active,
          }
        : {
            name,
            email,
            phone_number,
            address,
            city,
            state,
            country,
            postal_code,
          }

    // Build update query dynamically
    const updateFields = Object.entries(updateData)
      .filter(([_, value]) => value !== undefined)
      .map(([key], index) => `${key} = $${index + 1}`)

    const updateValues = Object.values(updateData).filter((value) => value !== undefined)
    updateValues.push(id) // Add id for WHERE clause

    const updateQuery = `
      UPDATE users 
      SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${updateValues.length}
      RETURNING id, name, email, role, user_type, phone_number, address, city, state, country, postal_code, is_verified, is_active, updated_at
    `

    const result = await executeQuery(updateQuery, updateValues)

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: error.message || "Failed to update user" }, { status: 500 })
  }
}

// Delete a user (soft delete)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth(["admin"])(request)
    const id = params.id

    // Check if user exists
    const existingUser = await executeQuery("SELECT * FROM users WHERE id = $1", [id])

    if (existingUser.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if user has active shipments
    const activeShipments = await executeQuery(
      "SELECT * FROM shipments WHERE (customer_id = $1 OR carrier_id = $1) AND status NOT IN ('delivered', 'cancelled')",
      [id],
    )

    if (activeShipments.length > 0) {
      return NextResponse.json({ error: "Cannot delete user with active shipments" }, { status: 400 })
    }

    // Soft delete user
    await executeQuery("UPDATE users SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = $1", [id])

    return NextResponse.json({ success: true, message: "User deactivated successfully" })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: error.message || "Failed to delete user" }, { status: 500 })
  }
}
