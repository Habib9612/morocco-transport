import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { auth } from "@/lib/auth"

// Get a specific location
export const GET = auth(async (req) => {
  if (!req.auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = req.url.split('/').pop();

  try {
    const locations = await executeQuery("SELECT * FROM locations WHERE id = $1", [id])

    if (locations.length === 0) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 })
    }

    return NextResponse.json(locations[0])
  } catch (error) {
    console.error("Error fetching location:", error)
    return NextResponse.json({ error: "Failed to fetch location" }, { status: 500 })
  }
});

// Update a location
export const PUT = auth(async (req) => {
  if (!req.auth || req.auth.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const id = req.url.split('/').pop();
  const { name, address, city, state, country, postal_code, latitude, longitude } = await req.json();

  try {
    const existingLocation = await executeQuery("SELECT * FROM locations WHERE id = $1", [id])

    if (existingLocation.length === 0) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 })
    }

    const result = await executeQuery(
      `UPDATE locations 
       SET name = $1, address = $2, city = $3, state = $4,
           country = $5, postal_code = $6, latitude = $7, longitude = $8,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [name, address, city, state, country, postal_code, latitude, longitude, id],
    )

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating location:", error)
    return NextResponse.json({ error: "Failed to update location" }, { status: 500 })
  }
});

// Delete a location
export const DELETE = auth(async (req) => {
  if (!req.auth || req.auth.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const id = req.url.split('/').pop();

  try {
    const existingLocation = await executeQuery("SELECT * FROM locations WHERE id = $1", [id])

    if (existingLocation.length === 0) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 })
    }

    const shipments = await executeQuery("SELECT * FROM shipments WHERE origin_id = $1 OR destination_id = $1", [id])

    if (shipments.length > 0) {
      return NextResponse.json({ error: "Cannot delete location that is used in shipments" }, { status: 400 })
    }

    const waypoints = await executeQuery("SELECT * FROM route_waypoints WHERE location_id = $1", [id])

    if (waypoints.length > 0) {
      return NextResponse.json({ error: "Cannot delete location that is used in route waypoints" }, { status: 400 })
    }

    await executeQuery("DELETE FROM locations WHERE id = $1", [id])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting location:", error)
    return NextResponse.json({ error: "Failed to delete location" }, { status: 500 })
  }
});
