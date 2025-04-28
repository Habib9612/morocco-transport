"use client"

import { Button } from "@/components/ui/button"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ArrowDown, ArrowUp, TrendingUp, DollarSign, Clock, Truck, Package, Users } from "lucide-react"

// Sample data for charts
const deliveryData = [
  { month: "Jan", onTime: 85, delayed: 15 },
  { month: "Feb", onTime: 88, delayed: 12 },
  { month: "Mar", onTime: 90, delayed: 10 },
  { month: "Apr", onTime: 92, delayed: 8 },
  { month: "May", onTime: 89, delayed: 11 },
  { month: "Jun", onTime: 94, delayed: 6 },
]

const costData = [
  { month: "Jan", actual: 12500, projected: 13000 },
  { month: "Feb", actual: 11800, projected: 12500 },
  { month: "Mar", actual: 13200, projected: 12800 },
  { month: "Apr", actual: 12900, projected: 13100 },
  { month: "May", actual: 14100, projected: 13500 },
  { month: "Jun", actual: 13500, projected: 14000 },
]

const volumeData = [
  { month: "Jan", shipments: 120 },
  { month: "Feb", shipments: 132 },
  { month: "Mar", shipments: 145 },
  { month: "Apr", shipments: 155 },
  { month: "May", shipments: 165 },
  { month: "Jun", shipments: 180 },
]

const carrierPerformanceData = [
  { name: "Express Logistics", rating: 4.8, onTime: 96, cost: 92 },
  { name: "FastTrack Shipping", rating: 4.6, onTime: 94, cost: 88 },
  { name: "Metro Carriers", rating: 4.3, onTime: 91, cost: 95 },
  { name: "City Haulers", rating: 4.7, onTime: 95, cost: 85 },
  { name: "Regional Transport", rating: 4.5, onTime: 93, cost: 90 },
]

const fleetUtilizationData = [
  { month: "Jan", utilization: 72 },
  { month: "Feb", utilization: 75 },
  { month: "Mar", utilization: 80 },
  { month: "Apr", utilization: 82 },
  { month: "May", utilization: 85 },
  { month: "Jun", utilization: 88 },
]

