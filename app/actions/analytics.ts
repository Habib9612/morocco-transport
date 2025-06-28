"use server"

import { executeQuery } from "@/lib/db"

// Get shipment volume by time period
export async function getShipmentVolume(period = "month", limit = 12) {
  try {
    let timeFormat
    let groupBy

    switch (period) {
      case "day":
        timeFormat = "YYYY-MM-DD"
        groupBy = "DATE(created_at)"
        break
      case "week":
        timeFormat = "IYYY-IW" // ISO year and week
        groupBy = "TO_CHAR(created_at, 'IYYY-IW')"
        break
      case "month":
      default:
        timeFormat = "YYYY-MM"
        groupBy = "TO_CHAR(created_at, 'YYYY-MM')"
        break
    }

    const query = `
      SELECT 
        ${groupBy} AS time_period,
        COUNT(*) AS count
      FROM 
        shipments
      GROUP BY 
        time_period
      ORDER BY 
        time_period DESC
      LIMIT $1
    `

    const result = await executeQuery(query, [limit])
    return result.reverse() // Return in chronological order
  } catch (error) {
    console.error("Failed to fetch shipment volume:", error)
    return []
  }
}

// Get delivery performance metrics
export async function getDeliveryPerformance(period = "month", limit = 12) {
  try {
    let timeFormat
    let groupBy

    switch (period) {
      case "day":
        timeFormat = "YYYY-MM-DD"
        groupBy = "DATE(delivery_date)"
        break
      case "week":
        timeFormat = "IYYY-IW"
        groupBy = "TO_CHAR(delivery_date, 'IYYY-IW')"
        break
      case "month":
      default:
        timeFormat = "YYYY-MM"
        groupBy = "TO_CHAR(delivery_date, 'YYYY-MM')"
        break
    }

    const query = `
      SELECT 
        ${groupBy} AS time_period,
        COUNT(*) AS total_deliveries,
        SUM(CASE WHEN status = 'delivered' AND actual_delivery_date <= delivery_date THEN 1 ELSE 0 END) AS on_time,
        SUM(CASE WHEN status = 'delivered' AND actual_delivery_date > delivery_date THEN 1 ELSE 0 END) AS delayed,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled
      FROM 
        shipments
      WHERE 
        delivery_date IS NOT NULL
      GROUP BY 
        time_period
      ORDER BY 
        time_period DESC
      LIMIT $1
    `

    const result = await executeQuery(query, [limit])
    return result.reverse() // Return in chronological order
  } catch (error) {
    console.error("Failed to fetch delivery performance:", error)
    return []
  }
}

// Get revenue metrics
export async function getRevenueMetrics(period = "month", limit = 12) {
  try {
    let timeFormat
    let groupBy

    switch (period) {
      case "day":
        timeFormat = "YYYY-MM-DD"
        groupBy = "DATE(created_at)"
        break
      case "week":
        timeFormat = "IYYY-IW"
        groupBy = "TO_CHAR(created_at, 'IYYY-IW')"
        break
      case "month":
      default:
        timeFormat = "YYYY-MM"
        groupBy = "TO_CHAR(created_at, 'YYYY-MM')"
        break
    }

    const query = `
      SELECT 
        ${groupBy} AS time_period,
        SUM(price) AS revenue,
        AVG(price) AS average_price,
        COUNT(*) AS shipment_count
      FROM 
        shipments
      WHERE 
        status != 'cancelled'
      GROUP BY 
        time_period
      ORDER BY 
        time_period DESC
      LIMIT $1
    `

    const result = await executeQuery(query, [limit])
    return result.reverse() // Return in chronological order
  } catch (error) {
    console.error("Failed to fetch revenue metrics:", error)
    return []
  }
}

