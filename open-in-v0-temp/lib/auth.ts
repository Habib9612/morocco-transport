import bcrypt from "bcryptjs"
import { executeQuery } from "./db"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"
const JWT_EXPIRES_IN = "7d"

export interface User {
  id: string
  name: string
  email: string
  role: string
  user_type: string
  phone_number?: string
  city?: string
  country?: string
  is_verified: boolean
  is_active: boolean
}

export interface AuthResult {
  success: boolean
  user?: User
  token?: string
  message?: string
}

// Simple JWT implementation without external dependencies
export function generateToken(user: User): string {
  const header = {
    alg: "HS256",
    typ: "JWT",
  }

  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    user_type: user.user_type,
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
  }

  const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, "")
  const encodedPayload = btoa(JSON.stringify(payload)).replace(/=/g, "")

  const signature = btoa(`${encodedHeader}.${encodedPayload}.${JWT_SECRET}`).replace(/=/g, "")

  return `${encodedHeader}.${encodedPayload}.${signature}`
}

// Simple JWT verification
export function verifyToken(token: string): any {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) {
      throw new Error("Invalid token format")
    }

    const payload = JSON.parse(atob(parts[1]))

    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      throw new Error("Token expired")
    }

    return payload
  } catch (error) {
    throw new Error("Invalid token")
  }
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12)
  return bcrypt.hash(password, salt)
}

// Compare password
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Authenticate user
export async function authenticateUser(email: string, password: string): Promise<AuthResult> {
  try {
    const users = await executeQuery("SELECT * FROM users WHERE email = $1 AND is_active = TRUE", [email])

    if (users.length === 0) {
      return { success: false, message: "Invalid credentials" }
    }

    const user = users[0]
    const isValidPassword = await comparePassword(password, user.password_hash)

    if (!isValidPassword) {
      return { success: false, message: "Invalid credentials" }
    }

    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      user_type: user.user_type,
      phone_number: user.phone_number,
      city: user.city,
      country: user.country,
      is_verified: user.is_verified,
      is_active: user.is_active,
    }

    const token = generateToken(userWithoutPassword)

    return {
      success: true,
      user: userWithoutPassword,
      token,
      message: "Authentication successful",
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return { success: false, message: "Authentication failed" }
  }
}

// Get user from token
export async function getUserFromToken(token: string): Promise<User | null> {
  try {
    const decoded = verifyToken(token)

    const users = await executeQuery(
      "SELECT id, name, email, role, user_type, phone_number, city, country, is_verified, is_active FROM users WHERE id = $1 AND is_active = TRUE",
      [decoded.id],
    )

    return users.length > 0 ? users[0] : null
  } catch (error) {
    return null
  }
}

// Check user permissions
export function hasPermission(user: User, requiredRole: string[]): boolean {
  return requiredRole.includes(user.role) || requiredRole.includes(user.user_type)
}

// Middleware for API routes
export function requireAuth(requiredRoles: string[] = []) {
  return async (request: Request) => {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("No token provided")
    }

    const token = authHeader.substring(7)
    const user = await getUserFromToken(token)

    if (!user) {
      throw new Error("Invalid token")
    }

    if (requiredRoles.length > 0 && !hasPermission(user, requiredRoles)) {
      throw new Error("Insufficient permissions")
    }

    return user
  }
}
