import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

// Get a specific route
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const routes = await executeQuery(
      `SELECT r.*, 
              s.tracking_number, s.status as shipment_status,
              t.license_plate, t.model as truck_model,
              d.id as driver_id, u.name as driver_name
       FROM routes r
       JOIN shipments s ON r.shipment_id = s.id
       LEFT JOIN trucks t ON r.truck_id = t.id
       LEFT JOIN drivers d ON r.driver_id = d.id
       LEFT JOIN users u ON d.user_id = u.id
       WHERE r.id = $1`,
      [id],
    )

    if (routes.length === 0) {
      return NextResponse.json({ error: "Route not found" }, { status: 404 })
    }

    // Get waypoints
    const waypoints = await executeQuery(
      `SELECT rw.*, l.name, l.address, l.city, l.latitude, l.longitude
       FROM route_waypoints rw
       JOIN locations l ON rw.location_id = l.id
       WHERE rw.route_id = $1
       ORDER BY rw.sequence_number`,
      [id],
    )

    const routeData = {
      ...routes[0],
      waypoints,
    }

    return NextResponse.json(routeData)
  } catch (error) {
    console.error("Error fetching route:", error)
    return NextResponse.json({ error: "Failed to fetch route" }, { status: 500 })
  }
}

// Update a route
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const { truck_id, driver_id, start_time, end_time, distance, status, fuel_consumption } = await request.json()

    // Check if route exists
    const existingRoutes = await executeQuery("SELECT * FROM routes WHERE id = $1", [id])

    if (existingRoutes.length === 0) {
      return NextResponse.json({ error: "Route not found" }, { status: 404 })
    }

    const existingRoute = existingRoutes[0]

    // Check if truck exists and is available (if changing truck)
    if (truck_id && truck_id !== existingRoute.truck_id) {
      const trucks = await executeQuery("SELECT * FROM trucks WHERE id = $1", [truck_id])

      if (trucks.length === 0) {
        return NextResponse.json({ error: "Truck not found" }, { status: 404 })
      }

      if (trucks[0].status !== "available" && trucks[0].status !== "assigned") {
        return NextResponse.json({ error: "Truck is not available" }, { status: 400 })
      }
    }

    // Check if driver exists and is available (if changing driver)
    if (driver_id && driver_id !== existingRoute.driver_id) {
      const drivers = await executeQuery("SELECT * FROM drivers WHERE id = $1", [driver_id])

      if (drivers.length === 0) {
        return NextResponse.json({ error: "Driver not found" }, { status: 404 })
      }

      if (drivers[0].status !== "available" && drivers[0].status !== "assigned") {
        return NextResponse.json({ error: "Driver is not available" }, { status: 400 })
      }
    }

    // Update route
    const result = await executeQuery(
      `UPDATE routes 
       SET truck_id = $1, driver_id = $2, start_time = $3, end_time = $4,
           distance = $5, status = $6, fuel_consumption = $7,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [truck_id, driver_id, start_time, end_time, distance, status, fuel_consumption, id],
    )

    // Handle truck reassignment
    if (truck_id !== existingRoute.truck_id) {
      // Free up old truck if there was one
      if (existingRoute.truck_id) {
        await executeQuery("UPDATE trucks SET status = $1 WHERE id = $2", ["available", existingRoute.truck_id])
      }

      // Assign new truck if there is one
      if (truck_id) {
        await executeQuery("UPDATE trucks SET status = $1 WHERE id = $2", ["assigned", truck_id])
      }
    }

    // Handle driver reassignment
    if (driver_id !== existingRoute.driver_id) {
      // Free up old driver if there was one
      if (existingRoute.driver_id) {
        await executeQuery("UPDATE drivers SET status = $1 WHERE id = $2", ["available", existingRoute.driver_id])
      }

      // Assign new driver if there is one
      if (driver_id) {
        await executeQuery("UPDATE drivers SET status = $1 WHERE id = $2", ["assigned", driver_id])
      }
    }

    // If route is completed, update truck and driver status
    if (status === "completed" && existingRoute.status !== "completed") {
      if (result[0].truck_id) {
        await executeQuery("UPDATE trucks SET status = $1 WHERE id = $2", ["available", result[0].truck_id])
      }

      if (result[0].driver_id) {
        await executeQuery("UPDATE drivers SET status = $1 WHERE id = $2", ["available", result[0].driver_id])
      }
    }

    // Get related data
    const route = result[0]

    const [shipment] = await executeQuery("SELECT tracking_number, status FROM shipments WHERE id = $1", [
      route.shipment_id,
    ])

    let truckData = null
    if (route.truck_id) {
      const [truck] = await executeQuery("SELECT license_plate, model FROM trucks WHERE id = $1", [route.truck_id])
      truckData = truck
    }

    let driverData = null
    if (route.driver_id) {
      const [driver] = await executeQuery(
        "SELECT d.id, u.name FROM drivers d JOIN users u ON d.user_id = u.id WHERE d.id = $1",
        [route.driver_id],
      )
      driverData = driver
    }

    const routeWithDetails = {
      ...route,
      tracking_number: shipment.tracking_number,
      shipment_status: shipment.status,
      license_plate: truckData?.license_plate,
      truck_model: truckData?.model,
      driver_id: driverData?.id,
      driver_name: driverData?.name,
    }

    return NextResponse.json(routeWithDetails)
  } catch (error) {
    console.error("Error updating route:", error)
    return NextResponse.json({ error: "Failed to update route" }, { status: 500 })
  }
}

// Delete a route
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Check if route exists
    const existingRoutes = await executeQuery("SELECT * FROM routes WHERE id = $1", [id])

    if (existingRoutes.length === 0) {
      return NextResponse.json({ error: "Route not found" }, { status: 404 })
    }

    const existingRoute = existingRoutes[0]

    // Delete waypoints first
    await executeQuery("DELETE FROM route_waypoints WHERE route_id = $1", [id])

    // Delete route
    await executeQuery("DELETE FROM routes WHERE id = $1", [id])

    // Free up truck if assigned
    if (existingRoute.truck_id) {
      await executeQuery("UPDATE trucks SET status = $1 WHERE id = $2", ["available", existingRoute.truck_id])
    }

    // Free up driver if assigned
    if (existingRoute.driver_id) {
      await executeQuery("UPDATE drivers SET status = $1 WHERE id = $2", ["available", existingRoute.driver_id])
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting route:", error)
    return NextResponse.json({ error: "Failed to delete route" }, { status: 500 })
  }
}
