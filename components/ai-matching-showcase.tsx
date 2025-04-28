"use client"

import { useState, useEffect } from "react"
import { Brain, Truck, MapPin, CheckCircle, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import TruckModel from "@/components/truck-model"

export default function AIMatchingShowcase() {
  const [step, setStep] = useState(1)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (step < 4) {
        setIsAnimating(true)
        setTimeout(() => {
          setStep((prev) => prev + 1)
          setIsAnimating(false)
        }, 1500)
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [step])

  return (
    <section className="py-16 sm:py-24 bg-gray-950 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-5" />
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="mb-4 bg-purple-900/50 text-purple-400 border-purple-800/50 px-3 py-1">
            <Brain className="h-4 w-4 mr-2" />
            AI-Powered Technology
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Intelligent Carrier Matching</h2>
          <p className="mt-4 text-xl text-gray-400">
            Our sophisticated algorithm connects shippers with the perfect carriers based on multiple factors
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 items-center">
          <div className="order-2 lg:order-1">
            <div className="space-y-6">
              <Card
                className={`bg-gray-900/70 backdrop-blur-sm border-gray-800 transition-all duration-300 ${step === 1 ? "ring-2 ring-blue-500" : ""}`}
              >
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="h-10 w-10 rounded-full bg-blue-900/50 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Step 1: Shipment Details</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-3">
                    Enter your shipment details including origin, destination, cargo type, and delivery timeline.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                      <span>Location data</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                      <span>Cargo specifications</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                      <span>Timeline requirements</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                      <span>Special handling needs</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`bg-gray-900/70 backdrop-blur-sm border-gray-800 transition-all duration-300 ${step === 2 ? "ring-2 ring-purple-500" : ""}`}
              >
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="h-10 w-10 rounded-full bg-purple-900/50 flex items-center justify-center">
                    <Brain className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Step 2: AI Analysis</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-3">
                    Our AI algorithm processes your requirements and analyzes our carrier network to find optimal
                    matches.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-purple-500 mr-2" />
                      <span>Carrier proximity</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-purple-500 mr-2" />
                      <span>Vehicle compatibility</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-purple-500 mr-2" />
                      <span>Performance history</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-purple-500 mr-2" />
                      <span>Price optimization</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`bg-gray-900/70 backdrop-blur-sm border-gray-800 transition-all duration-300 ${step === 3 ? "ring-2 ring-green-500" : ""}`}
              >
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="h-10 w-10 rounded-full bg-green-900/50 flex items-center justify-center">
                    <Truck className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Step 3: Carrier Matching</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-3">
                    Review AI-suggested carriers ranked by compatibility score, with transparent pricing and ETA.
                  </p>
                  <div className="space-y-2">
                    {[
                      { name: "TransitExpress", rating: 4.9, match: 98 },
                      { name: "FastTruck Inc.", rating: 4.7, match: 95 },
                      { name: "SpeedLogistics", rating: 4.8, match: 92 },
                    ].map((carrier, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2 bg-gray-800/50 rounded border border-gray-700"
                      >
                        <div className="flex items-center">
                          <Truck className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-white text-sm">{carrier.name}</span>
                        </div>
                        <Badge className="bg-purple-600 text-white">{carrier.match}% Match</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`bg-gray-900/70 backdrop-blur-sm border-gray-800 transition-all duration-300 ${step === 4 ? "ring-2 ring-amber-500" : ""}`}
              >
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="h-10 w-10 rounded-full bg-amber-900/50 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Step 4: Booking & Tracking</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-3">
                    Book your preferred carrier and track your shipment in real-time from pickup to delivery.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-amber-500 mr-2" />
                      <span>Instant booking</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-amber-500 mr-2" />
                      <span>Real-time tracking</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-amber-500 mr-2" />
                      <span>Secure payment</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-amber-500 mr-2" />
                      <span>Digital documentation</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
              <div className="h-[500px]">
                <TruckModel mode="matching" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
            Try AI Matching Now
          </Button>
        </div>
      </div>
    </section>
  )
}
