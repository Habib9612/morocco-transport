import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import type { RouteData, RouteWithDetails } from "@/types"

// Get all routes
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const isActive = searchParams.get("active")
    const origin = searchParams.get("origin")
    const destination = searchParams.get("destination")

    const where: any = {}
    
    if (isActive !== null) {
      where.isActive = isActive === 'true'
    }
    
    if (origin) {
      where.origin = {
        contains: origin,
        mode: 'insensitive'
      }
    }
    
    if (destination) {
      where.destination = {
        contains: destination,
        mode: 'insensitive'
      }
    }

    const routes = await db.route.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(routes)
  } catch (error) {
    console.error("Error fetching routes:", error)
    return NextResponse.json({ error: "Failed to fetch routes" }, { status: 500 })
  }
}

// Create a new route
export async function POST(request: NextRequest) {
  try {
    const { name, origin, destination, distance, estimatedTime, tollCost, fuelCost } = await request.json()

    // Validate input
    if (!name || !origin || !destination) {
      return NextResponse.json({ error: "Name, origin, and destination are required" }, { status: 400 })
    }

    // Create route
    const route = await db.route.create({
      data: {
        name,
        origin,
        destination,
        distance: distance ? parseFloat(distance) : undefined,
        estimatedTime: estimatedTime ? parseInt(estimatedTime) : undefined,
        tollCost: tollCost ? parseFloat(tollCost) : undefined,
        fuelCost: fuelCost ? parseFloat(fuelCost) : undefined,
        isActive: true
      }
    })

    return NextResponse.json(route, { status: 201 })
  } catch (error) {
    console.error("Error creating route:", error)
    return NextResponse.json({ error: "Failed to create route" }, { status: 500 })
  }
}
