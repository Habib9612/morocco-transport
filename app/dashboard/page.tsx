"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Truck, Clock, TrendingUp, ArrowUpRight, ArrowDownRight, Plus, Brain, MapPin, User, Building2 } from 'lucide-react'
import { useAuth } from "@/lib/auth-context"

export default function DashboardPage() {
  const { user } = useAuth()
  const [userType, setUserType] = useState<"individual" | "carrier" | "company">("individual")

  useEffect(() => {
    if (user?.role) {
      setUserType(user.role as "individual" | "carrier" | "company")
    }
  }, [user])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            AI-Powered Logistics Dashboard
          </h1>
          <p className="text-slate-400">
            Welcome back, {user?.name || "User"}! Here's an overview of your logistics operations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {userType === "individual" && (
            <div className="flex items-center text-blue-400">
              <User className="h-4 w-4 mr-1" />
              <span className="text-sm">Individual Shipper</span>
            </div>
          )}
          {userType === "carrier" && (
            <div className="flex items-center text-green-400">
              <Truck className="h-4 w-4 mr-1" />
              <span className="text-sm">Carrier</span>
            </div>
          )}
          {userType === "company" && (
            <div className="flex items-center text-purple-400">
              <Building2 className="h-4 w-4 mr-1" />
              <span className="text-sm">Fleet Manager</span>
            </div>
          )}
        </div>
      </div>

      {/* Role-specific content */}
      {userType === "individual" ? (
        <IndividualDashboard />
      ) : userType === "carrier" ? (
        <CarrierDashboard />
      ) : (
        <CompanyDashboard />
      )}
    </div>
  )
}

// Individual Shipper Dashboard
function IndividualDashboard() {
  return (
    <>
      {/* AI Carrier Matching Card */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-white flex items-center">
            <Brain className="h-5 w-5 text-purple-500 mr-2" />
            AI Carrier Matching
          </CardTitle>
          <CardDescription className="text-gray-400">
            Let our AI find the perfect carrier for your shipment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="mr-2 h-4 w-4" />
              Create New Shipment
            </Button>
            <Button variant="outline" className="border-gray-700 text-gray-300 hover:text-white">
              View AI Recommendations
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Active Shipments
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">12</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+2</span> from last week
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              In Transit
            </CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">8</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-500">+1</span> from yesterday
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Delivered This Month
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">47</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+12%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Avg. Delivery Time
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">2.3d</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">-0.2d</span> improvement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Shipments */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Recent Shipments</CardTitle>
          <CardDescription className="text-gray-400">
            Your latest shipment activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-white font-medium">Shipment #{1000 + i}</p>
                    <p className="text-gray-400 text-sm">Casablanca cat > app/dashboard/page.tsx << 'EOF'
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Truck, Clock, TrendingUp, Plus, Brain, MapPin, User, Building2 } from 'lucide-react'
import { useAuth } from "@/lib/auth-context"

export default function DashboardPage() {
  const { user } = useAuth()
  const [userType, setUserType] = useState<"individual" | "carrier" | "company">("individual")

  useEffect(() => {
    if (user?.role) {
      setUserType(user.role as "individual" | "carrier" | "company")
    }
  }, [user])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            AI-Powered Logistics Dashboard
          </h1>
          <p className="text-slate-400">
            Welcome back, {user?.name || "User"}! Here is an overview of your logistics operations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {userType === "individual" && (
            <div className="flex items-center text-blue-400">
              <User className="h-4 w-4 mr-1" />
              <span className="text-sm">Individual Shipper</span>
            </div>
          )}
          {userType === "carrier" && (
            <div className="flex items-center text-green-400">
              <Truck className="h-4 w-4 mr-1" />
              <span className="text-sm">Carrier</span>
            </div>
          )}
          {userType === "company" && (
            <div className="flex items-center text-purple-400">
              <Building2 className="h-4 w-4 mr-1" />
              <span className="text-sm">Fleet Manager</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Active Shipments
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">12</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+2</span> from last week
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              In Transit
            </CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">8</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-500">+1</span> from yesterday
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Delivered This Month
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">47</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+12%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Avg. Delivery Time
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">2.3d</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">-0.2d</span> improvement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Tools Card */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-white flex items-center">
            <Brain className="h-5 w-5 text-purple-500 mr-2" />
            AI-Powered Features
          </CardTitle>
          <CardDescription className="text-gray-400">
            Let our AI optimize your logistics operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="mr-2 h-4 w-4" />
              Create New Shipment
            </Button>
            <Button variant="outline" className="border-gray-700 text-gray-300 hover:text-white">
              View AI Recommendations
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
