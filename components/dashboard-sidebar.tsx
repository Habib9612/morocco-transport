"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Package, Truck, MapPin, Brain, Users, FileText, Settings, MessageSquare, BarChart } from 'lucide-react'
import { useAuth } from "@/lib/auth-context"

export default function DashboardSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const sidebarItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      roles: ["individual", "carrier", "company"]
    },
    {
      href: "/dashboard/shipments",
      label: "Shipments",
      icon: Package,
      roles: ["individual", "company"]
    },
    {
      href: "/dashboard/nearby",
      label: "Nearby Loads",
      icon: MapPin,
      roles: ["carrier"]
    },
    {
      href: "/dashboard/fleet",
      label: "Fleet",
      icon: Truck,
      roles: ["company"]
    },
    {
      href: "/dashboard/ai-tools",
      label: "AI Tools",
      icon: Brain,
      roles: ["individual", "carrier", "company"]
    },
    {
      href: "/dashboard/team",
      label: "Team",
      icon: Users,
      roles: ["company"]
    },
    {
      href: "/dashboard/documents",
      label: "Documents",
      icon: FileText,
      roles: ["individual", "carrier", "company"]
    },
    {
      href: "/dashboard/messages",
      label: "Messages",
      icon: MessageSquare,
      roles: ["individual", "carrier", "company"]
    },
    {
      href: "/dashboard/analytics",
      label: "Analytics",
      icon: BarChart,
      roles: ["individual", "carrier", "company"]
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: Settings,
      roles: ["individual", "carrier", "company"]
    }
  ]

  const filteredItems = sidebarItems.filter(item => 
    item.roles.includes(user?.role || "individual")
  )

  return (
    <div className="fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-gray-800 bg-gray-950">
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-3 py-2">
          <Link href="/" className="flex items-center mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="ml-2 font-bold text-white text-xl">MarocTransit</span>
          </Link>
        </div>
        
        <nav className="flex flex-col space-y-1 px-3">
          {filteredItems.map((item) => (
            <Button
              key={item.href}
              asChild
              variant={pathname === item.href ? "secondary" : "ghost"}
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </div>
  )
}
