import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

// Get dashboard analytics
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()(request)
    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get("period") || "30" // days

    let userFilter = ""
    const params = [period]

    // Apply user-specific filters
    if (user.user_type === "individual") {
      userFilter = "AND s.customer_id = $2"
      params.push(user.id)
    } else if (user.user_type === "carrier") {
      userFilter = "AND s.carrier_id = $2"
      params.push(user.id)
    }

    // Get shipment statistics
    const shipmentStats = await executeQuery(
      `SELECT 
         COUNT(*) as total_shipments,
         COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_shipments,
         COUNT(CASE WHEN status = 'in_transit' THEN 1 END) as in_transit_shipments,
         COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_shipments,
         AVG(CASE WHEN actual_delivery IS NOT NULL AND actual_pickup IS NOT NULL 
             THEN EXTRACT(EPOCH FROM (actual_delivery - actual_pickup))/3600 END) as avg_delivery_time_hours
       FROM shipments s
       WHERE s.created_at >= CURRENT_DATE - INTERVAL '${period} days' ${userFilter}`,
      params.slice(1),
    )

    // Get revenue statistics (for carriers and admin)
    let revenueStats = [{ total_revenue: 0, avg_shipment_value: 0 }]
    if (user.user_type === "carrier" || user.role === "admin") {
      revenueStats = await executeQuery(
        `SELECT 
           SUM(price) as total_revenue,
           AVG(price) as avg_shipment_value
         FROM shipments s
         WHERE s.created_at >= CURRENT_DATE - INTERVAL '${period} days' 
         AND s.status = 'delivered' ${userFilter}`,
        params.slice(1),
      )
    }

    // Get truck utilization (for carriers and admin)
    let truckStats = [{ total_trucks: 0, active_trucks: 0, utilization_rate: 0 }]
    if (user.user_type === "carrier" || user.user_type === "company" || user.role === "admin") {
      const truckFilter = user.role === "admin" ? "" : "WHERE owner_id = $1"
      const truckParams = user.role === "admin" ? [] : [user.id]

      truckStats = await executeQuery(
        `SELECT 
           COUNT(*) as total_trucks,
           COUNT(CASE WHEN status IN ('assigned', 'maintenance') THEN 1 END) as active_trucks,
           ROUND(COUNT(CASE WHEN status IN ('assigned', 'maintenance') THEN 1 END) * 100.0 / COUNT(*), 2) as utilization_rate
         FROM trucks ${truckFilter}`,
        truckParams,
      )
    }

    // Get recent activity
    const recentActivity = await executeQuery(
      `SELECT 
         'shipment' as type,
         s.id,
         s.tracking_number as reference,
         s.status,
         s.created_at as timestamp,
         u.name as customer_name
       FROM shipments s
       LEFT JOIN users u ON s.customer_id = u.id
       WHERE s.created_at >= CURRENT_DATE - INTERVAL '7 days' ${userFilter}
       ORDER BY s.created_at DESC
       LIMIT 10`,
      params.slice(1),
    )

    return NextResponse.json({
      period: `${period} days`,
      shipment_stats: shipmentStats[0],
      revenue_stats: revenueStats[0],
      truck_stats: truckStats[0],
      recent_activity: recentActivity,
    })
  } catch (error) {
    console.error("Error fetching dashboard analytics:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch dashboard analytics" }, { status: 500 })
  }
}
