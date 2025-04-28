"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Truck,
  Filter,
  MoreHorizontal,
  Search,
  Download,
  Plus,
  Check,
  Wrench,
  AlertTriangle,
  Power,
  PiggyBank,
  MapPin,
  ArrowUpDown,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import ShipmentMap from "@/components/shipment-map"

export default function FleetPage() {
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const trucks = [
    {
      id: "TRK-1001",
      model: "Freightliner Cascadia",
      license_plate: "IL-4872XY",
      status: "available",
      location: "Chicago, IL",
      fuel: 78,
      maintenance_due: false,
      last_maintenance: "2024-02-15",
      mileage: 45892,
      driver: "Michael Chen",
    },
    {
      id: "TRK-1002",
      model: "Peterbilt 579",
      license_plate: "TX-8291AZ",
      status: "in_transit",
      location: "Dallas, TX",
      fuel: 52,
      maintenance_due: false,
      last_maintenance: "2024-01-28",
      mileage: 78123,
      driver: "Sarah Johnson",
    },
    {
      id: "TRK-1003",
      model: "Kenworth T680",
      license_plate: "NY-6134BT",
      status: "maintenance",
      location: "New York, NY",
      fuel: 32,
      maintenance_due: true,
      last_maintenance: "2023-11-15",
      mileage: 112456,
      driver: null,
    },
    {
      id: "TRK-1004",
      model: "Volvo VNL 860",
      license_plate: "CA-3721CV",
      status: "in_transit",
      location: "Los Angeles, CA",
      fuel: 45,
      maintenance_due: true,
      last_maintenance: "2023-12-08",
      mileage: 95234,
      driver: "David Wilson",
    },
    {
      id: "TRK-1005",
      model: "Mack Anthem",
      license_plate: "GA-9047DX",
      status: "available",
      location: "Atlanta, GA",
      fuel: 83,
      maintenance_due: false,
      last_maintenance: "2024-02-28",
      mileage: 38456,
      driver: null,
    },
  ]

  const filteredTrucks = trucks.filter((truck) => {
    if (filter !== "all" && truck.status !== filter) return false

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        truck.id.toLowerCase().includes(query) ||
        truck.model.toLowerCase().includes(query) ||
        truck.license_plate.toLowerCase().includes(query) ||
        (truck.driver && truck.driver.toLowerCase().includes(query))
      )
    }

    return true
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
          >
            Available
          </Badge>
        )
      case "in_transit":
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
          >
            In Transit
          </Badge>
        )
      case "maintenance":
        return (
          <Badge
            variant="outline"
            className="bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800"
          >
            Maintenance
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fleet Management</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage and monitor your truck fleet</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/fleet/add">
            <Plus className="h-4 w-4 mr-2" />
            Add Truck
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fleet</CardTitle>
            <Truck className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <div className="flex flex-col">
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span>Available: 18</span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <span>In Transit: 17</span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span>In Maintenance: 7</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance Due</CardTitle>
            <Wrench className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <div className="flex items-center pt-1">
              <div className="text-xs text-red-500 dark:text-red-400 inline-flex items-center">
                <AlertTriangle className="h-3 w-3 mr-1" />2 overdue
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Fuel Level</CardTitle>
            <Power className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">64%</div>
            <div className="flex items-center justify-between pt-1">
              <Progress value={64} className="h-2 w-[80px]" />
              <span className="text-xs text-slate-500 dark:text-slate-400">~315 miles range</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Costs</CardTitle>
            <PiggyBank className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$24,892</div>
            <div className="flex items-center pt-1">
              <span className="text-xs text-slate-500 dark:text-slate-400">$592 per truck on average</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Truck Fleet</CardTitle>
              <CardDescription>Manage all trucks</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
                <Input
                  type="search"
                  placeholder="Search trucks..."
                  className="pl-9 w-[200px] md:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                    <span className="sr-only">Filter</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilter("all")}>
                    <Check className={`mr-2 h-4 w-4 ${filter === "all" ? "opacity-100" : "opacity-0"}`} />
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("available")}>
                    <Check className={`mr-2 h-4 w-4 ${filter === "available" ? "opacity-100" : "opacity-0"}`} />
                    Available
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("in_transit")}>
                    <Check className={`mr-2 h-4 w-4 ${filter === "in_transit" ? "opacity-100" : "opacity-0"}`} />
                    In Transit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("maintenance")}>
                    <Check className={`mr-2 h-4 w-4 ${filter === "maintenance" ? "opacity-100" : "opacity-0"}`} />
                    Maintenance
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
                <span className="sr-only">Download</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">ID</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>License Plate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Fuel Level</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTrucks.map((truck) => (
                  <TableRow key={truck.id} className="cursor-pointer">
                    <TableCell className="font-medium">{truck.id}</TableCell>
                    <TableCell>{truck.model}</TableCell>
                    <TableCell>{truck.license_plate}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(truck.status)}
                        {truck.maintenance_due && (
                          <Badge
                            variant="outline"
                            className="bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"
                          >
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Maintenance Due
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-slate-400" />
                        {truck.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Progress value={truck.fuel} className="h-2 w-16" />
                        <span>{truck.fuel}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuItem>Assign driver</DropdownMenuItem>
                          <DropdownMenuItem>Schedule maintenance</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-500">Mark as out of service</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fleet Location</CardTitle>
            <CardDescription>Real-time location of your fleet</CardDescription>
          </CardHeader>
          <CardContent className="p-0 h-[400px]">
            <ShipmentMap isFleetView={true} />
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Schedule</CardTitle>
            <CardDescription>Upcoming maintenance tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  truck: "TRK-1003",
                  task: "Oil Change & Inspection",
                  date: "Mar 25",
                  priority: "High",
                  status: "overdue",
                },
                { truck: "TRK-1004", task: "Brake Service", date: "Mar 28", priority: "Critical", status: "scheduled" },
                { truck: "TRK-1008", task: "Tire Rotation", date: "Apr 2", priority: "Normal", status: "scheduled" },
                { truck: "TRK-1012", task: "Engine Diagnostics", date: "Apr 5", priority: "High", status: "scheduled" },
              ].map((task, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{task.truck}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{task.task}</p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant="outline"
                      className={
                        task.priority === "Critical"
                          ? "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"
                          : task.priority === "High"
                            ? "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800"
                            : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                      }
                    >
                      {task.priority}
                    </Badge>
                    <p
                      className={`mt-1 text-xs ${task.status === "overdue" ? "text-red-500 dark:text-red-400" : "text-slate-500 dark:text-slate-400"}`}
                    >
                      {task.status === "overdue" ? "Overdue: " : ""}
                      {task.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t">
            <Button variant="ghost" size="sm" className="ml-auto" asChild>
              <Link href="/dashboard/fleet/maintenance">
                View all maintenance
                <ArrowUpDown className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fleet Performance</CardTitle>
            <CardDescription>Key performance metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Utilization Rate</span>
                <span className="font-medium">82.5%</span>
              </div>
              <Progress value={82.5} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Fuel Efficiency</span>
                <span className="font-medium">7.2 mpg</span>
              </div>
              <Progress value={72} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Maintenance Compliance</span>
                <span className="font-medium">91.4%</span>
              </div>
              <Progress value={91.4} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>On-Time Rate</span>
                <span className="font-medium">94.8%</span>
              </div>
              <Progress value={94.8} className="h-2" />
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <h4 className="font-medium mb-3">Breakdown by Status</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                    <span>Available</span>
                  </div>
                  <span>42.9%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
                    <span>In Transit</span>
                  </div>
                  <span>40.5%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-amber-500 mr-2"></div>
                    <span>Maintenance</span>
                  </div>
                  <span>16.6%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
