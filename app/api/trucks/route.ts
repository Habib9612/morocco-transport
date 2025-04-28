import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

// Get all trucks
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")

    let query = "SELECT * FROM trucks"
    const params: any[] = []

    if (status) {
      query += " WHERE status = $1"
      params.push(status)
    }

    query += " ORDER BY created_at DESC"

    const trucks = await executeQuery(query, params)

    return NextResponse.json(trucks)
  } catch (error) {
    console.error("Error fetching trucks:", error)
    return NextResponse.json({ error: "Failed to fetch trucks" }, { status: 500 })
  }
}

// Create a new truck
export async function POST(request: NextRequest) {
  try {
    const { license_plate, model, capacity, status, fuel_efficiency } = await request.json()

    // Validate input
    if (!license_plate || !model || !capacity) {
      return NextResponse.json({ error: "License plate, model, and capacity are required" }, { status: 400 })
    }

    // Check if truck with license plate already exists
    const existingTruck = await executeQuery("SELECT * FROM trucks WHERE license_plate = $1", [license_plate])

    if (existingTruck.length > 0) {
      return NextResponse.json({ error: "Truck with this license plate already exists" }, { status: 409 })
    }

    // Create truck
    const result = await executeQuery(
      `INSERT INTO trucks 
       (license_plate, model, capacity, status, fuel_efficiency) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [license_plate, model, capacity, status || "available", fuel_efficiency],
    )

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating truck:", error)
    return NextResponse.json({ error: "Failed to create truck" }, { status: 500 })
  }
}
