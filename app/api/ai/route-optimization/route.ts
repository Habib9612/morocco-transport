import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

// Route optimization using AI
export async function POST(request: NextRequest) {
  try {
    const { waypoints, truck_id, driver_id, optimization_type = "time" } = await request.json()

    if (!waypoints || waypoints.length < 2) {
      return NextResponse.json(
        {
          error: "At least 2 waypoints are required",
        },
        { status: 400 },
      )
    }

    // Get truck and driver information
    const [truck] = await executeQuery("SELECT * FROM trucks WHERE id = $1", [truck_id])
    const [driver] = await executeQuery("SELECT * FROM drivers WHERE id = $1", [driver_id])

    if (!truck || !driver) {
      return NextResponse.json({ error: "Invalid truck or driver" }, { status: 400 })
    }

    // Get waypoint details
    const waypointIds = waypoints.map((w) => w.location_id)
    const locations = await executeQuery(`SELECT * FROM locations WHERE id = ANY($1)`, [waypointIds])

    // Create distance matrix
    const distanceMatrix = await calculateDistanceMatrix(locations)

    // Apply optimization algorithm
    const optimizedRoute = optimizeRoute(waypoints, distanceMatrix, optimization_type, truck)

    // Calculate route metrics
    const routeMetrics = calculateRouteMetrics(optimizedRoute, truck)

    return NextResponse.json({
      optimized_waypoints: optimizedRoute,
      metrics: routeMetrics,
      optimization_type,
      algorithm_version: "1.0",
    })
  } catch (error) {
    console.error("Error in route optimization:", error)
    return NextResponse.json({ error: "Failed to optimize route" }, { status: 500 })
  }
}

async function calculateDistanceMatrix(locations: any[]) {
  // Simplified distance calculation using Haversine formula
  const matrix = []

  for (let i = 0; i < locations.length; i++) {
    matrix[i] = []
    for (let j = 0; j < locations.length; j++) {
      if (i === j) {
        matrix[i][j] = 0
      } else {
        const distance = haversineDistance(
          locations[i].latitude,
          locations[i].longitude,
          locations[j].latitude,
          locations[j].longitude,
        )
        matrix[i][j] = distance
      }
    }
  }

  return matrix
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function optimizeRoute(waypoints: any[], distanceMatrix: number[][], optimizationType: string, truck: any) {
  // Simplified nearest neighbor algorithm for demonstration
  // In production, use more sophisticated algorithms like Genetic Algorithm or Simulated Annealing

  const unvisited = [...waypoints.slice(1)] // Exclude starting point
  const optimized = [waypoints[0]] // Start with first waypoint
  let currentIndex = 0

  while (unvisited.length > 0) {
    let nearestIndex = 0
    let nearestDistance = Number.POSITIVE_INFINITY

    unvisited.forEach((waypoint, index) => {
      const waypointIndex = waypoints.findIndex((w) => w.location_id === waypoint.location_id)
      const distance = distanceMatrix[currentIndex][waypointIndex]

      if (distance < nearestDistance) {
        nearestDistance = distance
        nearestIndex = index
      }
    })

    const nearest = unvisited.splice(nearestIndex, 1)[0]
    optimized.push(nearest)
    currentIndex = waypoints.findIndex((w) => w.location_id === nearest.location_id)
  }

  return optimized.map((waypoint, index) => ({
    ...waypoint,
    sequence_number: index + 1,
    estimated_arrival: calculateEstimatedArrival(index, optimized, distanceMatrix, truck),
  }))
}

function calculateEstimatedArrival(index: number, route: any[], distanceMatrix: number[][], truck: any) {
  if (index === 0) {
    return new Date().toISOString() // Start immediately
  }

  const averageSpeed = 50 // km/h
  const serviceTime = 30 // minutes per stop

  let totalTime = 0
  for (let i = 0; i < index; i++) {
    const distance = distanceMatrix[i][i + 1] || 0
    totalTime += (distance / averageSpeed) * 60 + serviceTime // Convert to minutes
  }

  const arrivalTime = new Date(Date.now() + totalTime * 60 * 1000)
  return arrivalTime.toISOString()
}

function calculateRouteMetrics(route: any[], truck: any) {
  // Calculate total distance, estimated time, fuel consumption, etc.
  return {
    total_distance: 0, // Calculate based on route
    estimated_duration: 0, // Calculate based on route
    estimated_fuel_consumption: 0, // Calculate based on truck efficiency
    estimated_cost: 0, // Calculate based on distance and fuel
    number_of_stops: route.length,
    optimization_savings: "15%", // Placeholder
  }
}
