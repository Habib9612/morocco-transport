import type React from "react"
import type { Metadata } from "next"
import DashboardSidebar from "@/components/dashboard-sidebar"
import DashboardHeader from "@/components/dashboard-header"

export const metadata: Metadata = {
  title: "Dashboard | MarocTransit",
  description: "AI-Powered Logistics Platform Dashboard",
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen bg-gray-950">
      <DashboardSidebar />
      <div className="lg:pl-[240px] transition-all duration-300">
        <DashboardHeader />
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      </div>
    </div>
  )
}
