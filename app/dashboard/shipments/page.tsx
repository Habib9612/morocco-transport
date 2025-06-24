"use client"

import {
  CheckCircle2,
  Truck,
  Clock,
  AlertTriangle,
  Eye,
  FileEdit,
  Trash2,
  Brain,
  Plus,
  Download,
  Filter,
  ArrowUpDown,
} from "lucide-react"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Row, Column } from '@tanstack/react-table';

type ShipmentStatus = "delivered" | "in_transit" | "pending" | "delayed"

interface Shipment {
  id: string
  trackingNumber: string
  origin: string
  destination: string
  customer: string
  status: ShipmentStatus
  departureDate: string
  arrivalDate: string
  priority: "high" | "medium" | "low"
  aiOptimized: boolean
  aiSavings?: number
}

export default function ShipmentsPage() {
  const shipments: Shipment[] = [
    {
      id: "order_vloJEBq",
      trackingNumber: "SHP-2023-1234",
      origin: "Chicago, IL",
      destination: "New York, NY",
      customer: "Acme Corp",
      status: "in_transit",
      departureDate: "2025-03-20",
      arrivalDate: "2025-03-23",
      priority: "high",
      aiOptimized: true,
      aiSavings: 350,
    },
    {
      id: "order_a7bCdE",
      trackingNumber: "SHP-2023-1235",
      origin: "Los Angeles, CA",
      destination: "Seattle, WA",
      customer: "TechGiant Inc",
      status: "delivered",
      departureDate: "2025-03-18",
      arrivalDate: "2025-03-21",
      priority: "medium",
      aiOptimized: true,
      aiSavings: 420,
    },
    {
      id: "order_f8gHiJ",
      trackingNumber: "SHP-2023-1236",
      origin: "Miami, FL",
      destination: "Atlanta, GA",
      customer: "Southern Distributors",
      status: "delayed",
      departureDate: "2025-03-19",
      arrivalDate: "2025-03-22",
      priority: "high",
      aiOptimized: false,
    },
    {
      id: "order_k9lMnO",
      trackingNumber: "SHP-2023-1237",
      origin: "Dallas, TX",
      destination: "Phoenix, AZ",
      customer: "Desert Supplies Co",
      status: "pending",
      departureDate: "2025-03-22",
      arrivalDate: "2025-03-25",
      priority: "low",
      aiOptimized: true,
      aiSavings: 280,
    },
    {
      id: "order_p0qRsT",
      trackingNumber: "SHP-2023-1238",
      origin: "Boston, MA",
      destination: "Washington, DC",
      customer: "East Coast Traders",
      status: "in_transit",
      departureDate: "2025-03-21",
      arrivalDate: "2025-03-23",
      priority: "medium",
      aiOptimized: true,
      aiSavings: 175,
    },
  ]

  const getStatusIcon = (status: ShipmentStatus) => {
    switch (status) {
      case "delivered":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "in_transit":
        return <Truck className="h-4 w-4 text-blue-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "delayed":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusBadge = (status: ShipmentStatus) => {
    switch (status) {
      case "delivered":
        return (
          <Badge variant="outline" className="bg-green-950/30 text-green-500 border-green-800/30">
            Delivered
          </Badge>
        )
      case "in_transit":
        return (
          <Badge variant="outline" className="bg-blue-950/30 text-blue-500 border-blue-800/30">
            In Transit
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-amber-950/30 text-amber-500 border-amber-800/30">
            Pending
          </Badge>
        )
      case "delayed":
        return (
          <Badge variant="outline" className="bg-red-950/30 text-red-500 border-red-800/30">
            Delayed
          </Badge>
        )
    }
  }

  const getPriorityBadge = (priority: "high" | "medium" | "low") => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="outline" className="bg-red-950/30 text-red-500 border-red-800/30">
            High
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="bg-amber-950/30 text-amber-500 border-amber-800/30">
            Medium
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="bg-green-950/30 text-green-500 border-green-800/30">
            Low
          </Badge>
        )
    }
  }

  const columns = [
    {
      accessorKey: "trackingNumber",
      header: ({ column }: { column: Column<Shipment, unknown> }) => (
        <div className="flex items-center">
          Tracking #
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }: { row: Row<Shipment> }) => <div className="font-medium text-white">{row.getValue("trackingNumber")}</div>,
    },
    {
      accessorKey: "route",
      header: "Route",
      cell: ({ row }: { row: Row<Shipment> }) => {
        const shipment = row.original as Shipment
        return (
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">From: {shipment.origin}</span>
            <span className="text-xs text-gray-400">To: {shipment.destination}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "customer",
      header: ({ column }: { column: Column<Shipment, unknown> }) => (
        <div className="flex items-center">
          Customer
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }: { row: Row<Shipment> }) => <div>{row.getValue("customer")}</div>,
    },
    {
      accessorKey: "status",
      header: ({ column }: { column: Column<Shipment, unknown> }) => (
        <div className="flex items-center">
          Status
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }: { row: Row<Shipment> }) => {
        const status = row.getValue("status") as ShipmentStatus
        return (
          <div className="flex items-center gap-2">
            {getStatusIcon(status)}
            {getStatusBadge(status)}
          </div>
        )
      },
      filterFn: (row: Row<Shipment>, columnId: string, filterValue: unknown) => {
        if (Array.isArray(filterValue) && filterValue.every(v => typeof v === 'string')) {
          return filterValue.includes(row.getValue(columnId));
        }
        return false;
      },
    },
    {
      accessorKey: "departureDate",
      header: ({ column }: { column: Column<Shipment, unknown> }) => (
        <div className="flex items-center">
          Departure
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }: { row: Row<Shipment> }) => <div>{row.getValue("departureDate")}</div>,
    },
    {
      accessorKey: "arrivalDate",
      header: ({ column }: { column: Column<Shipment, unknown> }) => (
        <div className="flex items-center">
          Arrival
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }: { row: Row<Shipment> }) => <div>{row.getValue("arrivalDate")}</div>,
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }: { row: Row<Shipment> }) => {
        const priority = row.getValue("priority") as "high" | "medium" | "low"
        return getPriorityBadge(priority)
      },
      filterFn: (row: Row<Shipment>, columnId: string, filterValue: unknown) => {
        if (Array.isArray(filterValue) && filterValue.every(v => typeof v === 'string')) {
          return filterValue.includes(row.getValue(columnId));
        }
        return false;
      },
    },
    {
      accessorKey: "aiOptimized",
      header: "AI Optimization",
      cell: ({ row }: { row: Row<Shipment> }) => {
        const shipment = row.original as Shipment
        return shipment.aiOptimized ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center">
                  <Badge variant="outline" className="bg-purple-950/30 text-purple-400 border-purple-800/30">
                    <Brain className="h-3 w-3 mr-1" />
                    Optimized
                  </Badge>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>AI optimized route saving ${shipment.aiSavings}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Badge variant="outline" className="bg-gray-950/30 text-gray-400 border-gray-800/30">
            Standard
          </Badge>
        )
      },
      filterFn: (row: Row<Shipment>, columnId: string, filterValue: unknown) => {
        if (Array.isArray(filterValue) && filterValue.every(v => typeof v === 'string')) {
          return filterValue.includes(row.getValue(columnId) ? "optimized" : "standard");
        }
        return false;
      },
    },
    {
      id: "actions",
      cell: () => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                <span className="sr-only">Open menu</span>
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800 text-gray-300">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-800" />
              <DropdownMenuItem
                className="hover:bg-gray-800 hover:text-white cursor-pointer"
              >
                <Eye className="mr-2 h-4 w-4" />
                View details
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-800 hover:text-white cursor-pointer">
                <FileEdit className="mr-2 h-4 w-4" />
                Edit shipment
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-500 hover:bg-gray-800 hover:text-red-400 cursor-pointer">
                <Trash2 className="mr-2 h-4 w-4" />
                Cancel shipment
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ]

  const filterableColumns = [
    {
      id: "status",
      title: "Status",
      options: [
        { label: "Delivered", value: "delivered" },
        { label: "In Transit", value: "in_transit" },
        { label: "Pending", value: "pending" },
        { label: "Delayed", value: "delayed" },
      ],
    },
    {
      id: "priority",
      title: "Priority",
      options: [
        { label: "High", value: "high" },
        { label: "Medium", value: "medium" },
        { label: "Low", value: "low" },
      ],
    },
    {
      id: "aiOptimized",
      title: "AI Status",
      options: [
        { label: "AI Optimized", value: "optimized" },
        { label: "Standard", value: "standard" },
      ],
    },
  ]

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Shipments</h1>
            <p className="text-slate-400">Manage and track all your shipments in one place</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              New Shipment
            </Button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={shipments}
          searchColumn="trackingNumber"
          filterableColumns={filterableColumns}
        />
      </div>
    </div>
  )
}
