"use client"

import { motion } from "framer-motion"

export default function ActivityTimeline() {
  const activities = [
    {
      type: "Order Created",
      description: "New order created",
      date: "May 5, 2024",
      time: "1:30 PM",
      isActive: true,
    },
    {
      type: "Order Dispatched",
      description: "Order has been dispatched",
      date: "May 5, 2024",
      time: "1:30 PM",
      isActive: true,
    },
  ]

  return (
    <div className="relative">
      {activities.map((activity, index) => (
        <div key={index} className="flex mb-8">
          <div className="mr-4 relative">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activity.isActive ? "bg-blue-600" : "bg-gray-700"
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
            {index < activities.length - 1 && (
              <div className="absolute top-8 bottom-0 left-1/2 w-0.5 -ml-px h-full bg-gray-700" />
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`p-4 rounded-lg ${activity.isActive ? "bg-[#1e293b]" : "bg-[#1a202c]"}`}
          >
            <h3 className="text-white font-medium mb-1">{activity.type}</h3>
            <p className="text-sm text-gray-400 mb-2">{activity.description}</p>
            <div className="flex items-center text-xs text-gray-500">
              <span>{activity.date}</span>
              <span className="mx-1">•</span>
              <span>{activity.time}</span>
            </div>
          </motion.div>
        </div>
      ))}

      <div className="w-full flex items-center justify-center">
        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#1e293b]"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="h-2 w-2 rounded-full bg-white"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
