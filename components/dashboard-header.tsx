"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Search, Menu, X, ChevronDown, Settings, LogOut, UserIcon, Moon, Sun, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useTranslation } from "@/lib/translation-context"

export default function DashboardHeader() {
  const { user, logout } = useAuth()
  const { t } = useTranslation()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Get page title based on current path
  const getPageTitle = () => {
    const path = pathname?.split("/").pop() || "dashboard"

    const titles: Record<string, string> = {
      dashboard: "Dashboard",
      shipments: "Shipments",
      carriers: "Carriers",
      fleet: "Fleet Management",
      analytics: "Analytics",
      messages: "Messages",
      settings: "Settings",
      nearby: "Nearby Shipments",
      locations: "Locations",
    }

    return titles[path] || "Dashboard"
  }

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled ? "bg-gray-900/95 backdrop-blur-sm shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Page title and breadcrumb */}
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-white hidden sm:block">{getPageTitle()}</h1>

            {/* Breadcrumb on larger screens */}
            <div className="hidden md:flex items-center ml-4 text-sm text-gray-400">
              <Link href="/dashboard" className="hover:text-white transition-colors">
                Dashboard
              </Link>
              {pathname && pathname !== "/dashboard" && (
                <>
                  <span className="mx-2">/</span>
                  <span className="text-white">{getPageTitle()}</span>
                </>
              )}
            </div>
          </div>

          {/* Search and actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search..."
                className="w-[200px] lg:w-[300px] pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-blue-500"
              />
            </div>

            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white"
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-gray-400 hover:text-white">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                    3
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[300px] bg-gray-900 border-gray-800">
                <DropdownMenuLabel className="text-white">Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-800" />
                {[
                  { title: "New shipment request", time: "5 minutes ago", type: "shipment" },
                  { title: "Delivery delayed", time: "1 hour ago", type: "alert" },
                  { title: "Payment received", time: "3 hours ago", type: "payment" },
                ].map((notification, i) => (
                  <DropdownMenuItem key={i} className="py-2 cursor-pointer hover:bg-gray-800">
                    <div className="flex items-start gap-2">
                      <div
                        className={`p-1.5 rounded-full mt-0.5 ${
                          notification.type === "shipment"
                            ? "bg-blue-900/50 text-blue-400"
                            : notification.type === "alert"
                              ? "bg-amber-900/50 text-amber-400"
                              : "bg-green-900/50 text-green-400"
                        }`}
                      >
                        {notification.type === "shipment" ? (
                          <MessageSquare className="h-3.5 w-3.5" />
                        ) : notification.type === "alert" ? (
                          <Bell className="h-3.5 w-3.5" />
                        ) : (
                          <Badge className="h-3.5 w-3.5" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{notification.title}</p>
                        <p className="text-xs text-gray-400">{notification.time}</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className="bg-gray-800" />
                <div className="p-2 text-center">
                  <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 w-full">
                    View all notifications
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Messages */}
            <Button variant="ghost" size="icon" className="relative text-gray-400 hover:text-white" asChild>
              <Link href="/dashboard/messages">
                <MessageSquare className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-medium text-white">
                  2
                </span>
              </Link>
            </Button>

            {/* Language switcher */}
            <LanguageSwitcher variant="minimal" className="hidden md:flex" />

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative h-8 flex items-center gap-2 text-white">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user?.name} />
                    <AvatarFallback className="bg-blue-600">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline-flex text-sm font-medium">{user?.name || "User"}</span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-gray-800">
                <DropdownMenuLabel className="text-white">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer" asChild>
                  <Link href="/dashboard/profile" className="flex items-center">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer" asChild>
                  <Link href="/dashboard/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem
                  className="text-red-400 hover:bg-gray-800 hover:text-red-300 cursor-pointer"
                  onClick={logout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-gray-900 border-t border-gray-800">
          <div className="container mx-auto px-4 py-3">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search..."
                className="w-full pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-blue-500"
              />
            </div>
            <nav className="space-y-1">
              {[
                { name: "Dashboard", href: "/dashboard" },
                { name: "Shipments", href: "/dashboard/shipments" },
                { name: "Carriers", href: "/dashboard/carriers" },
                { name: "Fleet", href: "/dashboard/fleet" },
                { name: "Analytics", href: "/dashboard/analytics" },
                { name: "Messages", href: "/dashboard/messages" },
                { name: "Settings", href: "/dashboard/settings" },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    pathname === item.href
                      ? "bg-gray-800 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
