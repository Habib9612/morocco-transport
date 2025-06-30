"use client"

import { useState } from "react"
import {
  Truck,
  MapPin,
  BarChart3,
  Settings,
  Users,
  AlertTriangle,
  Package,
  PenToolIcon as Tool,
  DollarSign,
  Route,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TruckLogisticsDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <div className="flex items-center gap-2">
          <Truck className="h-6 w-6" />
          <h1 className="text-lg font-semibold">TruckLogix</h1>
        </div>
        <nav className="ml-auto flex items-center gap-4">
          <Select defaultValue="fleet-a">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Fleet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fleet-a">Fleet A (12 Trucks)</SelectItem>
              <SelectItem value="fleet-b">Fleet B (8 Trucks)</SelectItem>
              <SelectItem value="fleet-c">Fleet C (15 Trucks)</SelectItem>
            </SelectContent>
          </Select>
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
            <AvatarFallback>FM</AvatarFallback>
          </Avatar>
        </nav>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-muted/40 lg:block">
          <nav className="flex flex-col gap-2 p-4">
            <Button
              variant={activeTab === "overview" ? "default" : "ghost"}
              className="justify-start"
              onClick={() => setActiveTab("overview")}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Overview
            </Button>
            <Button
              variant={activeTab === "fleet" ? "default" : "ghost"}
              className="justify-start"
              onClick={() => setActiveTab("fleet")}
            >
              <Truck className="mr-2 h-4 w-4" />
              Fleet Management
            </Button>
            <Button
              variant={activeTab === "routes" ? "default" : "ghost"}
              className="justify-start"
              onClick={() => setActiveTab("routes")}
            >
              <Route className="mr-2 h-4 w-4" />
              Route Optimization
            </Button>
            <Button
              variant={activeTab === "deliveries" ? "default" : "ghost"}
              className="justify-start"
              onClick={() => setActiveTab("deliveries")}
            >
              <Package className="mr-2 h-4 w-4" />
              Deliveries
            </Button>
            <Button
              variant={activeTab === "maintenance" ? "default" : "ghost"}
              className="justify-start"
              onClick={() => setActiveTab("maintenance")}
            >
              <Tool className="mr-2 h-4 w-4" />
              Maintenance
            </Button>
            <Button
              variant={activeTab === "costs" ? "default" : "ghost"}
              className="justify-start"
              onClick={() => setActiveTab("costs")}
            >
              <DollarSign className="mr-2 h-4 w-4" />
              Cost Analysis
            </Button>
            <Button
              variant={activeTab === "drivers" ? "default" : "ghost"}
              className="justify-start"
              onClick={() => setActiveTab("drivers")}
            >
              <Users className="mr-2 h-4 w-4" />
              Drivers
            </Button>
            <Button
              variant={activeTab === "settings" ? "default" : "ghost"}
              className="justify-start"
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </nav>
        </aside>
        <main className="flex-1 overflow-auto p-6">
          <Tabs defaultValue="overview" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Truck Logistics Dashboard</h2>
              <TabsList className="grid grid-cols-4 md:grid-cols-8">
                <TabsTrigger value="overview" className="hidden md:flex">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="fleet" className="hidden md:flex">
                  Fleet
                </TabsTrigger>
                <TabsTrigger value="routes" className="hidden md:flex">
                  Routes
                </TabsTrigger>
                <TabsTrigger value="deliveries" className="hidden md:flex">
                  Deliveries
                </TabsTrigger>
                <TabsTrigger value="maintenance" className="hidden md:flex">
                  Maintenance
                </TabsTrigger>
                <TabsTrigger value="costs" className="hidden md:flex">
                  Costs
                </TabsTrigger>
                <TabsTrigger value="drivers" className="hidden md:flex">
                  Drivers
                </TabsTrigger>
                <TabsTrigger value="settings" className="hidden md:flex">
                  Settings
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="space-y-6 mt-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Trucks</CardTitle>
                    <Truck className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">18/24</div>
                    <p className="text-xs text-muted-foreground">6 trucks in maintenance</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Deliveries Today</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">42</div>
                    <p className="text-xs text-muted-foreground">28 completed, 14 in progress</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Fuel Efficiency</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">7.2 mpg</div>
                    <p className="text-xs text-muted-foreground">+0.3 from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Maintenance Alerts</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-xs text-muted-foreground">2 critical, 1 routine</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                  <CardHeader>
                    <CardTitle>Active Routes</CardTitle>
                    <CardDescription>Current truck locations and routes</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="h-[300px] bg-muted/20 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="mx-auto h-12 w-12 text-muted" />
                        <p className="mt-2 text-sm text-muted-foreground">Interactive map would display here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Upcoming Deliveries</CardTitle>
                    <CardDescription>Next 5 scheduled deliveries</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          id: "DEL-4392",
                          location: "Chicago Distribution Center",
                          time: "10:30 AM",
                          status: "In Transit",
                        },
                        { id: "DEL-4393", location: "Milwaukee Warehouse", time: "11:45 AM", status: "Scheduled" },
                        { id: "DEL-4394", location: "Detroit Retail Store", time: "1:15 PM", status: "Scheduled" },
                        { id: "DEL-4395", location: "Indianapolis Factory", time: "2:30 PM", status: "Scheduled" },
                        { id: "DEL-4396", location: "Columbus Depot", time: "4:00 PM", status: "Scheduled" },
                      ].map((delivery) => (
                        <div key={delivery.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{delivery.id}</p>
                            <p className="text-sm text-muted-foreground">{delivery.location}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant={delivery.status === "In Transit" ? "default" : "outline"}>
                              {delivery.status}
                            </Badge>
                            <p className="mt-1 text-sm text-muted-foreground">{delivery.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Maintenance Schedule</CardTitle>
                    <CardDescription>Upcoming maintenance tasks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { truck: "TRK-1042", task: "Oil Change", date: "Mar 25", priority: "Routine" },
                        { truck: "TRK-1036", task: "Brake Inspection", date: "Mar 26", priority: "Critical" },
                        { truck: "TRK-1039", task: "Tire Rotation", date: "Mar 27", priority: "Routine" },
                      ].map((task, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{task.truck}</p>
                            <p className="text-sm text-muted-foreground">{task.task}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant={task.priority === "Critical" ? "destructive" : "outline"}>
                              {task.priority}
                            </Badge>
                            <p className="mt-1 text-sm text-muted-foreground">{task.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Fuel Consumption</CardTitle>
                    <CardDescription>Last 7 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { day: "Monday", gallons: 420, percent: 70 },
                        { day: "Tuesday", gallons: 380, percent: 63 },
                        { day: "Wednesday", gallons: 450, percent: 75 },
                        { day: "Thursday", gallons: 520, percent: 87 },
                        { day: "Friday", gallons: 480, percent: 80 },
                        { day: "Saturday", gallons: 350, percent: 58 },
                        { day: "Sunday", gallons: 280, percent: 47 },
                      ].map((day) => (
                        <div key={day.day} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <p>{day.day}</p>
                            <p className="font-medium">{day.gallons} gal</p>
                          </div>
                          <Progress value={day.percent} />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Driver Performance</CardTitle>
                    <CardDescription>Top 5 drivers by efficiency</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: "John Smith", id: "DRV-104", efficiency: 92, deliveries: 18 },
                        { name: "Maria Garcia", id: "DRV-087", efficiency: 89, deliveries: 16 },
                        { name: "David Chen", id: "DRV-112", efficiency: 87, deliveries: 15 },
                        { name: "Sarah Johnson", id: "DRV-098", efficiency: 85, deliveries: 17 },
                        { name: "Robert Kim", id: "DRV-076", efficiency: 83, deliveries: 14 },
                      ].map((driver) => (
                        <div key={driver.id} className="flex items-center gap-4">
                          <Avatar>
                            <AvatarFallback>
                              {driver.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <p className="font-medium leading-none">{driver.name}</p>
                            <p className="text-sm text-muted-foreground">{driver.id}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{driver.efficiency}%</p>
                            <p className="text-xs text-muted-foreground">{driver.deliveries} deliveries</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="fleet" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Fleet Management</CardTitle>
                  <CardDescription>Manage your truck fleet, view status and details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p>Fleet management content would go here, including:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Truck inventory and status</li>
                      <li>Vehicle specifications</li>
                      <li>Maintenance history</li>
                      <li>Assignment status</li>
                      <li>Fuel efficiency tracking</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="routes" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Route Optimization</CardTitle>
                  <CardDescription>Plan and optimize delivery routes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p>Route optimization tools would go here, including:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Interactive route planning</li>
                      <li>Traffic-aware routing</li>
                      <li>Multi-stop optimization</li>
                      <li>Fuel efficiency calculations</li>
                      <li>ETA predictions</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="deliveries" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Management</CardTitle>
                  <CardDescription>Track and manage all deliveries</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p>Delivery management tools would go here, including:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Delivery scheduling</li>
                      <li>Real-time tracking</li>
                      <li>Proof of delivery</li>
                      <li>Customer notifications</li>
                      <li>Delivery history</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="maintenance" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Maintenance Tracking</CardTitle>
                  <CardDescription>Schedule and track vehicle maintenance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p>Maintenance tracking tools would go here, including:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Preventive maintenance scheduling</li>
                      <li>Service history</li>
                      <li>Parts inventory</li>
                      <li>Maintenance alerts</li>
                      <li>Cost tracking</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="costs" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cost Analysis</CardTitle>
                  <CardDescription>Track and analyze operational costs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p>Cost analysis tools would go here, including:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Fuel cost tracking</li>
                      <li>Maintenance expenses</li>
                      <li>Driver wages</li>
                      <li>Cost per mile calculations</li>
                      <li>Budget planning</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="drivers" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Driver Management</CardTitle>
                  <CardDescription>Manage driver information and performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p>Driver management tools would go here, including:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Driver profiles</li>
                      <li>License and certification tracking</li>
                      <li>Hours of service compliance</li>
                      <li>Performance metrics</li>
                      <li>Training records</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>Configure system preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p>Settings options would go here, including:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>User management</li>
                      <li>Notification preferences</li>
                      <li>Integration settings</li>
                      <li>Data import/export</li>
                      <li>System configuration</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
