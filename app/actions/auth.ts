"use server"

import { cookies } from "next/headers"
import { executeQuery } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function login(email: string, password: string) {
  try {
    // Find user
    const users = await executeQuery("SELECT * FROM users WHERE email = $1", [email])

    if (users.length === 0) {
      return { success: false, error: "Invalid credentials" }
    }

    const user = users[0]

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash)
    if (!isMatch) {
      return { success: false, error: "Invalid credentials" }
    }

    // Create user object for cookie
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }

    // Set cookie with user data
    cookies().set({
      name: "user",
      value: JSON.stringify(userData),
      httpOnly: false, // Allow JavaScript access
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    })

    return {
      success: true,
      user: userData,
    }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "Failed to authenticate" }
  }
}

export async function signup(name: string, email: string, password: string) {
  try {
    // Check if user already exists
    const existingUser = await executeQuery("SELECT * FROM users WHERE email = $1", [email])

    if (existingUser.length > 0) {
      return { success: false, error: "User with this email already exists" }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Determine role: First user is ADMIN
    // This raw query system doesn't easily give a count without another specific query.
    // For simplicity in this system, we'll check if any user exists.
    // A more robust way would be `SELECT COUNT(*) FROM users`.
    const allUsers = await executeQuery("SELECT id FROM users LIMIT 1", []);
    let roleToAssign;
    if (allUsers.length === 0) {
      roleToAssign = 'ADMIN'; // Use uppercase to match Prisma enum
    } else {
      roleToAssign = 'user'; // Existing behavior for subsequent users in this custom system
      // This 'user' role string is inconsistent with Prisma UserRole enum (INDIVIDUAL, CARRIER, COMPANY)
      // and should be addressed if this auth system is to be aligned or properly deprecated.
    }

    // Create user
    const result = await executeQuery(
      "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
      [name, email, hashedPassword, roleToAssign],
    )

    const newUser = result[0]

    // Create user object for cookie
    const userData = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    }

    // Set cookie with user data
    cookies().set({
      name: "user",
      value: JSON.stringify(userData),
      httpOnly: false, // Allow JavaScript access
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    })

    return {
      success: true,
      user: userData,
    }
  } catch (error) {
    console.error("Signup error:", error)
    return { success: false, error: "Failed to create user" }
  }
}

export async function logout() {
  cookies().delete("user")
  return { success: true }
}

export async function getCurrentUser() {
  try {
    const userCookie = cookies().get("user")?.value

    if (!userCookie) {
      return { success: false, error: "Not authenticated" }
    }

    const userData = JSON.parse(userCookie)

    const users = await executeQuery("SELECT id, name, email, role FROM users WHERE id = $1", [userData.id])

    if (users.length === 0) {
      return { success: false, error: "User not found" }
    }

    return {
      success: true,
      user: users[0],
    }
  } catch (error) {
    console.error("Get current user error:", error)
    return { success: false, error: "Failed to get current user" }
  }
}
