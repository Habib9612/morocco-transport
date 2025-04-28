"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Truck, Search, Plus, Minus, MapPin, Layers, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function RouteMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div ref={mapRef} className="w-full h-full bg-[#1a202c] relative overflow-hidden">
      {!isLoaded ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-2 text-sm text-gray-400">Loading map...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Map background */}
          <div className="absolute inset-0">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-24%20at%2000.18.30.png-AT4SrXE55z1ErNnQqlXclnEkcKXT5A.jpeg"
              alt="Map background"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Map controls */}
          <div className="absolute top-4 left-4 right-4 flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-full pl-10 pr-4 rounded-md bg-[#1e293b] border border-[#2d3748] text-gray-300 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 border-[#2d3748] bg-[#1e293b] text-gray-300 hover:bg-[#2d3748] hover:text-white"
            >
              <Layers className="h-4 w-4" />
            </Button>
          </div>

          <div className="absolute top-20 left-4 flex flex-col space-y-2">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 border-[#2d3748] bg-[#1e293b] text-gray-300 hover:bg-[#2d3748] hover:text-white"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 border-[#2d3748] bg-[#1e293b] text-gray-300 hover:bg-[#2d3748] hover:text-white"
            >
              <Minus className="h-4 w-4" />
            </Button>
          </div>

          {/* Order marker */}
          <div className="absolute left-1/2 bottom-1/3 transform -translate-x-1/2">
            <div className="relative">
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                1
              </div>
              <div className="bg-blue-600 text-white p-1 rounded-full">
                <MapPin className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Moving truck */}
          <motion.div
            className="absolute"
            initial={{ x: 100, y: 300 }}
            animate={{ x: 500, y: 400 }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            <div className="bg-blue-600 text-white p-1 rounded-full">
              <Truck className="h-5 w-5" />
            </div>
          </motion.div>

          {/* Zone overlays */}
          <div className="absolute inset-0">
            <svg width="100%" height="100%" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M200,150 C300,100 400,200 500,150 C600,100 700,200 600,300 C500,400 400,350 300,400 C200,450 100,400 200,150Z"
                fill="rgba(59, 130, 246, 0.1)"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            </svg>
          </div>

          {/* Order popup */}
          <div className="absolute top-1/4 left-1/4 bg-[#1e293b] border border-[#2d3748] rounded-md shadow-lg p-3 max-w-[250px]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Badge className="bg-blue-600 text-white text-xs">Dispatched</Badge>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-white">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-sm text-white font-medium mb-1">order_vloJEBq</div>
            <div className="text-xs text-gray-400 mb-2">May 5, 2024 13:30</div>
            <div className="flex items-center text-xs text-gray-300 mb-1">
              <MapPin className="h-3 w-3 mr-1 text-green-500" />
              <span>397 YISHUN AVENUE 6 #11-1124, SINGAPORE</span>
            </div>
            <div className="flex items-center text-xs text-gray-300">
              <MapPin className="h-3 w-3 mr-1 text-red-500" />
              <span>THE MANDARIN SHOPPING ARCADE #02-08 SINGAPORE</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
