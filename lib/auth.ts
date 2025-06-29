import bcrypt from "bcryptjs"
import { prisma } from "./db"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"
const JWT_EXPIRES_IN = "7d"

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  phone?: string | null
  isActive: boolean
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
    const user = await prisma.user.findUnique({
      where: { 
        email: email,
        isActive: true
      }
    })

    if (!user) {
      return { success: false, message: "Invalid credentials" }
    }

    const isValidPassword = await comparePassword(password, user.password)

    if (!isValidPassword) {
      return { success: false, message: "Invalid credentials" }
    }

    const userWithoutPassword: User = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      phone: user.phone,
      isActive: user.isActive,
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

    const user = await prisma.user.findUnique({
      where: { 
        id: decoded.id,
        isActive: true
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        phone: true,
        isActive: true,
      }
    })

    if (!user) return null

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      phone: user.phone,
      isActive: user.isActive,
    }
  } catch (error) {
    return null
  }
}

// Check user permissions
export function hasPermission(user: User, requiredRole: string[]): boolean {
  return requiredRole.includes(user.role)
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
