import { useState, useEffect } from 'react'
import { apiClient } from '../api-client'

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