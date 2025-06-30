"use server"

import { executeQuery } from "@/lib/db"
import {
  Truck,
  Shipment,
  User,
  MaintenanceLog,
  Invoice,
  Review,
  Prisma,
} from '@prisma/client';

type Period = 'day' | 'week' | 'month' | 'year';

// Get shipment volume by time period
export async function getShipmentVolume(period: Period = "month", limit = 12): Promise<any> {
  try {
    let groupBy

    switch (period) {
      case "day":
        groupBy = "DATE(created_at)"
        break
      case "week":
        groupBy = "TO_CHAR(created_at, 'IYYY-IW')"
        break
      case "month":
      default:
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

    const result: any = await executeQuery(query, [limit])
    const labels = result.map((row: any) => row.time_period)
    const series = result.map((row: any) => Number(row.count))
    return { success: true, data: { labels, series } }
  } catch (error: any) {
    console.error("Failed to fetch shipment volume:", error)
    return { success: false, error: error.message }
  }
}

// Get delivery performance metrics
export async function getDeliveryPerformance(period: Period = "month", limit = 12): Promise<any> {
  try {
    let groupBy

    switch (period) {
      case "day":
        groupBy = "DATE(delivery_date)"
        break
      case "week":
        groupBy = "TO_CHAR(delivery_date, 'IYYY-IW')"
        break
      case "month":
      default:
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

    const result: any = await executeQuery(query, [limit])
    const labels = result.map((row: any) => row.time_period)
    const series = result.map((row: any) => Number(row.on_time_percentage))
    return { success: true, data: { labels, series } }
  } catch (error: any) {
    console.error("Failed to fetch delivery performance:", error)
    return { success: false, error: error.message }
  }
}

// Get revenue metrics
export async function getRevenueMetrics(period: Period = "month", limit = 12): Promise<any> {
  try {
    let groupBy

    switch (period) {
      case "day":
        groupBy = "DATE(created_at)"
        break
      case "week":
        groupBy = "TO_CHAR(created_at, 'IYYY-IW')"
        break
      case "month":
      default:
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

    const result: any = await executeQuery(query, [limit])
    const labels = result.map((row: any) => row.time_period)
    const series = result.map((row: any) => Number(row.total_revenue))
    return { success: true, data: { labels, series } }
  } catch (error: any) {
    console.error("Failed to fetch revenue metrics:", error)
    return { success: false, error: error.message }
  }
}

// Get fleet utilization
export async function getFleetUtilization(period: Period = "month", limit = 12): Promise<any> {
  try {
    let groupBy

    switch (period) {
      case "day":
        groupBy = "DATE(s.pickup_date)"
        break
      case "week":
        groupBy = "TO_CHAR(s.pickup_date, 'IYYY-IW')"
        break
      case "month":
      default:
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

    const result: any = await executeQuery(query, [limit])
    const labels = result.map((row: any) => row.time_period)
    const series = result.map((row: any) => Number(row.utilization_rate))
    return { success: true, data: { labels, series } }
  } catch (error: any) {
    console.error("Failed to fetch fleet utilization:", error)
    return { success: false, error: error.message }
  }
}

// Get top performing drivers
export async function getTopDrivers(limit = 5): Promise<any> {
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
export async function getShipmentStatusDistribution(): Promise<any> {
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
export async function getRoutePerformance(limit = 5): Promise<any> {
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

interface AnalyticsResult {
  success: boolean;
  data?: any;
  error?: string;
}

export async function getShipmentStats(range: string): Promise<AnalyticsResult> {
  try {
    const query = `
      SELECT 
        TO_CHAR(DATE_TRUNC('day', created_at), 'YYYY-MM-DD') as date,
        COUNT(*) as total_shipments,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_shipments
      FROM shipments
      WHERE created_at >= CURRENT_DATE - INTERVAL '1' DAY * $1
      GROUP BY DATE_TRUNC('day', created_at)
      ORDER BY date
    `
    const data = await executeQuery(query, [range])
    return { success: true, data }
  } catch (error: any) {
    console.error("Failed to fetch shipment stats:", error)
    return { success: false, error: error.message }
  }
}

export async function getRevenueStats(range: string): Promise<AnalyticsResult> {
  try {
    const query = `
      SELECT 
        TO_CHAR(DATE_TRUNC('day', created_at), 'YYYY-MM-DD') as date,
        SUM(price) as total_revenue,
        AVG(price) as average_revenue
      FROM shipments
      WHERE created_at >= CURRENT_DATE - INTERVAL '1' DAY * $1
      GROUP BY DATE_TRUNC('day', created_at)
      ORDER BY date
    `
    const data = await executeQuery(query, [range])
    return { success: true, data }
  } catch (error: any) {
    console.error("Failed to fetch revenue stats:", error)
    return { success: false, error: error.message }
  }
}

export async function getFleetStats(range: string): Promise<AnalyticsResult> {
  try {
    const query = `
      SELECT 
        TO_CHAR(DATE_TRUNC('day', created_at), 'YYYY-MM-DD') as date,
        COUNT(*) as total_trucks,
        COUNT(CASE WHEN status = 'in_service' THEN 1 END) as active_trucks
      FROM trucks
      WHERE created_at >= CURRENT_DATE - INTERVAL '1' DAY * $1
      GROUP BY DATE_TRUNC('day', created_at)
      ORDER BY date
    `
    const data = await executeQuery(query, [range])
    return { success: true, data }
  } catch (error: any) {
    console.error("Failed to fetch fleet stats:", error)
    return { success: false, error: error.message }
  }
}

export async function getDriverStats(range: string): Promise<AnalyticsResult> {
  try {
    const query = `
      SELECT 
        TO_CHAR(DATE_TRUNC('day', created_at), 'YYYY-MM-DD') as date,
        COUNT(*) as total_drivers,
        COUNT(CASE WHEN status = 'available' THEN 1 END) as available_drivers
      FROM drivers
      WHERE created_at >= CURRENT_DATE - INTERVAL '1' DAY * $1
      GROUP BY DATE_TRUNC('day', created_at)
      ORDER BY date
    `
    const data = await executeQuery(query, [range])
    return { success: true, data }
  } catch (error: any) {
    console.error("Failed to fetch driver stats:", error)
    return { success: false, error: error.message }
  }
}

export async function getDashboardData(
  period: Period
): Promise<{
  totalRevenue: number;
  revenueChange: number;
  totalShipments: number;
  shipmentsChange: number;
  totalDistance: number;
  distanceChange: number;
  activeTrucks: number;
  activeTrucksChange: number;
  issues: number;
  issuesChange: number;
}> {
  // Implementation of getDashboardData function
}

export async function getRevenueChartData(
  period: Period
): Promise<{ date: string; revenue: number }[]> {
  // Implementation of getRevenueChartData function
}

export async function getShipmentsByStatus(
  period: Period
): Promise<{ status: string; count: number }[]> {
  // Implementation of getShipmentsByStatus function
}

export async function getRevenueByLocation(
  period: Period
): Promise<{ location: string; revenue: number }[]> {
  // Implementation of getRevenueByLocation function
}
