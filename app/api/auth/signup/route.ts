import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { hashPassword, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      email,
      password,
      user_type = "individual",
      phone_number,
      city,
      country = "Morocco",
    } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUsers = await executeQuery("SELECT id FROM users WHERE email = $1", [email])

    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const result = await executeQuery(
      `INSERT INTO users (name, email, password_hash, user_type, phone_number, city, country)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, name, email, role, user_type, phone_number, city, country, is_verified, is_active`,
      [name, email, hashedPassword, user_type, phone_number, city, country],
    )

    const user = result[0]
    const token = generateToken(user)

    return NextResponse.json(
      {
        user,
        token,
        message: "User created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Signup failed" }, { status: 500 })
  }
}
