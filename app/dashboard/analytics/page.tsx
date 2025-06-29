"use client"

import { useAnalytics } from '@/lib/hooks/use-dashboard-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AnalyticsPage() {
  const { analytics, loading, error } = useAnalytics()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div>Loading analytics...</div>
      </div>
    )
  }

  if (error || !analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{error || 'Failed to load analytics'}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalShipments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics.revenue}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Trucks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.activeTrucks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.onTimeDelivery}%</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Analytics Data</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(analytics, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}
