"use client"

import { useState } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Eye, MoreHorizontal, Edit, Trash2, UserCheck } from "lucide-react"
import { deleteDriver } from "@/app/actions/drivers"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface Driver {
  id: string
  user_id: string
  name: string
  email: string
  license_number: string
  license_expiry_date: string
  phone_number: string
  status: string
  created_at: string
}

interface DriverTableProps {
  drivers: Driver[]
}

export function DriverTable({ drivers }: DriverTableProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this driver?")) {
      setIsDeleting(id)
      const result = await deleteDriver(id)
      setIsDeleting(null)

      if (result.success) {
        toast({
          title: "Driver deleted",
          description: "The driver has been successfully deleted.",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete driver",
          variant: "destructive",
        })
      }
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return <Badge className="bg-green-500">Available</Badge>
      case "on_duty":
        return <Badge className="bg-blue-500">On Duty</Badge>
      case "off_duty":
        return <Badge className="bg-yellow-500">Off Duty</Badge>
      case "inactive":
        return <Badge className="bg-gray-500">Inactive</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>License</TableHead>
            <TableHead>License Expiry</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {drivers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No drivers found.
              </TableCell>
            </TableRow>
          ) : (
            drivers.map((driver) => (
              <TableRow key={driver.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{driver.name}</div>
                    <div className="text-sm text-gray-500">{driver.email}</div>
                  </div>
                </TableCell>
                <TableCell>{driver.license_number}</TableCell>
                <TableCell>{formatDate(driver.license_expiry_date)}</TableCell>
                <TableCell>{driver.phone_number}</TableCell>
                <TableCell>{getStatusBadge(driver.status)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/drivers/${driver.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/drivers/${driver.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(driver.id)} disabled={isDeleting === driver.id}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        {isDeleting === driver.id ? "Deleting..." : "Delete"}
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/drivers/${driver.id}/assignments`}>
                          <UserCheck className="mr-2 h-4 w-4" />
                          Assignments
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
