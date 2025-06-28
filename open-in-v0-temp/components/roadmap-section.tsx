"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle, Clock, ArrowRight } from "lucide-react"

const roadmapItems = [
  {
    quarter: "Q2 2025",
    title: "Enhanced Mobile Experience",
    description: "Completely redesigned mobile app with offline capabilities and improved driver interface.",
    status: "completed",
    features: [
      "Offline mode for drivers in remote areas",
      "Voice-guided navigation integration",
      "Digital proof of delivery with signature capture",
      "Real-time chat between dispatchers and drivers",
    ],
  },
  {
    quarter: "Q3 2025",
    title: "Advanced Analytics & Reporting",
    description: "Powerful business intelligence tools to gain deeper insights into your logistics operations.",
    status: "in-progress",
    features: [
      "Customizable dashboard with drag-and-drop widgets",
      "Advanced filtering and data visualization",
      "Scheduled reports with automated delivery",
      "Performance benchmarking against industry standards",
    ],
  },
  {
    quarter: "Q4 2025",
    title: "AI-Powered Route Optimization",
    description: "Machine learning algorithms that continuously improve routing based on historical data.",
    status: "planned",
    features: [
      "Dynamic rerouting based on real-time traffic conditions",
      "Weather-aware routing to avoid hazardous conditions",
      "Predictive ETAs with machine learning",
      "Multi-vehicle optimization for complex delivery scenarios",
    ],
  },
  {
    quarter: "Q1 2026",
    title: "Sustainability Features",
    description: "Tools to help reduce your carbon footprint and optimize for eco-friendly operations.",
    status: "planned",
    features: [
      "Carbon footprint tracking and reporting",
      "Electric vehicle fleet management",
      "Eco-driving score for drivers",
      "Sustainable route planning to minimize emissions",
    ],
  },
  {
    quarter: "Q2 2026",
    title: "Integration Marketplace",
    description: "Expand platform capabilities with third-party integrations and custom extensions.",
    status: "planned",
    features: [
      "Open API for custom integrations",
      "Pre-built connectors for popular business systems",
      "Developer portal with documentation and SDKs",
      "Partner marketplace for specialized solutions",
    ],
  },
]

export default function RoadmapSection() {
  const [activeItem, setActiveItem] = useState(0)

  return (
    <div className="grid md:grid-cols-5 gap-8">
      <div className="md:col-span-2">
        <div className="space-y-4">
          {roadmapItems.map((item, index) => (
            <motion.div
              key={index}
              className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                activeItem === index
                  ? "border-indigo-500 bg-slate-800/50"
                  : "border-slate-700 bg-slate-800/20 hover:bg-slate-800/30"
              }`}
              onClick={() => setActiveItem(index)}
              whileHover={{ x: 5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium px-2 py-1 rounded bg-slate-700 text-slate-300">
                  {item.quarter}
                </span>
                <span
                  className={`flex items-center text-sm ${
                    item.status === "completed"
                      ? "text-green-400"
                      : item.status === "in-progress"
                        ? "text-amber-400"
                        : "text-slate-400"
                  }`}
                >
                  {item.status === "completed" ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1" /> Completed
                    </>
                  ) : item.status === "in-progress" ? (
                    <>
                      <Clock className="h-4 w-4 mr-1" /> In Progress
                    </>
                  ) : (
                    <>
                      <Clock className="h-4 w-4 mr-1" /> Planned
                    </>
                  )}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
              <p className="text-slate-300 text-sm">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="md:col-span-3">
        <motion.div
          key={activeItem}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 h-full"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-sm font-medium px-3 py-1 rounded-full bg-indigo-600/20 text-indigo-400 mb-2 inline-block">
                {roadmapItems[activeItem].quarter}
              </span>
              <h3 className="text-2xl font-bold text-white">{roadmapItems[activeItem].title}</h3>
            </div>
            <span
              className={`flex items-center text-sm px-3 py-1 rounded-full ${
                roadmapItems[activeItem].status === "completed"
                  ? "bg-green-600/20 text-green-400"
                  : roadmapItems[activeItem].status === "in-progress"
                    ? "bg-amber-600/20 text-amber-400"
                    : "bg-slate-600/20 text-slate-400"
              }`}
            >
              {roadmapItems[activeItem].status === "completed" ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-1" /> Completed
                </>
              ) : roadmapItems[activeItem].status === "in-progress" ? (
                <>
                  <Clock className="h-4 w-4 mr-1" /> In Progress
                </>
              ) : (
                <>
                  <Clock className="h-4 w-4 mr-1" /> Planned
                </>
              )}
            </span>
          </div>

          <p className="text-slate-300 mb-8">{roadmapItems[activeItem].description}</p>

          <h4 className="text-lg font-semibold text-white mb-4">Key Features:</h4>
          <div className="grid md:grid-cols-2 gap-4">
            {roadmapItems[activeItem].features.map((feature, index) => (
              <div key={index} className="flex items-start">
                <div className="mt-1 mr-3 flex-shrink-0 w-5 h-5 rounded-full bg-indigo-600/20 flex items-center justify-center">
                  <ArrowRight className="h-3 w-3 text-indigo-400" />
                </div>
                <span className="text-slate-300">{feature}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Development Timeline:</h4>
            <div className="relative h-4 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`absolute top-0 left-0 h-full rounded-full ${
                  roadmapItems[activeItem].status === "completed"
                    ? "bg-green-500 w-full"
                    : roadmapItems[activeItem].status === "in-progress"
                      ? "bg-amber-500 w-1/2"
                      : "bg-indigo-500 w-1/4"
                }`}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-slate-400">
              <span>Planning</span>
              <span>Development</span>
              <span>Testing</span>
              <span>Release</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
