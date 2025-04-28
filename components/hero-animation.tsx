"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { Truck, Package, BarChart3, MapPin } from "lucide-react"

export default function HeroAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden rounded-lg border bg-slate-900/50 backdrop-blur-sm"
    >
      {/* Map background */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Animated routes */}
      <svg className="absolute inset-0 w-full h-full">
        <path
          d="M 100,300 C 200,200 300,400 500,250 C 700,100 800,350 900,200"
          fill="none"
          stroke="#4f46e5"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="5,10"
          strokeDashoffset="0"
          className="animate-dash"
        />
        <path
          d="M 150,150 C 250,250 350,100 450,300 C 550,400 650,200 850,350"
          fill="none"
          stroke="#06b6d4"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="5,10"
          strokeDashoffset="0"
          className="animate-dash"
        />
      </svg>

      {/* Animated elements */}
      <motion.div
        className="absolute top-1/4 left-1/4 bg-indigo-600 text-white p-3 rounded-lg shadow-lg"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.5,
          delay: 0.2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          repeatDelay: 5,
        }}
      >
        <Truck className="h-8 w-8" />
      </motion.div>

      <motion.div
        className="absolute top-2/3 left-1/3 bg-cyan-500 text-white p-3 rounded-lg shadow-lg"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.5,
          delay: 0.4,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          repeatDelay: 5,
        }}
      >
        <Package className="h-8 w-8" />
      </motion.div>

      <motion.div
        className="absolute top-1/3 right-1/4 bg-purple-500 text-white p-3 rounded-lg shadow-lg"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.5,
          delay: 0.6,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          repeatDelay: 5,
        }}
      >
        <BarChart3 className="h-8 w-8" />
      </motion.div>

      <motion.div
        className="absolute bottom-1/4 right-1/3 bg-blue-500 text-white p-3 rounded-lg shadow-lg"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.5,
          delay: 0.8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          repeatDelay: 5,
        }}
      >
        <MapPin className="h-8 w-8" />
      </motion.div>

      {/* Moving truck animation */}
      <motion.div
        className="absolute"
        initial={{ x: -50, y: 200 }}
        animate={{ x: 800, y: 300 }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
        }}
      >
        <div className="bg-indigo-600 text-white p-2 rounded-full shadow-lg">
          <Truck className="h-6 w-6" />
        </div>
      </motion.div>

      <motion.div
        className="absolute"
        initial={{ x: 850, y: 150 }}
        animate={{ x: 50, y: 400 }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
        }}
      >
        <div className="bg-cyan-500 text-white p-2 rounded-full shadow-lg">
          <Truck className="h-6 w-6" />
        </div>
      </motion.div>

      {/* Pulse effects at key locations */}
      {[
        { top: "20%", left: "15%", delay: 0, color: "bg-indigo-500" },
        { top: "70%", left: "25%", delay: 2, color: "bg-cyan-500" },
        { top: "30%", left: "60%", delay: 4, color: "bg-purple-500" },
        { top: "60%", left: "75%", delay: 6, color: "bg-blue-500" },
        { top: "40%", left: "85%", delay: 8, color: "bg-indigo-500" },
      ].map((pos, index) => (
        <motion.div
          key={index}
          className={`absolute w-4 h-4 rounded-full ${pos.color}`}
          style={{ top: pos.top, left: pos.left }}
          initial={{ opacity: 0.7, scale: 0.5 }}
          animate={{ opacity: 0, scale: 2 }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: pos.delay,
          }}
        />
      ))}
    </div>
  )
}
