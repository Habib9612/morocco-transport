"use client"

import { useState } from "react"
import Link from "next/link"
import { Truck, Filter, MoreHorizontal, Search, Download, Plus, Check, Star, MapPin } from "lucide-react"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

export default function CarriersPage() {
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const carriers = [
    {
      id: "CAR-1001",
      name: "FastTruck Logistics",
      location: "Chicago, IL",
      fleet_size: 28,
      active_shipments: 12,
      rating: 4.8,
      status: "active",
    },
    {
      id: "CAR-1002",
      name: "Horizon Transport",
      location: "Atlanta, GA",
      fleet_size: 42,
      active_shipments: 18,
      rating: 4.5,
      status: "active",
    },
    {
      id: "CAR-1003",
      name: "Eagle Shipping",
      location: "Dallas, TX",
      fleet_size: 15,
      active_shipments: 7,
      rating: 4.7,
      status: "active",
    },
    {
      id: "CAR-1004",
      name: "Metro Freight",
      location: "New York, NY",
      fleet_size: 32,
      active_shipments: 0,
      rating: 4.2,
      status: "inactive",
    },
    {
      id: "CAR-1005",
      name: "West Coast Carriers",
      location: "Los Angeles, CA",
      fleet_size: 24,
      active_shipments: 9,
      rating: 4.6,
      status: "active",
    },
  ]

  const filteredCarriers = carriers.filter((carrier) => {
    if (filter !== "all" && carrier.status !== filter) return false

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        carrier.id.toLowerCase().includes(query) ||
        carrier.name.toLowerCase().includes(query) ||
        carrier.location.toLowerCase().includes(query)
      )
    }

    return true
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Carriers</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage and track all your carriers</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/carriers/add">
            <Plus className="h-4 w-4 mr-2" />
            Add Carrier
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Carrier List</CardTitle>
            <CardDescription>Manage all carriers</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
              <Input
                type="search"
                placeholder="Search carriers..."
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
                <DropdownMenuItem onClick={() => setFilter("active")}>
                  <Check className={`mr-2 h-4 w-4 ${filter === "active" ? "opacity-100" : "opacity-0"}`} />
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("inactive")}>
                  <Check className={`mr-2 h-4 w-4 ${filter === "inactive" ? "opacity-100" : "opacity-0"}`} />
                  Inactive
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
                <TableHead className="w-[180px]">Carrier</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Fleet Size</TableHead>
                <TableHead>Active Shipments</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCarriers.map((carrier) => (
                <TableRow key={carrier.id} className="cursor-pointer">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src="/placeholder.svg?height=36&width=36" alt={carrier.name} />
                        <AvatarFallback>
                          {carrier.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{carrier.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{carrier.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-slate-400" />
                      {carrier.location}
                    </div>
                  </TableCell>
                  <TableCell>{carrier.fleet_size} trucks</TableCell>
                  <TableCell>
                    {carrier.active_shipments > 0 ? (
                      <div className="flex items-center gap-1.5">
                        <span>{carrier.active_shipments}</span>
                        <Progress value={(carrier.active_shipments / carrier.fleet_size) * 100} className="h-2 w-20" />
                      </div>
                    ) : (
                      <span className="text-slate-500">None</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="mr-1">{carrier.rating}</span>
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        carrier.status === "active"
                          ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                          : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                      }
                    >
                      {carrier.status.charAt(0).toUpperCase() + carrier.status.slice(1)}
                    </Badge>
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
                        <DropdownMenuItem>View profile</DropdownMenuItem>
                        <DropdownMenuItem>View shipments</DropdownMenuItem>
                        <DropdownMenuItem>Contact carrier</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-500">Deactivate</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Top Rated Carriers</CardTitle>
            <CardDescription>Highest rated carriers by performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {carriers
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 3)
                .map((carrier, i) => (
                  <div key={carrier.id} className="flex items-center gap-3">
                    <div className="font-bold text-lg text-slate-400 dark:text-slate-500 w-5">{i + 1}.</div>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt={carrier.name} />
                      <AvatarFallback>
                        {carrier.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{carrier.name}</p>
                      <div className="flex items-center">
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${i < Math.floor(carrier.rating) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"}`}
                            />
                          ))}
                        <span className="ml-1.5 text-xs text-slate-500 dark:text-slate-400">{carrier.rating}</span>
                      </div>
                    </div>
                    <span className="text-sm text-slate-500 dark:text-slate-400">{carrier.fleet_size} trucks</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Carrier Performance</CardTitle>
            <CardDescription>Average performance metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>On-time Delivery</span>
                <span className="font-medium">94.3%</span>
              </div>
              <Progress value={94.3} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Driver Safety Score</span>
                <span className="font-medium">87.6%</span>
              </div>
              <Progress value={87.6} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Customer Satisfaction</span>
                <span className="font-medium">92.8%</span>
              </div>
              <Progress value={92.8} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Cost Efficiency</span>
                <span className="font-medium">89.4%</span>
              </div>
              <Progress value={89.4} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common carrier management tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Plus className="h-4 w-4 mr-2" />
              Add New Carrier
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Truck className="h-4 w-4 mr-2" />
              Assign Shipment to Carrier
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Star className="h-4 w-4 mr-2" />
              Review Carrier Performance
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Export Carrier Reports
            </Button>
          </CardContent>
          <CardFooter className="bg-slate-50 dark:bg-slate-800/50 px-6 py-3 border-t">
            <Link href="/dashboard/carriers/management" className="text-sm text-blue-600 hover:underline font-medium">
              View Carrier Management Guide
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
