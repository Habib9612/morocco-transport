"use client"

import { useState } from "react"
import Link from "next/link"
import { Package, Filter, MoreHorizontal, MapPin, Clock, Search, Download, Plus, Check } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import ShipmentMap from "@/components/shipment-map"

export default function ShipmentsPage() {
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedShipment, setSelectedShipment] = useState<string | null>(null)

  const shipments = [
    {
      id: "SHP-3948",
      customer: "Acme Corp",
      origin: "Chicago, IL",
      destination: "Atlanta, GA",
      status: "in_transit",
      created: "2024-03-15",
      eta: "2024-03-17",
      priority: "high",
    },
    {
      id: "SHP-3921",
      customer: "TechGiant Inc",
      origin: "Dallas, TX",
      destination: "Miami, FL",
      status: "in_transit",
      created: "2024-03-16",
      eta: "2024-03-19",
      priority: "medium",
    },
    {
      id: "SHP-3899",
      customer: "Global Logistics",
      origin: "Seattle, WA",
      destination: "Denver, CO",
      status: "pending",
      created: "2024-03-18",
      eta: "2024-03-22",
      priority: "low",
    },
    {
      id: "SHP-3876",
      customer: "Express Deliveries",
      origin: "New York, NY",
      destination: "Chicago, IL",
      status: "in_transit",
      created: "2024-03-17",
      eta: "2024-03-18",
      priority: "high",
    },
    {
      id: "SHP-3845",
      customer: "FastShip Co",
      origin: "Los Angeles, CA",
      destination: "Phoenix, AZ",
      status: "delivered",
      created: "2024-03-12",
      eta: "2024-03-15",
      priority: "medium",
    },
  ]

  const filteredShipments = shipments.filter((shipment) => {
    if (filter !== "all" && shipment.status !== filter) return false

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        shipment.id.toLowerCase().includes(query) ||
        shipment.customer.toLowerCase().includes(query) ||
        shipment.origin.toLowerCase().includes(query) ||
        shipment.destination.toLowerCase().includes(query)
      )
    }

    return true
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
          >
            Delivered
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
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800"
          >
            Pending
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
          <h1 className="text-2xl font-bold tracking-tight">Shipments</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage and track all your shipments</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/shipments/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Shipment
          </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Shipment List</CardTitle>
              <CardDescription>Manage all shipments</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
                <Input
                  type="search"
                  placeholder="Search shipments..."
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
                  <DropdownMenuItem onClick={() => setFilter("pending")}>
                    <Check className={`mr-2 h-4 w-4 ${filter === "pending" ? "opacity-100" : "opacity-0"}`} />
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("in_transit")}>
                    <Check className={`mr-2 h-4 w-4 ${filter === "in_transit" ? "opacity-100" : "opacity-0"}`} />
                    In Transit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("delivered")}>
                    <Check className={`mr-2 h-4 w-4 ${filter === "delivered" ? "opacity-100" : "opacity-0"}`} />
                    Delivered
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
                  <TableHead className="w-[120px]">Shipment ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShipments.map((shipment) => (
                  <TableRow
                    key={shipment.id}
                    onClick={() => setSelectedShipment(shipment.id)}
                    className="cursor-pointer"
                  >
                    <TableCell className="font-medium">{shipment.id}</TableCell>
                    <TableCell>{shipment.customer}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                          <MapPin className="h-3 w-3 mr-1 text-blue-500" />
                          {shipment.origin}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                          <MapPin className="h-3 w-3 mr-1 text-red-500" />
                          {shipment.destination}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(shipment.status)}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          shipment.priority === "high"
                            ? "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"
                            : shipment.priority === "medium"
                              ? "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800"
                              : "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
                        }
                      >
                        {shipment.priority.charAt(0).toUpperCase() + shipment.priority.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuItem>Edit shipment</DropdownMenuItem>
                          <DropdownMenuItem>Track shipment</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-500">Cancel shipment</DropdownMenuItem>
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
            <CardTitle>Shipment Tracking</CardTitle>
            <CardDescription>Real-time location of selected shipment</CardDescription>
          </CardHeader>
          <CardContent className="p-0 h-[300px]">
            <ShipmentMap />
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Shipment Timeline</CardTitle>
            <CardDescription>Track progress of the selected shipment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute h-full w-px bg-slate-200 dark:bg-slate-700 left-7"></div>
              <ol className="space-y-6">
                {[
                  {
                    id: 1,
                    title: "Order Created",
                    description: "Shipment was created and entered into the system",
                    date: "Mar 15, 2024",
                    time: "09:30 AM",
                    status: "completed",
                  },
                  {
                    id: 2,
                    title: "Carrier Assigned",
                    description: "FastTruck Logistics assigned to handle the shipment",
                    date: "Mar 15, 2024",
                    time: "10:45 AM",
                    status: "completed",
                  },
                  {
                    id: 3,
                    title: "Pickup Scheduled",
                    description: "Pickup from Chicago Distribution Center",
                    date: "Mar 15, 2024",
                    time: "08:00 AM",
                    status: "completed",
                  },
                  {
                    id: 4,
                    title: "In Transit",
                    description: "Shipment is on its way to the destination",
                    date: "Mar 15, 2024",
                    time: "09:15 AM",
                    status: "active",
                  },
                  {
                    id: 5,
                    title: "Delivery",
                    description: "Expected delivery at Atlanta Logistics Hub",
                    date: "Mar 17, 2024",
                    time: "04:00 PM",
                    status: "pending",
                  },
                ].map((event) => (
                  <li key={event.id} className="relative flex gap-6">
                    <div
                      className={`h-14 w-14 rounded-full ${
                        event.status === "completed"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : event.status === "active"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                            : "bg-slate-100 text-slate-400 dark:bg-slate-800"
                      } flex items-center justify-center z-10`}
                    >
                      {event.status === "completed" ? (
                        <Check className="h-6 w-6" />
                      ) : event.status === "active" ? (
                        <Clock className="h-6 w-6" />
                      ) : (
                        <Clock className="h-6 w-6" />
                      )}
                    </div>
                    <div className="flex-1 pt-1">
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{event.description}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {event.date} at {event.time}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipment Details</CardTitle>
            <CardDescription>Information about selected shipment</CardDescription>
          </CardHeader>
          <CardContent>
            {selectedShipment ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Shipment ID</h4>
                  <p className="font-medium">SHP-3948</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Customer</h4>
                  <p className="font-medium">Acme Corp</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Route</h4>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                      <span>Chicago, IL</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-red-500" />
                      <span>Atlanta, GA</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Status</h4>
                  <Badge
                    variant="outline"
                    className="bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
                  >
                    In Transit
                  </Badge>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Estimated Delivery</h4>
                  <p className="font-medium">Mar 17, 2024 04:00 PM</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Carrier</h4>
                  <p className="font-medium">FastTruck Logistics</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[250px] text-center">
                <Package className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
                <h3 className="font-medium text-slate-500 dark:text-slate-400 mb-1">No shipment selected</h3>
                <p className="text-sm text-slate-400 dark:text-slate-500">
                  Select a shipment from the list to view details
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
