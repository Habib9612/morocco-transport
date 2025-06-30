import { useState, useEffect } from 'react'
import { apiClient } from '../api-client'
import { getShipmentStats, getRevenueStats, getFleetStats, getDriverStats } from '@/app/actions/analytics'

export function useShipments() {
  const [shipments, setShipments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchShipments()
  }, [])

  const fetchShipments = async () => {
    try {
      setLoading(true)
      const response = await apiClient.shipments.getAll()
      setShipments(response.data)
    } catch (err) {
      setError('Failed to fetch shipments')
    } finally {
      setLoading(false)
    }
  }

  return { shipments, loading, error, refetch: fetchShipments }
}

export function useAnalytics() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await apiClient.analytics.dashboard()
      setAnalytics(response.data)
    } catch (err) {
      setError('Failed to fetch analytics')
    } finally {
      setLoading(false)
    }
  }

  return { analytics, loading, error, refetch: fetchAnalytics }
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await apiClient.notifications.getAll()
      setNotifications(response.data)
    } catch (err) {
      console.error('Failed to fetch notifications:', err)
    } finally {
      setLoading(false)
    }
  }

  return { notifications, loading, refetch: fetchNotifications }
}

export function useTrucks() {
  const [trucks, setTrucks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTrucks()
  }, [])

  const fetchTrucks = async () => {
    try {
      setLoading(true)
      const response = await apiClient.trucks.getAll()
      setTrucks(response.data)
    } catch (err) {
      setError('Failed to fetch trucks')
    } finally {
      setLoading(false)
    }
  }

  return { trucks, loading, error, refetch: fetchTrucks }
}

export function useMessages() {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const response = await apiClient.messages.getAll()
      setMessages(response.data)
    } catch (err) {
      console.error('Failed to fetch messages:', err)
    } finally {
      setLoading(false)
    }
  }

  return { messages, loading, refetch: fetchMessages }
}

interface StatsData {
  total_shipments?: number;
  delivered_shipments?: number;
  total_revenue?: number;
  average_revenue?: number;
  total_trucks?: number;
  active_trucks?: number;
  total_drivers?: number;
  available_drivers?: number;
}

export function useDashboardData(range: string = '30') {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [shipmentRes, revenueRes, fleetRes, driverRes] = await Promise.all([
          getShipmentStats(range),
          getRevenueStats(range),
          getFleetStats(range),
          getDriverStats(range),
        ]);

        if (!shipmentRes.success || !revenueRes.success || !fleetRes.success || !driverRes.success) {
          throw new Error('Failed to fetch one or more dashboard stats.');
        }

        setData({
          total_shipments: shipmentRes.data?.[0]?.total_shipments || 0,
          delivered_shipments: shipmentRes.data?.[0]?.delivered_shipments || 0,
          total_revenue: revenueRes.data?.[0]?.total_revenue || 0,
          average_revenue: revenueRes.data?.[0]?.average_revenue || 0,
          total_trucks: fleetRes.data?.[0]?.total_trucks || 0,
          active_trucks: fleetRes.data?.[0]?.active_trucks || 0,
          total_drivers: driverRes.data?.[0]?.total_drivers || 0,
          available_drivers: driverRes.data?.[0]?.available_drivers || 0,
        });
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [range]);

  return { data, loading, error };
} 