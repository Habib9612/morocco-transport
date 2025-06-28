"use client"

import { useState } from "react"
import { Package, Clock, AlertTriangle, CheckCircle, User, Settings, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

// Sample activity data
const activities = [
  {
    id: 1,
    type: "shipment_created",
    shipmentId: "SHP-3948",
    user: "John Doe",
    timestamp: "2 hours ago",
    details: "Created a new shipment from Casablanca to Marrakech",
  },
  {
    id: 2,
    type: "shipment_status",
    shipmentId: "SHP-3921",
    user: "System",
    timestamp: "3 hours ago",
    details: "Shipment status changed to In Transit",
  },
  {
    id: 3,
    type: "driver_assigned",
    shipmentId: "SHP-3921",
    user: "Sarah Johnson",
    timestamp: "3 hours ago",
    details: "Driver Michael Chen assigned to shipment",
  },
  {
    id: 4,
    type: "shipment_delayed",
    shipmentId: "SHP-3921",
    user: "System",
    timestamp: "4 hours ago",
    details: "Shipment delayed due to traffic conditions",
  },
  {
    id: 5,
    type: "document_uploaded",
    shipmentId: "SHP-3899",
    user: "Emily Rodriguez",
    timestamp: "5 hours ago",
    details: "Uploaded proof of delivery document",
  },
  {
    id: 6,
    type: "maintenance_scheduled",
    truckId: "TRK-1003",
    user: "David Wilson",
    timestamp: "6 hours ago",
    details: "Scheduled maintenance for truck TRK-1003",
  },
  {
    id: 7,
    type: "shipment_delivered",
    shipmentId: "SHP-3876",
    user: "System",
    timestamp: "8 hours ago",
    details: "Shipment successfully delivered to destination",
  },
  {
    id: 8,
    type: "settings_updated",
    user: "Admin",
    timestamp: "1 day ago",
    details: "Updated system notification settings",
  },
]

export default function RecentActivityFeed() {
  const [filter, setFilter] = useState<string>("all")

  const filteredActivities = activities.filter((activity) => {
    if (filter === "all") return true
    return activity.type.includes(filter)
  })

  const getActivityIcon = (type: string) => {
    switch (true) {
      case type.includes("shipment_created"):
        return <Package className="h-5 w-5 text-blue-500" />
      case type.includes("shipment_status"):
        return <Clock className="h-5 w-5 text-purple-500" />
      case type.includes("driver_assigned"):
        return <User className="h-5 w-5 text-green-500" />
      case type.includes("shipment_delayed"):
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case type.includes("document_uploaded"):
        return <FileText className="h-5 w-5 text-blue-500" />
      case type.includes("maintenance"):
        return <Settings className="h-5 w-5 text-slate-500" />
      case type.includes("shipment_delivered"):
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case type.includes("settings"):
        return <Settings className="h-5 w-5 text-slate-500" />
      default:
        return <Package className="h-5 w-5 text-blue-500" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {["all", "shipment", "driver", "maintenance", "document"].map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={cn(
              "whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium",
              filter === filterType
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700",
            )}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredActivities.map((activity) => (
          <div key={activity.id} className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
              {getActivityIcon(activity.type)}
            </div>
            <div>
              <p className="text-sm font-medium">{activity.details}</p>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>{activity.user}</span>
                <span>•</span>
                <span>{activity.timestamp}</span>
                {activity.shipmentId && (
                  <>
                    <span>•</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{activity.shipmentId}</span>
                  </>
                )}
                {activity.truckId && (
                  <>
                    <span>•</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{activity.truckId}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
