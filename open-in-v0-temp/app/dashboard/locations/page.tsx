"use client"

import { useState, useEffect } from "react"
import { MapPin, Plus, Edit, Trash2, Check, X, Clock, Package, Truck } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

interface Location {
  id: string
  name: string
  address: string
  city: string
  country: string
  type: "pickup" | "delivery" | "both"
  isActive: boolean
  createdAt: Date
  lastUsed?: Date
}

export default function LocationsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [locations, setLocations] = useState<Location[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingLocation, setIsAddingLocation] = useState(false)
  const [editingLocationId, setEditingLocationId] = useState<string | null>(null)
  const [filter, setFilter] = useState<"all" | "pickup" | "delivery">("all")
  const [newLocation, setNewLocation] = useState<Partial<Location>>({
    name: "",
    address: "",
    city: "",
    country: "Morocco",
    type: "both",
  })

  // Redirect if not a shipper
  useEffect(() => {
    if (user && user.role === "carrier") {
      router.push("/dashboard")
    }
  }, [user, router])

  // Load mock data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockLocations: Location[] = [
        {
          id: "loc1",
          name: "Main Warehouse",
          address: "123 Industrial Zone",
          city: "Casablanca",
          country: "Morocco",
          type: "both",
          isActive: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
          lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        },
        {
          id: "loc2",
          name: "Downtown Office",
          address: "45 Hassan II Avenue",
          city: "Rabat",
          country: "Morocco",
          type: "pickup",
          isActive: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60), // 60 days ago
          lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
        },
        {
          id: "loc3",
          name: "Distribution Center",
          address: "78 Port Area",
          city: "Tangier",
          country: "Morocco",
          type: "delivery",
          isActive: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15), // 15 days ago
          lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
        },
        {
          id: "loc4",
          name: "Old Storage Facility",
          address: "12 Industrial Park",
          city: "Marrakech",
          country: "Morocco",
          type: "both",
          isActive: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120), // 120 days ago
        },
      ]

      setLocations(mockLocations)
      setIsLoading(false)
    }, 1500)
  }, [])

  const handleAddLocation = () => {
    if (!newLocation.name || !newLocation.address || !newLocation.city) {
      return
    }

    const location: Location = {
      id: `loc${Date.now()}`,
      name: newLocation.name,
      address: newLocation.address,
      city: newLocation.city,
      country: newLocation.country || "Morocco",
      type: newLocation.type as "pickup" | "delivery" | "both",
      isActive: true,
      createdAt: new Date(),
    }

    setLocations([location, ...locations])
    setNewLocation({
      name: "",
      address: "",
      city: "",
      country: "Morocco",
      type: "both",
    })
    setIsAddingLocation(false)
  }

  const handleUpdateLocation = (id: string) => {
    if (!newLocation.name || !newLocation.address || !newLocation.city) {
      return
    }

    setLocations(
      locations.map((loc) =>
        loc.id === id
          ? {
              ...loc,
              name: newLocation.name,
              address: newLocation.address,
              city: newLocation.city,
              country: newLocation.country || loc.country,
              type: newLocation.type as "pickup" | "delivery" | "both",
            }
          : loc,
      ),
    )
    setNewLocation({
      name: "",
      address: "",
      city: "",
      country: "Morocco",
      type: "both",
    })
    setEditingLocationId(null)
  }

  const handleEditLocation = (location: Location) => {
    setNewLocation({
      name: location.name,
      address: location.address,
      city: location.city,
      country: location.country,
      type: location.type,
    })
    setEditingLocationId(location.id)
  }

  const handleDeleteLocation = (id: string) => {
    setLocations(locations.filter((loc) => loc.id !== id))
  }

  const handleToggleLocationStatus = (id: string) => {
    setLocations(
      locations.map((loc) =>
        loc.id === id
          ? {
              ...loc,
              isActive: !loc.isActive,
            }
          : loc,
      ),
    )
  }

  const filteredLocations = locations.filter((loc) => {
    if (filter === "all") return true
    if (filter === "pickup") return loc.type === "pickup" || loc.type === "both"
    if (filter === "delivery") return loc.type === "delivery" || loc.type === "both"
    return true
  })

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-white">Loading locations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">My Locations</h1>
          <p className="text-slate-400">Manage your pickup and delivery locations</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsAddingLocation(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Location
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-2/3">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Saved Locations</CardTitle>
                <Tabs defaultValue="all" onValueChange={(v) => setFilter(v as any)}>
                  <TabsList className="grid w-[300px] grid-cols-3 bg-gray-800">
                    <TabsTrigger value="all" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                      All
                    </TabsTrigger>
                    <TabsTrigger
                      value="pickup"
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      Pickup
                    </TabsTrigger>
                    <TabsTrigger
                      value="delivery"
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      Delivery
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <CardDescription className="text-gray-400">
                Your saved locations for shipment pickup and delivery
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredLocations.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 mx-auto text-gray-700 mb-4" />
                  <h3 className="text-lg font-medium text-gray-400 mb-2">No locations found</h3>
                  <p className="text-gray-500 mb-4">Add your first location to get started</p>
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsAddingLocation(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Location
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredLocations.map((location) => (
                    <Card key={location.id} className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        {editingLocationId === location.id ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Location Name</label>
                                <Input
                                  value={newLocation.name}
                                  onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                                  className="bg-gray-700 border-gray-600 text-white"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Location Type</label>
                                <select
                                  value={newLocation.type}
                                  onChange={(e) =>
                                    setNewLocation({
                                      ...newLocation,
                                      type: e.target.value as "pickup" | "delivery" | "both",
                                    })
                                  }
                                  className="w-full h-10 rounded-md border border-gray-600 bg-gray-700 text-white px-3"
                                >
                                  <option value="pickup">Pickup Only</option>
                                  <option value="delivery">Delivery Only</option>
                                  <option value="both">Both Pickup & Delivery</option>
                                </select>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-300">Address</label>
                              <Input
                                value={newLocation.address}
                                onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })}
                                className="bg-gray-700 border-gray-600 text-white"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">City</label>
                                <Input
                                  value={newLocation.city}
                                  onChange={(e) => setNewLocation({ ...newLocation, city: e.target.value })}
                                  className="bg-gray-700 border-gray-600 text-white"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Country</label>
                                <Input
                                  value={newLocation.country}
                                  onChange={(e) => setNewLocation({ ...newLocation, country: e.target.value })}
                                  className="bg-gray-700 border-gray-600 text-white"
                                />
                              </div>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                onClick={() => {
                                  setEditingLocationId(null)
                                  setNewLocation({
                                    name: "",
                                    address: "",
                                    city: "",
                                    country: "Morocco",
                                    type: "both",
                                  })
                                }}
                              >
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                              </Button>
                              <Button
                                className="bg-blue-600 hover:bg-blue-700"
                                onClick={() => handleUpdateLocation(location.id)}
                              >
                                <Check className="h-4 w-4 mr-2" />
                                Save Changes
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-medium text-white flex items-center">
                                  {location.name}
                                  {!location.isActive && (
                                    <Badge variant="outline" className="ml-2 text-gray-400 border-gray-600">
                                      Inactive
                                    </Badge>
                                  )}
                                </h3>
                                <p className="text-gray-400 mt-1">
                                  {location.address}, {location.city}, {location.country}
                                </p>
                              </div>
                              <div>
                                <Badge
                                  className={
                                    location.type === "pickup"
                                      ? "bg-green-600"
                                      : location.type === "delivery"
                                        ? "bg-blue-600"
                                        : "bg-purple-600"
                                  }
                                >
                                  {location.type === "pickup"
                                    ? "Pickup Only"
                                    : location.type === "delivery"
                                      ? "Delivery Only"
                                      : "Pickup & Delivery"}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center text-xs text-gray-500 mt-2">
                              <Clock className="h-3 w-3 mr-1" />
                              Added {location.createdAt.toLocaleDateString()}
                              {location.lastUsed && (
                                <span className="ml-3">Last used {location.lastUsed.toLocaleDateString()}</span>
                              )}
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-gray-700 text-gray-300 hover:bg-gray-700"
                                onClick={() => handleToggleLocationStatus(location.id)}
                              >
                                {location.isActive ? "Deactivate" : "Activate"}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-gray-700 text-gray-300 hover:bg-gray-700"
                                onClick={() => handleEditLocation(location)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-gray-700 text-red-400 hover:bg-gray-700 hover:text-red-300"
                                onClick={() => handleDeleteLocation(location.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:w-1/3">
          {isAddingLocation ? (
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Add New Location</CardTitle>
                <CardDescription className="text-gray-400">
                  Enter the details of your new pickup or delivery location
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Location Name</label>
                  <Input
                    placeholder="e.g. Main Warehouse"
                    value={newLocation.name}
                    onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Location Type</label>
                  <select
                    value={newLocation.type}
                    onChange={(e) =>
                      setNewLocation({ ...newLocation, type: e.target.value as "pickup" | "delivery" | "both" })
                    }
                    className="w-full h-10 rounded-md border border-gray-700 bg-gray-800 text-white px-3"
                  >
                    <option value="pickup">Pickup Only</option>
                    <option value="delivery">Delivery Only</option>
                    <option value="both">Both Pickup & Delivery</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Address</label>
                  <Input
                    placeholder="Street address"
                    value={newLocation.address}
                    onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">City</label>
                    <Input
                      placeholder="City"
                      value={newLocation.city}
                      onChange={(e) => setNewLocation({ ...newLocation, city: e.target.value })}
                      className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Country</label>
                    <Input
                      placeholder="Country"
                      value={newLocation.country}
                      onChange={(e) => setNewLocation({ ...newLocation, country: e.target.value })}
                      className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  onClick={() => {
                    setIsAddingLocation(false)
                    setNewLocation({
                      name: "",
                      address: "",
                      city: "",
                      country: "Morocco",
                      type: "both",
                    })
                  }}
                >
                  Cancel
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddLocation}>
                  Add Location
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Location Statistics</CardTitle>
                <CardDescription className="text-gray-400">Overview of your location usage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-white">Total Locations</h3>
                      <MapPin className="h-4 w-4 text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold text-white">{locations.length}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {locations.filter((l) => l.isActive).length} active, {locations.filter((l) => !l.isActive).length}{" "}
                      inactive
                    </p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-white">Location Types</h3>
                      <Package className="h-4 w-4 text-green-500" />
                    </div>
                    <p className="text-2xl font-bold text-white">{locations.filter((l) => l.type === "both").length}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {locations.filter((l) => l.type === "pickup" || l.type === "both").length} pickup,{" "}
                      {locations.filter((l) => l.type === "delivery" || l.type === "both").length} delivery
                    </p>
                  </div>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-white">Recent Activity</h3>
                    <Clock className="h-4 w-4 text-amber-500" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Last location added:</span>
                      <span className="text-white">
                        {locations.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0]?.name || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Last location used:</span>
                      <span className="text-white">
                        {locations
                          .filter((l) => l.lastUsed)
                          .sort((a, b) => (b.lastUsed?.getTime() || 0) - (a.lastUsed?.getTime() || 0))[0]?.name ||
                          "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-white">Cities Coverage</h3>
                    <Truck className="h-4 w-4 text-purple-500" />
                  </div>
                  <div className="space-y-2">
                    {Array.from(new Set(locations.map((l) => l.city))).map((city) => (
                      <div key={city} className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">{city}:</span>
                        <span className="text-white">{locations.filter((l) => l.city === city).length} locations</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => setIsAddingLocation(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Location
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
