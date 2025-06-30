"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Truck, MapPin, CheckCircle, Brain, Clock, ArrowRight } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"

export default function HeroSection() {
  const [originCity, setOriginCity] = useState("")
  const [destinationCity, setDestinationCity] = useState("")
  const [truckType, setTruckType] = useState("")
  const [searchStep, setSearchStep] = useState(1)

  const handleSearch = () => {
    if (searchStep === 1 && originCity && destinationCity) {
      setSearchStep(2)
    } else if (searchStep === 2 && truckType) {
      // In a real app, this would navigate to search results
      setSearchStep(3)
    }
  }

  return (
    <div className="relative overflow-hidden pt-12 pb-16 sm:pb-24 bg-[#0f172a]">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-5" />

      {/* Gradients */}
      <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-blue-600/20 via-blue-600/5 to-transparent" />
      <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
          <div className="lg:col-span-6 xl:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-900/50 text-blue-400 text-sm font-medium mb-6">
                <Brain className="h-4 w-4 mr-2 text-blue-400" />
                <span>AI-Powered Logistics Platform</span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                <span className="block xl:inline">Connect Shippers</span>{" "}
                <span className="block text-blue-500 xl:inline">with Carriers</span>{" "}
                <span className="block xl:inline">Instantly</span>
              </h1>

              <p className="mt-3 max-w-md mx-auto lg:mx-0 text-lg text-gray-400 sm:text-xl md:mt-5">
                Our AI-powered platform matches shippers with the perfect carriers based on location, vehicle type, and
                delivery requirements.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  I'm a Shipper
                </Button>
                <Button size="lg" variant="outline" className="text-white border-blue-600 hover:bg-blue-700/20">
                  I'm a Carrier
                </Button>
              </div>

              {/* Key benefits */}
              <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="flex flex-col items-center lg:items-start">
                  <div className="text-blue-500 text-2xl font-bold">30%</div>
                  <div className="text-gray-400 text-sm">Cost Reduction</div>
                </div>
                <div className="flex flex-col items-center lg:items-start">
                  <div className="text-blue-500 text-2xl font-bold">24%</div>
                  <div className="text-gray-400 text-sm">Fuel Savings</div>
                </div>
                <div className="flex flex-col items-center lg:items-start">
                  <div className="text-blue-500 text-2xl font-bold">45%</div>
                  <div className="text-gray-400 text-sm">Increased Efficiency</div>
                </div>
              </div>

              {/* Trust indicators */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <div className="flex items-center text-gray-400">
                  <CheckCircle className="h-5 w-5 text-blue-500 mr-2" />
                  <span>Predictive Maintenance</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <CheckCircle className="h-5 w-5 text-blue-500 mr-2" />
                  <span>Route Optimization</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <CheckCircle className="h-5 w-5 text-blue-500 mr-2" />
                  <span>Real-time Monitoring</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-12 lg:mt-0 lg:col-span-6 xl:col-span-7">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <Card className="bg-gray-900/70 backdrop-blur-sm border-gray-800" id="get-quote">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white flex items-center">
                    <Brain className="h-6 w-6 text-blue-500 mr-2" />
                    AI-Powered Carrier Matching
                  </CardTitle>
                </CardHeader>
                <CardContent>
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
                        <Select value={truckType} onValueChange={setTruckType}>
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

                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={handleSearch}
                        disabled={!truckType}
                      >
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
                            View all matches <ArrowRight className="h-4 w-4 ml-1" />
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

                  {searchStep !== 3 && (
                    <div className="mt-4">
                      <div className="relative p-4 bg-gray-800/70 rounded-lg border border-gray-700">
                        <div className="flex items-center mb-2">
                          <Badge className="bg-purple-600 text-white mr-2">AI</Badge>
                          <h3 className="text-sm font-medium text-white">How our matching works</h3>
                        </div>
                        <p className="text-xs text-gray-400 mb-3">
                          Our AI algorithm analyzes multiple factors to find your perfect carrier match:
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-start">
                            <CheckCircle className="h-3 w-3 text-green-500 mr-1 mt-0.5" />
                            <span className="text-gray-300">Location proximity</span>
                          </div>
                          <div className="flex items-start">
                            <CheckCircle className="h-3 w-3 text-green-500 mr-1 mt-0.5" />
                            <span className="text-gray-300">Vehicle compatibility</span>
                          </div>
                          <div className="flex items-start">
                            <CheckCircle className="h-3 w-3 text-green-500 mr-1 mt-0.5" />
                            <span className="text-gray-300">Performance history</span>
                          </div>
                          <div className="flex items-start">
                            <CheckCircle className="h-3 w-3 text-green-500 mr-1 mt-0.5" />
                            <span className="text-gray-300">Price optimization</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
