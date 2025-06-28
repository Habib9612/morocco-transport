"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Truck,
  Package,
  Clock,
  Plus,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  TrendingUp,
  Route,
  Brain,
  Timer,
  Fuel,
  LineChart,
  MapPin,
  MessageSquare,
  User,
  Building2,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShipmentMap } from "@/components/shipment-map"
import PerformanceChart from "@/components/performance-chart"
import RecentActivityFeed from "@/components/recent-activity-feed"
import TruckModel from "@/components/truck-model"
import { useAuth } from "@/lib/auth-context"
import { useTranslation } from "@/lib/translation-context"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function DashboardPage() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState("")
  const [originCity, setOriginCity] = useState("")
  const [destinationCity, setDestinationCity] = useState("")
  const [searchStep, setSearchStep] = useState(1)
  const [userType, setUserType] = useState<"individual" | "carrier" | "company">("individual")

  useEffect(() => {
    // Set user type based on auth context
    if (user?.role) {
      setUserType(user.role as "individual" | "carrier" | "company")
    }
  }, [user])

  const handleSearch = () => {
    if (searchStep === 1 && originCity && destinationCity) {
      setSearchStep(2)
    } else if (searchStep === 2) {
      // In a real app, this would navigate to search results
      setSearchStep(3)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">AI-Powered Logistics Dashboard</h1>
          <p className="text-slate-400">
            Welcome back, {user?.name || "User"}! Here&apos;s an overview of your logistics operations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {userType === "individual" && (
            <div className="flex items-center text-blue-400">
              <User className="h-4 w-4 mr-1" />
              <span className="text-sm">Individual Shipper</span>
            </div>
          )}
          {userType === "carrier" && (
            <div className="flex items-center text-green-400">
              <Truck className="h-4 w-4 mr-1" />
              <span className="text-sm">Carrier</span>
            </div>
          )}
          {userType === "company" && (
            <div className="flex items-center text-purple-400">
              <Building2 className="h-4 w-4 mr-1" />
              <span className="text-sm">Fleet Manager</span>
            </div>
          )}
          <LanguageSwitcher variant="minimal" className="ml-2" />
        </div>
      </div>

      {/* AI Carrier Matching Card - Only show for shippers */}
      {(userType === "individual" || userType === "company") && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center">
              <Brain className="h-5 w-5 text-purple-500 mr-2" />
              AI-Powered Carrier Matching
            </CardTitle>
            <CardDescription className="text-gray-400">
              Find the perfect carriers for your shipments with our intelligent matching algorithm
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {searchStep === 1 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Origin</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                        <Input
                          placeholder="Enter pickup city or location"
                          className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-blue-500"
                          value={originCity}
                          onChange={(e) => setOriginCity(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Destination</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                        <Input
                          placeholder="Enter delivery city or location"
                          className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-blue-500"
                          value={destinationCity}
                          onChange={(e) => setDestinationCity(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Cargo Type</label>
                        <Select>
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:ring-blue-500">
                            <SelectValue placeholder="Select cargo type" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700 text-white">
                            <SelectItem value="general">General Cargo</SelectItem>
                            <SelectItem value="refrigerated">Refrigerated</SelectItem>
                            <SelectItem value="hazardous">Hazardous Materials</SelectItem>
                            <SelectItem value="oversized">Oversized</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Delivery Date</label>
                        <Input
                          type="date"
                          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-blue-500"
                        />
                      </div>
                    </div>

                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={handleSearch}
                      disabled={!originCity || !destinationCity}
                    >
                      Find Carriers
                    </Button>
                  </div>
                )}

                {searchStep === 2 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                      <div className="flex items-center">
                        <Badge className="bg-blue-600 text-white mr-2">1</Badge>
                        <span>
                          Route: {originCity} to {destinationCity}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white"
                        onClick={() => setSearchStep(1)}
                      >
                        Edit
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Truck Type</label>
                      <Select>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:ring-blue-500">
                          <SelectValue placeholder="Select truck type" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          <SelectItem value="flatbed">Flatbed Truck</SelectItem>
                          <SelectItem value="refrigerated">Refrigerated Truck</SelectItem>
                          <SelectItem value="box">Box Truck</SelectItem>
                          <SelectItem value="tanker">Tanker Truck</SelectItem>
                          <SelectItem value="container">Container Truck</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Cargo Weight (tons)</label>
                      <Input
                        type="number"
                        placeholder="Enter cargo weight"
                        className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Special Requirements</label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="liftgate"
                            className="rounded border-gray-700 bg-gray-800 text-blue-600 focus:ring-blue-500"
                          />
                          <label htmlFor="liftgate" className="text-sm text-gray-300">
                            Lift Gate
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="insidedelivery"
                            className="rounded border-gray-700 bg-gray-800 text-blue-600 focus:ring-blue-500"
                          />
                          <label htmlFor="insidedelivery" className="text-sm text-gray-300">
                            Inside Delivery
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="tempcontrol"
                            className="rounded border-gray-700 bg-gray-800 text-blue-600 focus:ring-blue-500"
                          />
                          <label htmlFor="tempcontrol" className="text-sm text-gray-300">
                            Temperature Control
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="insurance"
                            className="rounded border-gray-700 bg-gray-800 text-blue-600 focus:ring-blue-500"
                          />
                          <label htmlFor="insurance" className="text-sm text-gray-300">
                            Additional Insurance
                          </label>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSearch}>
                      Match with Carriers
                    </Button>
                  </div>
                )}

                {searchStep === 3 && (
                  <div className="space-y-4">
                    <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-800">
                      <div className="flex items-center mb-3">
                        <Brain className="h-5 w-5 text-blue-400 mr-2" />
                        <h3 className="text-lg font-medium text-white">AI Matching Results</h3>
                      </div>
                      <p className="text-sm text-gray-300 mb-3">We found 5 carriers matching your requirements:</p>

                      <div className="space-y-3">
                        {[
                          { name: "TransitExpress", rating: 4.9, price: "$1,250", eta: "2d 4h", match: 98 },
                          { name: "FastTruck Inc.", rating: 4.7, price: "$1,180", eta: "2d 8h", match: 95 },
                          { name: "SpeedLogistics", rating: 4.8, price: "$1,320", eta: "1d 22h", match: 92 },
                        ].map((carrier, index) => (
                          <div
                            key={index}
                            className="bg-gray-800/70 p-3 rounded-md border border-gray-700 flex justify-between items-center"
                          >
                            <div>
                              <div className="flex items-center">
                                <Truck className="h-4 w-4 text-blue-500 mr-2" />
                                <span className="font-medium text-white">{carrier.name}</span>
                                <div className="ml-2 flex items-center text-yellow-500 text-xs">
                                  <span>★</span>
                                  <span>{carrier.rating}</span>
                                </div>
                              </div>
                              <div className="text-xs text-gray-400 mt-1 flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>ETA: {carrier.eta}</span>
                                <span className="mx-2">•</span>
                                <span>{carrier.price}</span>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Badge className="bg-purple-600 text-white mr-2">{carrier.match}% Match</Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-white border-blue-700 hover:bg-blue-900/50"
                              >
                                Select
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 text-center">
                        <Button variant="link" className="text-blue-400 hover:text-blue-300">
                          View all matches <ArrowUpRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>

                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => setSearchStep(1)}
                    >
                      New Search
                    </Button>
                  </div>
                )}
              </div>

              <div className="h-[300px] bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
                <TruckModel mode="matching" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Shipment Finding Card - Only show for carriers */}
      {userType === "carrier" && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center">
              <Brain className="h-5 w-5 text-purple-500 mr-2" />
              AI-Powered Shipment Finder
            </CardTitle>
            <CardDescription className="text-gray-400">
              Find the best shipments near your location with our intelligent matching algorithm
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-800">
                  <div className="flex items-center mb-3">
                    <MapPin className="h-5 w-5 text-blue-400 mr-2" />
                    <h3 className="text-lg font-medium text-white">Nearby Shipments</h3>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">We found 4 shipments near your current location:</p>

                  <div className="space-y-3">
                    {[
                      {
                        id: "SHP-3948",
                        from: "Casablanca",
                        to: "Rabat",
                        type: "Electronics",
                        weight: "120kg",
                        price: "1,200 MAD",
                        match: 98,
                      },
                      {
                        id: "SHP-3921",
                        from: "Casablanca",
                        to: "Marrakech",
                        type: "Textiles",
                        weight: "350kg",
                        price: "2,500 MAD",
                        match: 95,
                      },
                      {
                        id: "SHP-3899",
                        from: "Casablanca",
                        to: "Tangier",
                        type: "Furniture",
                        weight: "500kg",
                        price: "3,800 MAD",
                        match: 92,
                      },
                    ].map((shipment, index) => (
                      <div
                        key={index}
                        className="bg-gray-800/70 p-3 rounded-md border border-gray-700 flex justify-between items-center"
                      >
                        <div>
                          <div className="flex items-center">
                            <Package className="h-4 w-4 text-blue-500 mr-2" />
                            <span className="font-medium text-white">{shipment.id}</span>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span>
                                {shipment.from} to {shipment.to}
                              </span>
                            </div>
                            <div className="flex items-center mt-0.5">
                              <Package className="h-3 w-3 mr-1" />
                              <span>
                                {shipment.type} ({shipment.weight})
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <Badge className="bg-purple-600 text-white mb-1">{shipment.match}% Match</Badge>
                          <span className="text-white font-medium">{shipment.price}</span>
                          <Button size="sm" className="mt-1 bg-blue-600 hover:bg-blue-700">
                            Bid Now
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 text-center">
                    <Button variant="link" className="text-blue-400 hover:text-blue-300" asChild>
                      <Link href="/dashboard/nearby">
                        View all nearby shipments <ArrowUpRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" asChild>
                  <Link href="/dashboard/nearby">Find More Shipments</Link>
                </Button>
              </div>

              <div className="h-[300px] bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
                <ShipmentMap />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dashboard type-specific content */}
      {userType === "individual" ? (
        <IndividualDashboard />
      ) : userType === "carrier" ? (
        <CarrierDashboard />
      ) : (
        <CompanyDashboard />
      )}
    </div>
  )
}

function IndividualDashboard() {
  const { t } = useTranslation()
  return (
    <>
      {/* Quick stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Active Shipments</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">37</div>
            <div className="flex items-center pt-1">
              <span className="text-xs text-green-500 dark:text-green-400 inline-flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +2.5%
              </span>
              <span className="text-xs text-gray-500 ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">On-Time Delivery</CardTitle>
            <Clock className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">94.2%</div>
            <div className="flex items-center pt-1">
              <span className="text-xs text-red-500 inline-flex items-center">
                <ArrowDownRight className="h-3 w-3 mr-1" />
                -1.1%
              </span>
              <span className="text-xs text-gray-500 ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Freight Costs</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$12,450</div>
            <div className="flex items-center pt-1">
              <span className="text-xs text-green-500 inline-flex items-center">
                <ArrowDownRight className="h-3 w-3 mr-1" />
                -3.2%
              </span>
              <span className="text-xs text-gray-500 ml-1">under budget</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">AI Matches</CardTitle>
            <Brain className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">28</div>
            <div className="flex items-center pt-1">
              <span className="text-xs text-green-500 inline-flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +10.1%
              </span>
              <span className="text-xs text-gray-500 ml-1">match accuracy</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active shipments and map */}
      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-3 bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-white">Active Shipments</CardTitle>
              <CardDescription className="text-gray-400">Your current shipments in transit</CardDescription>
            </div>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-1" />
              New Shipment
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0 divide-y divide-gray-800">
              {[
                {
                  id: "SHP-3948",
                  status: "in_transit",
                  destination: "Atlanta, GA",
                  progress: 65,
                  eta: "2h 45m",
                  alert: false,
                  carrier: "TransitExpress",
                  aiOptimized: true,
                },
                {
                  id: "SHP-3921",
                  status: "in_transit",
                  destination: "Miami, FL",
                  progress: 42,
                  eta: "5h 20m",
                  alert: true,
                  carrier: "FastTruck Inc.",
                  aiOptimized: false,
                },
                {
                  id: "SHP-3899",
                  status: "pending",
                  destination: "Dallas, TX",
                  progress: 0,
                  eta: "Pending",
                  alert: false,
                  carrier: "Assigned by AI",
                  aiOptimized: true,
                },
                {
                  id: "SHP-3876",
                  status: "in_transit",
                  destination: "Chicago, IL",
                  progress: 89,
                  eta: "30m",
                  alert: false,
                  carrier: "SpeedLogistics",
                  aiOptimized: true,
                },
              ].map((shipment) => (
                <div key={shipment.id} className="flex items-center p-4 relative">
                  {shipment.alert && <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <Link
                          href={`/dashboard/shipments/${shipment.id}`}
                          className="text-sm font-medium text-white hover:underline"
                        >
                          {shipment.id}
                        </Link>
                        <Badge
                          variant={shipment.status === "in_transit" ? "default" : "outline"}
                          className="ml-2 text-xs bg-blue-600 text-white"
                        >
                          {shipment.status === "in_transit" ? "In Transit" : "Pending"}
                        </Badge>
                        {shipment.alert && (
                          <Badge
                            variant="outline"
                            className="ml-2 bg-amber-900/30 text-amber-500 border-amber-800/30 text-xs"
                          >
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Delayed
                          </Badge>
                        )}
                        {shipment.aiOptimized && (
                          <Badge
                            variant="outline"
                            className="ml-2 bg-purple-900/30 text-purple-400 border-purple-800/30 text-xs"
                          >
                            <Brain className="h-3 w-3 mr-1" />
                            AI Optimized
                          </Badge>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800 text-gray-300">
                          <DropdownMenuItem className="hover:bg-gray-800 hover:text-white cursor-pointer">
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-gray-800 hover:text-white cursor-pointer">
                            Contact carrier
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-gray-800" />
                          <DropdownMenuItem className="text-red-500 hover:bg-gray-800 hover:text-red-400 cursor-pointer">
                            Cancel shipment
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="text-sm text-gray-400 mb-1">
                      <div className="flex justify-between">
                        <span>Destination: {shipment.destination}</span>
                        <span className="text-blue-400">{shipment.carrier}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Progress value={shipment.progress} className="h-2 flex-1 bg-gray-800" />
                      <span className="text-xs whitespace-nowrap text-gray-300">ETA: {shipment.eta}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t border-gray-800">
            <Button variant="ghost" size="sm" className="ml-auto text-gray-400 hover:text-white" asChild>
              <Link href="/dashboard/shipments">
                View all shipments
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        <Card className="md:col-span-4 bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">AI-Powered Shipment Tracking</CardTitle>
            <CardDescription className="text-gray-400">
              Real-time location of your active shipments with predictive ETA
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 h-[400px]">
            <ShipmentMap />
          </CardContent>
        </Card>
      </div>

      {/* Recent activity and performance */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
            <CardDescription className="text-gray-400">Latest updates from your shipments</CardDescription>
          </CardHeader>
          <CardContent className="h-[340px] overflow-auto">
            <RecentActivityFeed />
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Performance Analytics</CardTitle>
            <CardDescription className="text-gray-400">
              AI-powered trends in your shipping volume and costs
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[340px]">
            <PerformanceChart />
          </CardContent>
        </Card>
      </div>
    </>
  )
}

function CarrierDashboard() {
  const { t } = useTranslation()
  return (
    <>
      {/* Quick stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Active Deliveries</CardTitle>
            <Truck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">12</div>
            <div className="flex items-center pt-1">
              <span className="text-xs text-green-500 dark:text-green-400 inline-flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +3
              </span>
              <span className="text-xs text-gray-500 ml-1">from last week</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Available Loads</CardTitle>
            <Package className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">28</div>
            <div className="flex items-center pt-1">
              <span className="text-xs text-green-500 inline-flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +5
              </span>
              <span className="text-xs text-gray-500 ml-1">new today</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Monthly Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$8,750</div>
            <div className="flex items-center pt-1">
              <span className="text-xs text-green-500 inline-flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +12.3%
              </span>
              <span className="text-xs text-gray-500 ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Nearby Shippers</CardTitle>
            <MapPin className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">8</div>
            <div className="flex items-center pt-1">
              <span className="text-xs text-blue-500 inline-flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                Within 10km
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active deliveries and map */}
      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-3 bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-white">Active Deliveries</CardTitle>
              <CardDescription className="text-gray-400">Your current shipments in transit</CardDescription>
            </div>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
              <Link href="/dashboard/loads">
                <Plus className="h-4 w-4 mr-1" />
                Find Loads
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0 divide-y divide-gray-800">
              {[
                {
                  id: "SHP-3948",
                  status: "in_transit",
                  origin: "Casablanca",
                  destination: "Rabat",
                  progress: 65,
                  eta: "2h 45m",
                  alert: false,
                  shipper: "Ahmed Electronics",
                  aiOptimized: true,
                },
                {
                  id: "SHP-3921",
                  status: "loading",
                  origin: "Tangier",
                  destination: "Marrakech",
                  progress: 10,
                  eta: "Pickup in 1h",
                  alert: false,
                  shipper: "Maroc Textiles",
                  aiOptimized: true,
                },
                {
                  id: "SHP-3899",
                  status: "in_transit",
                  origin: "Casablanca",
                  destination: "Agadir",
                  progress: 42,
                  eta: "5h 20m",
                  alert: true,
                  shipper: "Agadir Seafood",
                  aiOptimized: false,
                },
              ].map((delivery) => (
                <div key={delivery.id} className="flex items-center p-4 relative">
                  {delivery.alert && <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <Link
                          href={`/dashboard/my-shipments/${delivery.id}`}
                          className="text-sm font-medium text-white hover:underline"
                        >
                          {delivery.id}
                        </Link>
                        <Badge
                          variant={delivery.status === "in_transit" ? "default" : "outline"}
                          className={`ml-2 text-xs ${
                            delivery.status === "in_transit" ? "bg-blue-600" : "bg-amber-600"
                          } text-white`}
                        >
                          {delivery.status === "in_transit" ? "In Transit" : "Loading"}
                        </Badge>
                        {delivery.alert && (
                          <Badge
                            variant="outline"
                            className="ml-2 bg-amber-900/30 text-amber-500 border-amber-800/30 text-xs"
                          >
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Traffic Delay
                          </Badge>
                        )}
                        {delivery.aiOptimized && (
                          <Badge
                            variant="outline"
                            className="ml-2 bg-purple-900/30 text-purple-400 border-purple-800/30 text-xs"
                          >
                            <Brain className="h-3 w-3 mr-1" />
                            AI Optimized
                          </Badge>
                        )}
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white" asChild>
                        <Link href={`/dashboard/messages`}>
                          <MessageSquare className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                    <div className="text-sm text-gray-400 mb-1">
                      <div className="flex justify-between">
                        <span>
                          {delivery.origin} to {delivery.destination}
                        </span>
                        <span className="text-blue-400">{delivery.shipper}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Progress value={delivery.progress} className="h-2 flex-1 bg-gray-800" />
                      <span className="text-xs whitespace-nowrap text-gray-300">ETA: {delivery.eta}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t border-gray-800">
            <Button variant="ghost" size="sm" className="ml-auto text-gray-400 hover:text-white" asChild>
              <Link href="/dashboard/my-shipments">
                View all deliveries
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        <Card className="md:col-span-4 bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">AI-Powered Route Optimization</CardTitle>
            <CardDescription className="text-gray-400">
              Real-time location and optimized routes for your deliveries
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 h-[400px]">
            <ShipmentMap isFleetView={true} />
          </CardContent>
        </Card>
      </div>

      {/* Messages and earnings */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Recent Messages</CardTitle>
            <CardDescription className="text-gray-400">Latest communications with shippers</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0 divide-y divide-gray-800">
              {[
                {
                  id: "msg1",
                  sender: "Ahmed Electronics",
                  message: "I'll be at the pickup location in 30 minutes.",
                  time: "30 minutes ago",
                  unread: true,
                  shipmentId: "SHP-3948",
                },
                {
                  id: "msg2",
                  sender: "Maroc Textiles",
                  message: "Can you confirm the delivery time for tomorrow?",
                  time: "2 hours ago",
                  unread: true,
                  shipmentId: "SHP-3921",
                },
                {
                  id: "msg3",
                  sender: "Agadir Seafood",
                  message: "Please make sure the temperature is maintained at 2°C.",
                  time: "5 hours ago",
                  unread: false,
                  shipmentId: "SHP-3899",
                },
              ].map((message) => (
                <div key={message.id} className="flex items-center p-4 relative">
                  {message.unread && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />}
                  <Avatar className="h-10 w-10 mr-4">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt={message.sender} />
                    <AvatarFallback>
                      {message.sender
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-white">{message.sender}</span>
                        {message.unread && <Badge className="ml-2 bg-blue-600 text-white text-xs">New</Badge>}
                      </div>
                      <span className="text-xs text-gray-500">{message.time}</span>
                    </div>
                    <p className="text-sm text-gray-400 truncate">{message.message}</p>
                    <div className="text-xs text-gray-500 mt-1">Re: {message.shipmentId}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t border-gray-800">
            <Button variant="ghost" size="sm" className="ml-auto text-gray-400 hover:text-white" asChild>
              <Link href="/dashboard/messages">
                View all messages
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Earnings Analytics</CardTitle>
            <CardDescription className="text-gray-400">AI-powered trends in your delivery earnings</CardDescription>
          </CardHeader>
          <CardContent className="h-[340px]">
            <PerformanceChart isFleetView={true} />
          </CardContent>
        </Card>
      </div>
    </>
  )
}

function CompanyDashboard() {
  const { t } = useTranslation()
  return (
    <>
      {/* Quick stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Fleet Status</CardTitle>
            <Truck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">42</div>
            <div className="flex flex-col">
              <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span>Active: 32</span>
              </div>
              <div className="text-xs text-gray-400 flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span>In Maintenance: 7</span>
              </div>
              <div className="text-xs text-gray-400 flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span>Inactive: 3</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Active Shipments</CardTitle>
            <Package className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">127</div>
            <div className="flex items-center pt-1">
              <span className="text-xs text-green-500 inline-flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +12.5%
              </span>
              <span className="text-xs text-gray-500 ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Fuel Efficiency</CardTitle>
            <Fuel className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">7.2 mpg</div>
            <div className="flex items-center pt-1">
              <span className="text-xs text-green-500 inline-flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +0.3
              </span>
              <span className="text-xs text-gray-500 ml-1">from last quarter</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">AI Efficiency Gain</CardTitle>
            <Brain className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">23.7%</div>
            <div className="flex items-center pt-1">
              <span className="text-xs text-green-500 inline-flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +1.8%
              </span>
              <span className="text-xs text-gray-500 ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fleet overview with map */}
      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4 bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">AI-Powered Fleet Management</CardTitle>
            <CardDescription className="text-gray-400">
              Real-time location and predictive maintenance of your fleet
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 h-[400px]">
            <ShipmentMap isFleetView={true} />
          </CardContent>
        </Card>
        <Card className="md:col-span-3 bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-white">Active Drivers</CardTitle>
              <CardDescription className="text-gray-400">AI-optimized routes and assignments</CardDescription>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="text-gray-300 border-gray-700 hover:bg-gray-800 hover:text-white"
            >
              Manage
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0 divide-y divide-gray-800">
              {[
                {
                  name: "Michael Chen",
                  id: "DRV-112",
                  route: "Chicago to Atlanta",
                  progress: 65,
                  status: "on_route",
                  efficiency: 92,
                },
                {
                  name: "Sarah Johnson",
                  id: "DRV-098",
                  route: "Miami to New York",
                  progress: 42,
                  status: "on_route",
                  efficiency: 87,
                },
                {
                  name: "David Wilson",
                  id: "DRV-076",
                  route: "Dallas to Phoenix",
                  progress: 89,
                  status: "on_route",
                  efficiency: 94,
                },
                {
                  name: "Emily Rodriguez",
                  id: "DRV-104",
                  route: "Seattle to Denver",
                  progress: 12,
                  status: "loading",
                  efficiency: 89,
                },
              ].map((driver) => (
                <div key={driver.id} className="flex items-center p-4">
                  <Avatar className="h-10 w-10 mr-4">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt={driver.name} />
                    <AvatarFallback>
                      {driver.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <Link
                        href={`/dashboard/drivers/${driver.id}`}
                        className="text-sm font-medium text-white hover:underline"
                      >
                        {driver.name}
                      </Link>
                      <Badge
                        variant={driver.status === "on_route" ? "default" : "outline"}
                        className="ml-2 text-xs bg-blue-600 text-white"
                      >
                        {driver.status === "on_route" ? "On Route" : "Loading"}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-400 mb-1">
                      <div className="flex justify-between">
                        <span>
                          {driver.id} • {driver.route}
                        </span>
                        <span className="text-green-400">AI Eff: {driver.efficiency}%</span>
                      </div>
                    </div>
                    <Progress value={driver.progress} className="h-1 bg-gray-800" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t border-gray-800">
            <Button variant="ghost" size="sm" className="ml-auto text-gray-400 hover:text-white" asChild>
              <Link href="/dashboard/drivers">
                View all drivers
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Maintenance and Performance */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">AI-Powered Predictive Maintenance</CardTitle>
            <CardDescription className="text-gray-400">Upcoming maintenance tasks optimized by AI</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { truck: "TRK-1042", task: "Oil Change", date: "Mar 25", priority: "Routine", aiPredicted: true },
                {
                  truck: "TRK-1036",
                  task: "Brake Inspection",
                  date: "Mar 26",
                  priority: "Critical",
                  aiPredicted: true,
                },
                { truck: "TRK-1039", task: "Tire Rotation", date: "Mar 27", priority: "Routine", aiPredicted: false },
                { truck: "TRK-1041", task: "Engine Diagnostics", date: "Mar 29", priority: "High", aiPredicted: true },
              ].map((task, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white flex items-center">
                      {task.truck}
                      {task.aiPredicted && (
                        <Badge
                          variant="outline"
                          className="ml-2 bg-purple-900/30 text-purple-400 border-purple-800/30 text-xs"
                        >
                          <Brain className="h-3 w-3 mr-1" />
                          AI Predicted
                        </Badge>
                      )}
                    </p>
                    <p className="text-sm text-gray-400">{task.task}</p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant="outline"
                      className={
                        task.priority === "Critical"
                          ? "bg-red-900/30 text-red-400 border-red-800/30"
                          : task.priority === "High"
                            ? "bg-amber-900/30 text-amber-400 border-amber-800/30"
                            : "bg-gray-800 text-gray-400 border-gray-700"
                      }
                    >
                      {task.priority}
                    </Badge>
                    <p className="mt-1 text-xs text-gray-400">{task.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t border-gray-800">
            <Button variant="ghost" size="sm" className="ml-auto text-gray-400 hover:text-white" asChild>
              <Link href="/dashboard/maintenance">
                View all maintenance
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">AI-Powered Fleet Analytics</CardTitle>
            <CardDescription className="text-gray-400">Performance optimization insights from our AI</CardDescription>
          </CardHeader>
          <CardContent className="h-[340px]">
            <PerformanceChart isFleetView={true} />
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Brain className="h-5 w-5 text-purple-500 mr-2" />
            AI Insights & Recommendations
          </CardTitle>
          <CardDescription className="text-gray-400">
            Machine learning powered suggestions to optimize your operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-purple-900/10 rounded-lg p-4 border border-purple-900/20">
              <div className="flex items-start mb-2">
                <div className="p-2 bg-purple-900/30 text-purple-400 rounded mr-2">
                  <Route className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Route Optimization</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Rerouting 5 shipments can save 230 miles and reduce fuel costs by $420 this week.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2 border-purple-800/30 text-purple-400 hover:bg-purple-900/20 hover:text-purple-300"
              >
                View Optimization Plan
              </Button>
            </div>

            <div className="bg-blue-900/10 rounded-lg p-4 border border-blue-900/20">
              <div className="flex items-start mb-2">
                <div className="p-2 bg-blue-900/30 text-blue-400 rounded mr-2">
                  <Timer className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Maintenance Prediction</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Schedule maintenance for 3 vehicles now to prevent potential breakdowns within 2 weeks.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2 border-blue-800/30 text-blue-400 hover:bg-blue-900/20 hover:text-blue-300"
              >
                Schedule Maintenance
              </Button>
            </div>

            <div className="bg-green-900/10 rounded-lg p-4 border border-green-900/20">
              <div className="flex items-start mb-2">
                <div className="p-2 bg-green-900/30 text-green-400 rounded mr-2">
                  <LineChart className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Demand Forecasting</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Prepare for 18% increased demand in the Miami-Atlanta corridor next week.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2 border-green-800/30 text-green-400 hover:bg-green-900/20 hover:text-green-300"
              >
                View Forecast Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
