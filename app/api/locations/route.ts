import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

// Get all locations
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const city = searchParams.get("city")
    const query = searchParams.get("query")

    let sqlQuery = "SELECT * FROM locations"
    const params: (string | number)[] = []
    const conditions: string[] = []

    if (city) {
      conditions.push("city = $" + (params.length + 1))
      params.push(city)
    }

    if (query) {
      conditions.push("(name ILIKE $" + (params.length + 1) + " OR address ILIKE $" + (params.length + 1) + ")")
      params.push(`%${query}%`)
    }

    if (conditions.length > 0) {
      sqlQuery += " WHERE " + conditions.join(" AND ")
    }

    sqlQuery += " ORDER BY name"

    const locations = await executeQuery(sqlQuery, params)

    return NextResponse.json(locations)
  } catch (error) {
    console.error("Error fetching locations:", error)
    return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 })
  }
}

// Create a new location
export async function POST(request: NextRequest) {
  try {
    const { name, address, city, state, country, postal_code, latitude, longitude } = await request.json()

    // Validate input
    if (!name || !address || !city || !country) {
      return NextResponse.json({ error: "Name, address, city, and country are required" }, { status: 400 })
    }

    // Create location
    const result = await executeQuery(
      `INSERT INTO locations 
       (name, address, city, state, country, postal_code, latitude, longitude) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [name, address, city, state, country, postal_code, latitude, longitude],
    )

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating location:", error)
    return NextResponse.json({ error: "Failed to create location" }, { status: 500 })
  }
}
