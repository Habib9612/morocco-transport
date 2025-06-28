"use client"

import { CheckCircle2, Clock, Truck, AlertTriangle, MoreHorizontal, Eye, FileEdit, Trash2, Brain } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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

interface ShipmentTableProps {
  shipments: Shipment[]
  onSelectOrder: (id: string) => void
  selectedOrder: string | null
}

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

export default function ShipmentTable({ shipments, onSelectOrder, selectedOrder }: ShipmentTableProps) {
  return (
    <div className="rounded-md border border-[#2d3748]">
      <Table>
        <TableHeader className="bg-[#111827]">
          <TableRow className="border-[#2d3748] hover:bg-transparent">
            <TableHead className="text-gray-400">Tracking #</TableHead>
            <TableHead className="text-gray-400">Route</TableHead>
            <TableHead className="text-gray-400">Customer</TableHead>
            <TableHead className="text-gray-400">Status</TableHead>
            <TableHead className="text-gray-400">Departure</TableHead>
            <TableHead className="text-gray-400">Arrival</TableHead>
            <TableHead className="text-gray-400">Priority</TableHead>
            <TableHead className="text-gray-400">AI Optimization</TableHead>
            <TableHead className="text-right text-gray-400">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shipments.map((shipment) => (
            <TableRow
              key={shipment.id}
              className={`border-[#2d3748] hover:bg-[#1a202c] cursor-pointer ${
                selectedOrder === shipment.id ? "bg-[#1a202c]" : ""
              }`}
              onClick={() => onSelectOrder(shipment.id)}
            >
              <TableCell className="font-medium text-white">{shipment.trackingNumber}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">From: {shipment.origin}</span>
                  <span className="text-xs text-gray-400">To: {shipment.destination}</span>
                </div>
              </TableCell>
              <TableCell>{shipment.customer}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getStatusIcon(shipment.status)}
                  {getStatusBadge(shipment.status)}
                </div>
              </TableCell>
              <TableCell>{shipment.departureDate}</TableCell>
              <TableCell>{shipment.arrivalDate}</TableCell>
              <TableCell>{getPriorityBadge(shipment.priority)}</TableCell>
              <TableCell>
                {shipment.aiOptimized ? (
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
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800 text-gray-300">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-800" />
                    <DropdownMenuItem className="hover:bg-gray-800 hover:text-white cursor-pointer">
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