// Get fleet utilization
export async function getFleetUtilization(period = "month", limit = 12) {
  try {
    let timeFormat
    let groupBy

    switch (period) {
      case "day":
        timeFormat = "YYYY-MM-DD"
        groupBy = "DATE(s.pickup_date)"
        break
      case "week":
        timeFormat = "IYYY-IW"
        groupBy = "TO_CHAR(s.pickup_date, 'IYYY-IW')"
        break
      case "month":
      default:
        timeFormat = "YYYY-MM"
        groupBy = "TO_CHAR(s.pickup_date, 'YYYY-MM')"
        break
    }

    const query = `
      SELECT 
        ${groupBy} AS time_period,
        COUNT(DISTINCT t.id) AS total_trucks,
        COUNT(DISTINCT s.truck_id) AS active_trucks,
        CASE 
          WHEN COUNT(DISTINCT t.id) > 0 
          THEN ROUND((COUNT(DISTINCT s.truck_id)::numeric / COUNT(DISTINCT t.id)::numeric) * 100, 2)
          ELSE 0
        END AS utilization_rate
      FROM 
        trucks t
      LEFT JOIN 
        shipments s ON t.id = s.truck_id AND s.status IN ('in_transit', 'delivered')
      GROUP BY 
        time_period
      ORDER BY 
        time_period DESC
      LIMIT $1
    `

    const result = await executeQuery(query, [limit])
    return result.reverse() // Return in chronological order
  } catch (error) {
    console.error("Failed to fetch fleet utilization:", error)
    return []
  }
}

// Get top performing drivers
export async function getTopDrivers(limit = 5) {
  try {
    const query = `
      SELECT 
        d.id,
        u.name,
        COUNT(s.id) AS shipment_count,
        SUM(CASE WHEN s.status = 'delivered' AND s.actual_delivery_date <= s.delivery_date THEN 1 ELSE 0 END) AS on_time_deliveries,
        CASE 
          WHEN COUNT(s.id) > 0 
          THEN ROUND((SUM(CASE WHEN s.status = 'delivered' AND s.actual_delivery_date <= s.delivery_date THEN 1 ELSE 0 END)::numeric / COUNT(s.id)::numeric) * 100, 2)
          ELSE 0
        END AS on_time_percentage,
        AVG(EXTRACT(EPOCH FROM (s.actual_delivery_date - s.pickup_date))/3600)::integer AS avg_delivery_hours
      FROM 
        drivers d
      JOIN 
        users u ON d.user_id = u.id
      LEFT JOIN 
        shipments s ON d.id = s.driver_id AND s.status = 'delivered'
      GROUP BY 
        d.id, u.name
      HAVING 
        COUNT(s.id) > 0
      ORDER BY 
        on_time_percentage DESC, shipment_count DESC
      LIMIT $1
    `

    return await executeQuery(query, [limit])
  } catch (error) {
    console.error("Failed to fetch top drivers:", error)
    return []
  }
}

// Get shipment status distribution
export async function getShipmentStatusDistribution() {
  try {
    const query = `
      SELECT 
        status,
        COUNT(*) AS count
      FROM 
        shipments
      GROUP BY 
        status
      ORDER BY 
        count DESC
    `

    return await executeQuery(query, [])
  } catch (error) {
    console.error("Failed to fetch shipment status distribution:", error)
    return []
  }
}

// Get route performance
export async function getRoutePerformance(limit = 5) {
  try {
    const query = `
      SELECT 
        CONCAT(l1.name, ' to ', l2.name) AS route,
        COUNT(*) AS shipment_count,
        AVG(price) AS average_price,
        AVG(EXTRACT(EPOCH FROM (actual_delivery_date - pickup_date))/3600)::integer AS avg_delivery_hours,
        SUM(CASE WHEN status = 'delivered' AND actual_delivery_date <= delivery_date THEN 1 ELSE 0 END) AS on_time,
        CASE 
          WHEN COUNT(*) > 0 
          THEN ROUND((SUM(CASE WHEN status = 'delivered' AND actual_delivery_date <= delivery_date THEN 1 ELSE 0 END)::numeric / COUNT(*)::numeric) * 100, 2)
          ELSE 0
        END AS on_time_percentage
      FROM 
        shipments s
      JOIN 
        locations l1 ON s.origin_id = l1.id
      JOIN 
        locations l2 ON s.destination_id = l2.id
      WHERE 
        status = 'delivered'
      GROUP BY 
        route
      HAVING 
        COUNT(*) > 2
      ORDER BY 
        shipment_count DESC
      LIMIT $1
    `

    return await executeQuery(query, [limit])
  } catch (error) {
    console.error("Failed to fetch route performance:", error)
    return []
  }
}
