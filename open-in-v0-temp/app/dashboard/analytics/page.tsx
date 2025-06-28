"use client"

import { useEffect, useState } from "react"
import { BarChart3, Calendar, DollarSign, Package, Truck, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PeriodSelector } from "@/components/period-selector"
import { MetricCard } from "@/components/metric-card"
import { LineChartComponent as LineChart } from "@/components/charts/line-chart"
import { BarChartComponent as BarChart } from "@/components/charts/bar-chart"
import { PieChartComponent as PieChart } from "@/components/charts/pie-chart"
import { TopDriversTable } from "@/components/top-drivers-table"
import { RoutePerformanceTable } from "@/components/route-performance-table"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

// Mock data - in a real app, this would come from your API
const mockData = {
  // Shipment metrics
  shipmentVolume: [
    { date: "2023-01", count: 120 },
    { date: "2023-02", count: 132 },
    { date: "2023-03", count: 145 },
    { date: "2023-04", count: 155 },
    { date: "2023-05", count: 170 },
    { date: "2023-06", count: 185 },
  ],
  shipmentStatus: [
    { status: "pending", count: "45" },
    { status: "in_transit", count: "65" },
    { status: "delivered", count: "120" },
    { status: "cancelled", count: "15" },
  ],

  // Performance metrics
  onTimeDelivery: [
    { date: "2023-01", rate: 92 },
    { date: "2023-02", rate: 94 },
    { date: "2023-03", rate: 91 },
    { date: "2023-04", rate: 95 },
    { date: "2023-05", rate: 97 },
    { date: "2023-06", rate: 96 },
  ],
  fleetUtilization: [
    { date: "2023-01", rate: 78 },
    { date: "2023-02", rate: 82 },
    { date: "2023-03", rate: 85 },
    { date: "2023-04", rate: 83 },
    { date: "2023-05", rate: 88 },
    { date: "2023-06", rate: 90 },
  ],
  topDrivers: [
    { id: 1, name: "John Smith", deliveries: 45, onTimeRate: 98, rating: 4.9 },
    { id: 2, name: "Maria Garcia", deliveries: 42, onTimeRate: 97, rating: 4.8 },
    { id: 3, name: "David Chen", deliveries: 38, onTimeRate: 95, rating: 4.7 },
    { id: 4, name: "Sarah Johnson", deliveries: 36, onTimeRate: 96, rating: 4.9 },
    { id: 5, name: "Michael Brown", deliveries: 33, onTimeRate: 94, rating: 4.6 },
  ],

  // Financial metrics
  revenue: [
    { date: "2023-01", amount: 125000 },
    { date: "2023-02", amount: 138000 },
    { date: "2023-03", amount: 152000 },
    { date: "2023-04", amount: 147000 },
    { date: "2023-05", amount: 163000 },
    { date: "2023-06", amount: 178000 },
  ],
  avgShipmentPrice: [
    { date: "2023-01", amount: 1050 },
    { date: "2023-02", amount: 1045 },
    { date: "2023-03", amount: 1048 },
    { date: "2023-04", amount: 1052 },
    { date: "2023-05", amount: 1060 },
    { date: "2023-06", amount: 1065 },
  ],
  routePerformance: [
    {
      id: 1,
      origin: "Los Angeles, CA",
      destination: "San Francisco, CA",
      shipments: 78,
      avgTime: "6h 30m",
      avgCost: 850,
    },
    { id: 2, origin: "New York, NY", destination: "Boston, MA", shipments: 65, avgTime: "4h 15m", avgCost: 720 },
    { id: 3, origin: "Chicago, IL", destination: "Detroit, MI", shipments: 52, avgTime: "5h 45m", avgCost: 680 },
    { id: 4, origin: "Miami, FL", destination: "Orlando, FL", shipments: 48, avgTime: "3h 30m", avgCost: 520 },
    { id: 5, origin: "Seattle, WA", destination: "Portland, OR", shipments: 45, avgTime: "3h 45m", avgCost: 580 },
  ],
}