export default function AnalyticsPage() {
  const { user } = useAuth()
  const [timeRange, setTimeRange] = useState("6m")

  // Determine which analytics to show based on user type
  const renderUserSpecificAnalytics = () => {
    if (user?.userType === "individual") {
      return (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">142</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 flex items-center">
                    <ArrowUp className="mr-1 h-4 w-4" />
                    12.5%
                  </span>{" "}
                  from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94.2%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 flex items-center">
                    <ArrowUp className="mr-1 h-4 w-4" />
                    2.1%
                  </span>{" "}
                  from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Cost</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$125.50</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-red-500 flex items-center">
                    <ArrowDown className="mr-1 h-4 w-4" />
                    3.2%
                  </span>{" "}
                  from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Matches</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85.7%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 flex items-center">
                    <ArrowUp className="mr-1 h-4 w-4" />
                    5.4%
                  </span>{" "}
                  from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Delivery Performance</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartContainer
                  config={{
                    onTime: {
                      label: "On Time",
                      color: "hsl(var(--chart-1))",
                    },
                    delayed: {
                      label: "Delayed",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={deliveryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="onTime" fill="var(--color-onTime)" stackId="a" />
                      <Bar dataKey="delayed" fill="var(--color-delayed)" stackId="a" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Shipping Costs</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartContainer
                  config={{
                    actual: {
                      label: "Actual",
                      color: "hsl(var(--chart-1))",
                    },
                    projected: {
                      label: "Projected",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={costData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line type="monotone" dataKey="actual" stroke="var(--color-actual)" />
                      <Line type="monotone" dataKey="projected" stroke="var(--color-projected)" strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Carriers by Performance</CardTitle>
              <CardDescription>Your most reliable shipping partners</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {carrierPerformanceData.map((carrier) => (
                  <div className="flex items-center" key={carrier.name}>
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <Truck className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{carrier.name}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span className="mr-2">Rating: {carrier.rating}</span>
                        <span className="mr-2">•</span>
                        <span className="mr-2">On-time: {carrier.onTime}%</span>
                        <span className="mr-2">•</span>
                        <span>Cost efficiency: {carrier.cost}%</span>
                      </div>
                    </div>
                    <div className="font-medium">{90 + Math.floor(carrier.rating * 2)}% match</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )
    } else if (user?.userType === "carrier") {
      return (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Deliveries Completed</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">187</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 flex items-center">
                    <ArrowUp className="mr-1 h-4 w-4" />
                    15.3%
                  </span>{" "}
                  from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">On-Time Rate</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">96.8%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 flex items-center">
                    <ArrowUp className="mr-1 h-4 w-4" />
                    1.2%
                  </span>{" "}
                  from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$24,350</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 flex items-center">
                    <ArrowUp className="mr-1 h-4 w-4" />
                    18.2%
                  </span>{" "}
                  from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Match Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78.3%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 flex items-center">
                    <ArrowUp className="mr-1 h-4 w-4" />
                    4.7%
                  </span>{" "}
                  from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Delivery Volume</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartContainer
                  config={{
                    shipments: {
                      label: "Shipments",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={volumeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="shipments"
                        stroke="var(--color-shipments)"
                        fill="var(--color-shipments)"
                        fillOpacity={0.2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Earnings Trend</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartContainer
                  config={{
                    actual: {
                      label: "Actual",
                      color: "hsl(var(--chart-1))",
                    },
                    projected: {
                      label: "Projected",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={costData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line type="monotone" dataKey="actual" stroke="var(--color-actual)" />
                      <Line type="monotone" dataKey="projected" stroke="var(--color-projected)" strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Shippers by Volume</CardTitle>
              <CardDescription>Your most frequent customers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {[
                  { name: "Tech Solutions Inc.", volume: 42, revenue: 5250, rating: 4.9 },
                  { name: "Global Imports", volume: 38, revenue: 4780, rating: 4.7 },
                  { name: "City Distributors", volume: 35, revenue: 4320, rating: 4.8 },
                  { name: "Metro Retail", volume: 31, revenue: 3950, rating: 4.6 },
                  { name: "Coastal Exports", volume: 28, revenue: 3640, rating: 4.5 },
                ].map((shipper) => (
                  <div className="flex items-center" key={shipper.name}>
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{shipper.name}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span className="mr-2">Volume: {shipper.volume} shipments</span>
                        <span className="mr-2">•</span>
                        <span className="mr-2">Revenue: ${shipper.revenue}</span>
                        <span className="mr-2">•</span>
                        <span>Rating: {shipper.rating}</span>
                      </div>
                    </div>
                    <div className="font-medium">${Math.floor(shipper.revenue / shipper.volume)} avg</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )
    } else if (user?.userType === "company") {
      return (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fleet Size</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">48</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 flex items-center">
                    <ArrowUp className="mr-1 h-4 w-4" />4 vehicles
                  </span>{" "}
                  from last quarter
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Drivers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 flex items-center">
                    <ArrowUp className="mr-1 h-4 w-4" />6 drivers
                  </span>{" "}
                  from last quarter
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fleet Utilization</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">88.2%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 flex items-center">
                    <ArrowUp className="mr-1 h-4 w-4" />
                    3.5%
                  </span>{" "}
                  from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Operating Costs</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$156,420</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-red-500 flex items-center">
                    <ArrowUp className="mr-1 h-4 w-4" />
                    5.2%
                  </span>{" "}
                  from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Fleet Utilization</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartContainer
                  config={{
                    utilization: {
                      label: "Utilization %",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={fleetUtilizationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="utilization" stroke="var(--color-utilization)" />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Delivery Performance</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartContainer
                  config={{
                    onTime: {
                      label: "On Time",
                      color: "hsl(var(--chart-1))",
                    },
                    delayed: {
                      label: "Delayed",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={deliveryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="onTime" fill="var(--color-onTime)" stackId="a" />
                      <Bar dataKey="delayed" fill="var(--color-delayed)" stackId="a" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Maintenance Status</CardTitle>
                <CardDescription>Upcoming and overdue maintenance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      id: "TRK-1042",
                      type: "Box Truck",
                      status: "Overdue",
                      service: "Oil Change",
                      dueDate: "3 days ago",
                    },
                    {
                      id: "VAN-2389",
                      type: "Cargo Van",
                      status: "Upcoming",
                      service: "Tire Rotation",
                      dueDate: "Tomorrow",
                    },
                    {
                      id: "TRK-5621",
                      type: "Semi Truck",
                      status: "Upcoming",
                      service: "Full Inspection",
                      dueDate: "3 days",
                    },
                    {
                      id: "VAN-1278",
                      type: "Cargo Van",
                      status: "Overdue",
                      service: "Brake Service",
                      dueDate: "1 day ago",
                    },
                    {
                      id: "TRK-3490",
                      type: "Box Truck",
                      status: "Upcoming",
                      service: "Transmission Check",
                      dueDate: "5 days",
                    },
                  ].map((vehicle) => (
                    <div className="flex items-center justify-between" key={vehicle.id}>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {vehicle.id} - {vehicle.type}
                        </p>
                        <p className="text-sm text-muted-foreground">{vehicle.service}</p>
                      </div>
                      <div
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          vehicle.status === "Overdue" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {vehicle.status}: {vehicle.dueDate}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Driver Performance</CardTitle>
                <CardDescription>Top performing drivers this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Michael Chen", deliveries: 42, onTime: 98, fuelEfficiency: 95 },
                    { name: "Sarah Johnson", deliveries: 38, onTime: 97, fuelEfficiency: 92 },
                    { name: "David Rodriguez", deliveries: 36, onTime: 96, fuelEfficiency: 94 },
                    { name: "Lisa Williams", deliveries: 35, onTime: 95, fuelEfficiency: 91 },
                    { name: "Robert Kim", deliveries: 33, onTime: 94, fuelEfficiency: 93 },
                  ].map((driver, index) => (
                    <div className="flex items-center" key={driver.name}>
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                        <span className="font-medium text-primary">{index + 1}</span>
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{driver.name}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span className="mr-2">Deliveries: {driver.deliveries}</span>
                          <span className="mr-2">•</span>
                          <span className="mr-2">On-time: {driver.onTime}%</span>
                          <span className="mr-2">•</span>
                          <span>Fuel efficiency: {driver.fuelEfficiency}%</span>
                        </div>
                      </div>
                      <div className="font-medium">{90 + index}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )
    } else {
      return (
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Analytics Dashboard</h2>
            <p className="text-muted-foreground">Please select a user type to view analytics</p>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">View performance metrics and insights for your logistics operations</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="3m">Last 3 months</SelectItem>
              <SelectItem value="6m">Last 6 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="costs">Costs</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          {renderUserSpecificAnalytics()}
        </TabsContent>
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Detailed performance analysis for your operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ChartContainer
                  config={{
                    onTime: {
                      label: "On Time Delivery",
                      color: "hsl(var(--chart-1))",
                    },
                    utilization: {
                      label: "Resource Utilization",
                      color: "hsl(var(--chart-2))",
                    },
                    efficiency: {
                      label: "Operational Efficiency",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { month: "Jan", onTime: 85, utilization: 72, efficiency: 78 },
                        { month: "Feb", onTime: 88, utilization: 75, efficiency: 80 },
                        { month: "Mar", onTime: 90, utilization: 80, efficiency: 83 },
                        { month: "Apr", onTime: 92, utilization: 82, efficiency: 85 },
                        { month: "May", onTime: 89, utilization: 85, efficiency: 82 },
                        { month: "Jun", onTime: 94, utilization: 88, efficiency: 87 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line type="monotone" dataKey="onTime" stroke="var(--color-onTime)" />
                      <Line type="monotone" dataKey="utilization" stroke="var(--color-utilization)" />
                      <Line type="monotone" dataKey="efficiency" stroke="var(--color-efficiency)" />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="costs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cost Analysis</CardTitle>
              <CardDescription>Breakdown of operational costs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ChartContainer
                  config={{
                    fuel: {
                      label: "Fuel",
                      color: "hsl(var(--chart-1))",
                    },
                    maintenance: {
                      label: "Maintenance",
                      color: "hsl(var(--chart-2))",
                    },
                    labor: {
                      label: "Labor",
                      color: "hsl(var(--chart-3))",
                    },
                    other: {
                      label: "Other",
                      color: "hsl(var(--chart-4))",
                    },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { month: "Jan", fuel: 4500, maintenance: 2800, labor: 8200, other: 1500 },
                        { month: "Feb", fuel: 4200, maintenance: 3100, labor: 8000, other: 1600 },
                        { month: "Mar", fuel: 4800, maintenance: 2500, labor: 8300, other: 1400 },
                        { month: "Apr", fuel: 5100, maintenance: 2700, labor: 8500, other: 1700 },
                        { month: "May", fuel: 5400, maintenance: 3200, labor: 8700, other: 1800 },
                        { month: "Jun", fuel: 5200, maintenance: 2900, labor: 8600, other: 1600 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="fuel" fill="var(--color-fuel)" />
                      <Bar dataKey="maintenance" fill="var(--color-maintenance)" />
                      <Bar dataKey="labor" fill="var(--color-labor)" />
                      <Bar dataKey="other" fill="var(--color-other)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="ai-insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Insights</CardTitle>
              <CardDescription>Intelligent recommendations for your logistics operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800/30">
                  <div className="flex items-center mb-2">
                    <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                    <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300">Route Optimization</h3>
                  </div>
                  <p className="text-blue-700 dark:text-blue-200 mb-3">
                    AI analysis suggests optimizing routes for vehicles #TRK-1042 and #TRK-3490 could reduce fuel
                    consumption by approximately 12% and delivery times by 8%.
                  </p>
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-300 dark:border-blue-800 dark:hover:bg-blue-900/30"
                    >
                      View Details
                    </Button>
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-100 dark:border-amber-800/30">
                  <div className="flex items-center mb-2">
                    <Truck className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2" />
                    <h3 className="text-lg font-medium text-amber-800 dark:text-amber-300">Maintenance Prediction</h3>
                  </div>
                  <p className="text-amber-700 dark:text-amber-200 mb-3">
                    Predictive maintenance models indicate vehicles #VAN-2389 and #TRK-5621 may require transmission
                    service within the next 2 weeks, scheduling now could prevent costly breakdowns.
                  </p>
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      className="text-amber-600 border-amber-200 hover:bg-amber-50 dark:text-amber-300 dark:border-amber-800 dark:hover:bg-amber-900/30"
                    >
                      Schedule Service
                    </Button>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800/30">
                  <div className="flex items-center mb-2">
                    <Users className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                    <h3 className="text-lg font-medium text-green-800 dark:text-green-300">Resource Allocation</h3>
                  </div>
                  <p className="text-green-700 dark:text-green-200 mb-3">
                    Based on historical data and current trends, reallocating 3 vehicles from the western region to the
                    northern region could increase overall fleet utilization by 7.5%.
                  </p>
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      className="text-green-600 border-green-200 hover:bg-green-50 dark:text-green-300 dark:border-green-800 dark:hover:bg-green-900/30"
                    >
                      View Analysis
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
