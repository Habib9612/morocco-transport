"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ArrowRight, Truck, Package, MapPin } from 'lucide-react'
import { motion } from "framer-motion"

export default function HeroSection() {
  const [searchData, setSearchData] = useState({
    from: "",
    to: "",
    cargoType: ""
  })

  return (
    <section className="relative min-h-screen flex items-center justify-center logistics-gradient overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              AI-Powered
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                {" "}Logistics
              </span>
              <br />
              for Morocco
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl">
              Connect shippers and carriers with intelligent matching, 
              real-time tracking, and optimized routes across Morocco and beyond.
            </p>

            {/* Search Form */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="From (City)"
                    value={searchData.from}
                    onChange={(e) => setSearchData({...searchData, from: e.target.value})}
                    className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                  />
                </div>
                
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="To (City)"
                    value={searchData.to}
                    onChange={(e) => setSearchData({...searchData, to: e.target.value})}
                    className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                  />
                </div>
                
                <Select value={searchData.cargoType} onValueChange={(value) => setSearchData({...searchData, cargoType: value})}>
                  <SelectTrigger className="bg-white/20 border-white/30 text-white">
                    <SelectValue placeholder="Cargo Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Cargo</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="textiles">Textiles</SelectItem>
                    <SelectItem value="food">Food & Beverages</SelectItem>
                    <SelectItem value="automotive">Automotive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Search className="mr-2 h-5 w-5" />
                Find Carriers
              </Button>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Watch Demo
              </Button>
            </div>
          </motion.div>

          {/* Right Content - 3D Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative h-96 bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-2xl overflow-hidden">
              {/* Animated Truck */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ 
                    x: [0, 100, 0],
                    y: [0, -20, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-blue-400"
                >
                  <Truck className="h-16 w-16" />
                </motion.div>
              </div>
              
              {/* Route Lines */}
              <svg className="absolute inset-0 w-full h-full">
                <motion.path
                  d="M50,200 Q200,100 350,200"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
