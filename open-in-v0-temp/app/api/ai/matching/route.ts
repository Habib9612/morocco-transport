import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

// AI-powered carrier matching
export async function POST(request: NextRequest) {
  try {
    const {
      origin_id,
      destination_id,
      weight,
      volume,
      cargo_type,
      scheduled_pickup,
      priority = "medium",
    } = await request.json()

    if (!origin_id || !destination_id || !weight) {
      return NextResponse.json(
        {
          error: "Origin, destination, and weight are required",
        },
        { status: 400 },
      )
    }

    // Get available carriers with their trucks and drivers
    const carriers = await executeQuery(
      `
      SELECT DISTINCT
        u.id as carrier_id,
        u.name as carrier_name,
        u.email as carrier_email,
        u.phone_number,
        t.id as truck_id,
        t.license_plate,
        t.model,
        t.capacity,
        t.truck_type,
        d.id as driver_id,
        d.rating as driver_rating,
        d.total_trips,
        ST_Distance(
          ST_Point(ol.longitude, ol.latitude),
          ST_Point(tl.longitude, tl.latitude)
        ) as distance_from_origin
      FROM users u
      JOIN trucks t ON u.id = t.owner_id
      JOIN drivers d ON u.id = d.user_id
      JOIN locations ol ON ol.id = $1
      LEFT JOIN locations tl ON t.current_location_id = tl.id
      WHERE u.user_type IN ('carrier', 'company')
        AND t.status = 'available'
        AND d.status = 'available'
        AND t.capacity >= $2
        AND u.is_active = TRUE
      ORDER BY distance_from_origin ASC, d.rating DESC
      LIMIT 10
    `,
      [origin_id, weight],
    )

    // Calculate matching scores using AI algorithm
    const scoredCarriers = carriers.map((carrier) => {
      let score = 0

      // Distance factor (closer is better)
      const maxDistance = 1000 // km
      const distanceScore = Math.max(0, (maxDistance - (carrier.distance_from_origin || 0)) / maxDistance) * 30
      score += distanceScore

      // Capacity factor (optimal capacity utilization)
      const capacityUtilization = weight / carrier.capacity
      const capacityScore =
        capacityUtilization > 0.7 && capacityUtilization <= 1.0 ? 25 : capacityUtilization > 0.5 ? 20 : 15
      score += capacityScore

      // Driver rating factor
      const ratingScore = (carrier.driver_rating || 0) * 5 // Max 25 points
      score += ratingScore

      // Experience factor (based on total trips)
      const experienceScore = Math.min((carrier.total_trips || 0) / 100, 1) * 20
      score += experienceScore

      // Truck type compatibility
      const truckTypeScore = getTruckTypeScore(cargo_type, carrier.truck_type)
      score += truckTypeScore

      return {
        ...carrier,
        matching_score: Math.round(score),
        estimated_price: calculateEstimatedPrice(weight, carrier.distance_from_origin || 0, priority),
        estimated_duration: calculateEstimatedDuration(carrier.distance_from_origin || 0),
      }
    })

    // Sort by matching score
    scoredCarriers.sort((a, b) => b.matching_score - a.matching_score)

    return NextResponse.json({
      matches: scoredCarriers,
      total_matches: scoredCarriers.length,
      algorithm_version: "1.0",
    })
  } catch (error) {
    console.error("Error in AI matching:", error)
    return NextResponse.json({ error: "Failed to find matches" }, { status: 500 })
  }
}

function getTruckTypeScore(cargoType: string, truckType: string): number {
  const compatibility = {
    general: { box: 20, flatbed: 15, refrigerated: 10, tanker: 5 },
    perishable: { refrigerated: 20, box: 10, flatbed: 5, tanker: 0 },
    liquid: { tanker: 20, box: 5, flatbed: 0, refrigerated: 0 },
    construction: { flatbed: 20, box: 15, refrigerated: 5, tanker: 0 },
  }

  return compatibility[cargoType]?.[truckType] || 10
}

function calculateEstimatedPrice(weight: number, distance: number, priority: string): number {
  const baseRate = 2.5 // MAD per km per ton
  const priorityMultiplier = priority === "urgent" ? 1.5 : priority === "high" ? 1.2 : 1.0

  return Math.round(weight * distance * baseRate * priorityMultiplier)
}

function calculateEstimatedDuration(distance: number): number {
  const averageSpeed = 60 // km/h
  return Math.round((distance / averageSpeed) * 60) // minutes
}
