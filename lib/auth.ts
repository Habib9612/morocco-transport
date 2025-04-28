import { cookies } from "next/headers"
import type { NextRequest } from "next/server"

export interface AuthUser {
  id: string
  email: string
  role: string
}

export function getAuthUser(request?: NextRequest): AuthUser | null {
  try {
    // Get user from cookies
    const userCookie = request ? request.cookies.get("user")?.value : cookies().get("user")?.value

    if (!userCookie) {
      return null
    }

    const userData = JSON.parse(userCookie)
    return {
      id: userData.id || "",
      email: userData.email || "",
      role: userData.role || "user",
    }
  } catch (error) {
    console.error("Auth error:", error)
    return null
  }
}

export function isAuthenticated(request?: NextRequest): boolean {
  return getAuthUser(request) !== null
}

export function hasRole(role: string | string[], request?: NextRequest): boolean {
  const user = getAuthUser(request)

  if (!user) {
    return false
  }

  if (Array.isArray(role)) {
    return role.includes(user.role)
  }

  return user.role === role
}
