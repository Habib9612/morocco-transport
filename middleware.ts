import { type NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  // Get path from the URL
  const { pathname } = request.nextUrl

  // Skip middleware for the root path and dashboard for testing
  if (pathname === "/" || pathname.startsWith("/dashboard")) {
    return NextResponse.next()
  }

  // For API routes, we'll use a simplified approach
  if (pathname.startsWith("/api") && !pathname.startsWith("/api/auth")) {
    // Check for a simple auth header instead of JWT
    const authHeader = request.headers.get("authorization")

    if (!authHeader) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
