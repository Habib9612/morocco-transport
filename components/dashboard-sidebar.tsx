"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  Truck,
  BarChart3,
  MessageSquare,
  Settings,
  Users,
  MapPin,
  ChevronRight,
  ChevronLeft,
  LogOut,
  HelpCircle,
  FileText,
  Brain,
  Zap,
  Boxes,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAuth } from "@/lib/auth-context"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  badge?: string | number
  badgeColor?: string
  submenu?: NavItem[]
}

export default function DashboardSidebar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  // Check if mobile on mount and on resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setIsCollapsed(true)
      }
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Navigation items
  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Shipments",
      href: "/dashboard/shipments",
      icon: <Package className="h-5 w-5" />,
      badge: 37,
      badgeColor: "bg-blue-600",
      submenu: [
        {
          title: "All Shipments",
          href: "/dashboard/shipments",
          icon: <Boxes className="h-4 w-4" />,
        },
        {
          title: "Create New",
          href: "/dashboard/shipments/new",
          icon: <Zap className="h-4 w-4" />,
        },
        {
          title: "AI Matching",
          href: "/dashboard/shipments/matching",
          icon: <Brain className="h-4 w-4" />,
        },
      ],
    },
    {
      title: "Carriers",
      href: "/dashboard/carriers",
      icon: <Truck className="h-5 w-5" />,
    },
    {
      title: "Fleet",
      href: "/dashboard/fleet",
      icon: <Truck className="h-5 w-5" />,
    },
    {
      title: "Locations",
      href: "/dashboard/locations",
      icon: <MapPin className="h-5 w-5" />,
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      title: "Messages",
      href: "/dashboard/messages",
      icon: <MessageSquare className="h-5 w-5" />,
      badge: 3,
      badgeColor: "bg-green-500",
    },
    {
      title: "Team",
      href: "/dashboard/team",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Documents",
      href: "/dashboard/documents",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  const toggleSubmenu = (title: string) => {
    if (openSubmenu === title) {
      setOpenSubmenu(null)
    } else {
      setOpenSubmenu(title)
    }
  }

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href
    }
    return pathname?.startsWith(href)
  }

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex flex-col border-r border-gray-800 bg-gray-900 transition-all duration-300",
        isCollapsed ? "w-[70px]" : "w-[240px]",
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-gray-800 px-4">
        <Link href="/" className="flex items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          {!isCollapsed && <span className="ml-2 font-bold text-white text-xl">MarocTransit</span>}
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <div key={item.title}>
              {item.submenu ? (
                <div className="mb-1">
                  <button
                    onClick={() => toggleSubmenu(item.title)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive(item.href)
                        ? "bg-gray-800 text-white"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white",
                    )}
                  >
                    <div className="flex items-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className={cn("flex items-center", !isCollapsed && "mr-3")}>{item.icon}</span>
                          </TooltipTrigger>
                          {isCollapsed && <TooltipContent side="right">{item.title}</TooltipContent>}
                        </Tooltip>
                      </TooltipProvider>

                      {!isCollapsed && <span className="truncate">{item.title}</span>}
                    </div>

                    {!isCollapsed && (
                      <div className="flex items-center">
                        {item.badge && (
                          <span
                            className={`mr-2 flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium text-white ${item.badgeColor || "bg-gray-600"}`}
                          >
                            {item.badge}
                          </span>
                        )}
                        <ChevronRight
                          className={cn("h-4 w-4 transition-transform", openSubmenu === item.title && "rotate-90")}
                        />
                      </div>
                    )}
                  </button>

                  {/* Submenu */}
                  {(openSubmenu === item.title || isActive(item.href)) && !isCollapsed && (
                    <div className="mt-1 ml-4 space-y-1 border-l border-gray-800 pl-3">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.title}
                          href={subitem.href}
                          className={cn(
                            "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                            isActive(subitem.href)
                              ? "bg-gray-800 text-white"
                              : "text-gray-400 hover:bg-gray-800 hover:text-white",
                          )}
                        >
                          <span className="mr-3">{subitem.icon}</span>
                          <span className="truncate">{subitem.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive(item.href) ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white",
                  )}
                >
                  <div className="flex items-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className={cn("flex items-center", !isCollapsed && "mr-3")}>{item.icon}</span>
                        </TooltipTrigger>
                        {isCollapsed && <TooltipContent side="right">{item.title}</TooltipContent>}
                      </Tooltip>
                    </TooltipProvider>

                    {!isCollapsed && <span className="truncate">{item.title}</span>}
                  </div>

                  {!isCollapsed && item.badge && (
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium text-white ${item.badgeColor || "bg-gray-600"}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="mt-auto border-t border-gray-800 p-4">
        {!isCollapsed && (
          <div className="mb-4 rounded-md bg-gray-800 p-3">
            <div className="flex items-center">
              <HelpCircle className="h-5 w-5 text-blue-400" />
              <span className="ml-2 text-sm font-medium text-white">Need Help?</span>
            </div>
            <p className="mt-1 text-xs text-gray-400">
              Contact our support team for assistance with your logistics operations.
            </p>
            <Button size="sm" className="mt-2 w-full bg-blue-600 hover:bg-blue-700">
              Contact Support
            </Button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-400 hover:text-white"
          >
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={logout} className="text-gray-400 hover:text-white">
                  <LogOut className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Log out</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  )
}
