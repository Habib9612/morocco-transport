"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Edit, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import ActivityTimeline from "./activity-timeline"

interface OrderDetailsProps {
  orderId: string
  onClose: () => void
}

export default function OrderDetails({ orderId, onClose }: OrderDetailsProps) {
  const [activeTab, setActiveTab] = useState<"activity" | "details" | "rate">("activity")

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[#1e293b] flex items-center justify-between">
        <div className="flex items-center">
          <Badge className="bg-blue-600 text-white mr-2">Dispatched</Badge>
          <h2 className="text-white font-medium">{orderId}</h2>
        </div>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="text-xs text-gray-400 px-4 py-2">May 5, 2024 13:30</div>

      {/* Tabs */}
      <div className="px-4 border-b border-[#1e293b]">
        <div className="flex space-x-4">
          <button
            className={`py-2 text-sm font-medium relative ${
              activeTab === "activity" ? "text-white" : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("activity")}
          >
            Activity
            {activeTab === "activity" && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
          <button
            className={`py-2 text-sm font-medium relative ${
              activeTab === "details" ? "text-white" : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("details")}
          >
            Details
            {activeTab === "details" && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
          <button
            className={`py-2 text-sm font-medium relative ${
              activeTab === "rate" ? "text-white" : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("rate")}
          >
            Purchase Rate
            {activeTab === "rate" && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-auto">
        {activeTab === "activity" && (
          <div className="p-4">
            <ActivityTimeline />
          </div>
        )}

        {activeTab === "details" && (
          <div className="p-4">
            <div className="mb-6">
              <Badge className="bg-blue-600/20 text-blue-400 mb-4">Dispatched</Badge>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Customer</h3>
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback className="bg-blue-600 text-white text-xs">JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm text-white">John Doe</p>
                      <p className="text-xs text-gray-400">+6596379222</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Facilitator</h3>
                  <p className="text-sm text-white">No Facilitator</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Driver Assigned</h3>
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback className="bg-gray-600 text-white text-xs">ND</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm text-white">No Driver</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs border-[#2d3748] text-gray-300 hover:text-white hover:bg-[#2d3748]"
                    >
                      Assign Driver
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-4 bg-[#1e293b]" />

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Internal ID</h3>
                <p className="text-sm text-white">FLB-29394</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Tracking Number</h3>
                <p className="text-sm text-white">FLE3308311534SG</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Type</h3>
                <Badge className="bg-gray-700 text-white">Transport</Badge>
              </div>
            </div>

            <Separator className="my-4 bg-[#1e293b]" />

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Date Scheduled</h3>
                <p className="text-sm text-white">-</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Date Dispatched</h3>
                <p className="text-sm text-white">May 5, 2024 13:30</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Date Started</h3>
                <p className="text-sm text-white">-</p>
              </div>
            </div>

            <Separator className="my-4 bg-[#1e293b]" />

            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Proof of Delivery</h3>
              <p className="text-sm text-white">Photo</p>
            </div>
          </div>
        )}

        {activeTab === "rate" && (
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-400">BREAKDOWN</h3>
              <h3 className="text-sm font-medium text-gray-400">SGD</h3>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-white">Base Fee</p>
                <p className="text-sm text-white">S$18.00</p>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm text-white">Service Fee</p>
                <p className="text-sm text-white">S$10.00</p>
              </div>

              <Separator className="my-2 bg-[#1e293b]" />

              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-white">Total</p>
                <p className="text-sm font-medium text-white">S$28.00</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