// Helper function to get status color
const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: "#FFB547",
    in_transit: "#3498DB",
    delivered: "#2ECC71",
    cancelled: "#E74C3C",
  }
  return colors[status] || "#CCCCCC"
}

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("month")
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || (user.userType !== "company" && user.userType !== "admin"))) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  if (!user || (user.userType !== "company" && user.userType !== "admin")) {
    return null
  }

  // Format data for charts
  const shipmentVolumeData = mockData.shipmentVolume.map((item) => ({
    name: item.date,
    value: item.count,
  }))

  // Filter out any undefined items and ensure status property exists
  const filteredShipmentStatus = mockData.shipmentStatus.filter((status) => status && status.status)

  const statusChartData = filteredShipmentStatus.map((status) => ({
    name: status.status.charAt(0).toUpperCase() + status.status.slice(1).replace("_", " "),
    value: Number.parseInt(status.count || "0", 10),
    color: getStatusColor(status.status),
  }))

  const onTimeDeliveryData = mockData.onTimeDelivery.map((item) => ({
    name: item.date,
    value: item.rate,
  }))

  const fleetUtilizationData = mockData.fleetUtilization.map((item) => ({
    name: item.date,
    value: item.rate,
  }))

  const revenueData = mockData.revenue.map((item) => ({
    name: item.date,
    value: item.amount,
  }))

  const avgShipmentPriceData = mockData.avgShipmentPrice.map((item) => ({
    name: item.date,
    value: item.amount,
  }))

  // Calculate metrics
  const totalShipments = mockData.shipmentVolume.reduce((sum, item) => sum + item.count, 0)
  const avgOnTimeRate =
    mockData.onTimeDelivery.reduce((sum, item) => sum + item.rate, 0) / mockData.onTimeDelivery.length
  const totalRevenue = mockData.revenue.reduce((sum, item) => sum + item.amount, 0)
  const avgShipmentPrice =
    mockData.avgShipmentPrice.reduce((sum, item) => sum + item.amount, 0) / mockData.avgShipmentPrice.length

  // Calculate trends (comparing last two periods)
  const shipmentTrend =
    mockData.shipmentVolume[mockData.shipmentVolume.length - 1].count -
    mockData.shipmentVolume[mockData.shipmentVolume.length - 2].count
  const revenueTrend =
    mockData.revenue[mockData.revenue.length - 1].amount - mockData.revenue[mockData.revenue.length - 2].amount
  const onTimeTrend =
    mockData.onTimeDelivery[mockData.onTimeDelivery.length - 1].rate -
    mockData.onTimeDelivery[mockData.onTimeDelivery.length - 2].rate
  const utilizationTrend =
    mockData.fleetUtilization[mockData.fleetUtilization.length - 1].rate -
    mockData.fleetUtilization[mockData.fleetUtilization.length - 2].rate

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track your logistics performance and make data-driven decisions.</p>
        </div>
        <PeriodSelector value={period} onValueChange={setPeriod} />
      </div>

      <Tabs defaultValue="shipments" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>

        {/* Shipments Tab */}
        <TabsContent value="shipments" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Shipments"
              value={totalShipments.toString()}
              description={`${Math.abs(shipmentTrend)} from last period`}
              icon={Package}
              trend={shipmentTrend >= 0 ? "up" : "down"}
              trendLabel={shipmentTrend >= 0 ? "increase" : "decrease"}
            />
            <MetricCard
              title="Pending Shipments"
              value={filteredShipmentStatus.find((s) => s.status === "pending")?.count || "0"}
              description="Awaiting processing"
              icon={Calendar}
              trend="neutral"
            />
            <MetricCard
              title="In Transit"
              value={filteredShipmentStatus.find((s) => s.status === "in_transit")?.count || "0"}
              description="Currently moving"
              icon={Truck}
              trend="neutral"
            />
            <MetricCard
              title="Delivered"
              value={filteredShipmentStatus.find((s) => s.status === "delivered")?.count || "0"}
              description="Successfully completed"
              icon={Package}
              trend="neutral"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Shipment Volume</CardTitle>
                <CardDescription>Monthly shipment count</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <LineChart data={shipmentVolumeData} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Shipment Status</CardTitle>
                <CardDescription>Distribution by status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">{statusChartData.length > 0 && <PieChart data={statusChartData} />}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Route Performance</CardTitle>
              <CardDescription>Top performing routes by volume</CardDescription>
            </CardHeader>
            <CardContent>
              <RoutePerformanceTable data={mockData.routePerformance} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="On-Time Delivery"
              value={`${avgOnTimeRate.toFixed(1)}%`}
              description={`${Math.abs(onTimeTrend).toFixed(1)}% from last period`}
              icon={Package}
              trend={onTimeTrend >= 0 ? "up" : "down"}
              trendLabel={onTimeTrend >= 0 ? "increase" : "decrease"}
            />
            <MetricCard
              title="Fleet Utilization"
              value={`${mockData.fleetUtilization[mockData.fleetUtilization.length - 1].rate}%`}
              description={`${Math.abs(utilizationTrend).toFixed(1)}% from last period`}
              icon={Truck}
              trend={utilizationTrend >= 0 ? "up" : "down"}
              trendLabel={utilizationTrend >= 0 ? "increase" : "decrease"}
            />
            <MetricCard
              title="Active Drivers"
              value="28"
              description="Out of 32 total drivers"
              icon={Users}
              trend="neutral"
            />
            <MetricCard
              title="Avg Delivery Time"
              value="2.3 days"
              description="0.2 days faster than target"
              icon={Calendar}
              trend="up"
              trendLabel="faster"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>On-Time Delivery Rate</CardTitle>
                <CardDescription>Monthly performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <LineChart data={onTimeDeliveryData} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Fleet Utilization</CardTitle>
                <CardDescription>Monthly utilization rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <LineChart data={fleetUtilizationData} />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Performing Drivers</CardTitle>
              <CardDescription>Based on delivery count and ratings</CardDescription>
            </CardHeader>
            <CardContent>
              <TopDriversTable data={mockData.topDrivers} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Revenue"
              value={formatCurrency(totalRevenue)}
              description={`${revenueTrend >= 0 ? "+" : "-"}${formatCurrency(Math.abs(revenueTrend))} from last period`}
              icon={DollarSign}
              trend={revenueTrend >= 0 ? "up" : "down"}
              trendLabel={revenueTrend >= 0 ? "increase" : "decrease"}
            />
            <MetricCard
              title="Avg Shipment Price"
              value={formatCurrency(avgShipmentPrice)}
              description="Per shipment"
              icon={Package}
              trend="neutral"
            />
            <MetricCard
              title="Profit Margin"
              value="24.8%"
              description="1.2% above target"
              icon={BarChart3}
              trend="up"
              trendLabel="increase"
            />
            <MetricCard
              title="Cost per Mile"
              value="$1.85"
              description="$0.10 below industry avg"
              icon={Truck}
              trend="down"
              trendLabel="decrease (good)"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <BarChart data={revenueData} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Average Shipment Price</CardTitle>
                <CardDescription>Monthly average</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <LineChart data={avgShipmentPriceData} />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Revenue by Customer Type</CardTitle>
              <CardDescription>Distribution of revenue sources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <PieChart
                  data={[
                    { name: "Enterprise", value: 45, color: "#4C51BF" },
                    { name: "SMB", value: 30, color: "#3182CE" },
                    { name: "Individual", value: 25, color: "#38B2AC" },
                  ]}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
