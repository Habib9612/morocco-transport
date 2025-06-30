"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Edit, Mail, MapPin, Phone, Truck, User, FileText, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { deleteDriver } from "@/app/actions/drivers"

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

interface Assignment {
  id: string
  shipment_id: string
  shipment_number: string
  origin: string
  destination: string
  start_date: string
  end_date: string
  status: string
}

interface DriverDetailsProps {
  driver: Driver
  assignments?: Assignment[]
}

export function DriverDetails({ driver, assignments = [] }: DriverDetailsProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this driver?")) {
      setIsDeleting(true)
      const result = await deleteDriver(driver.id)

      if (result.success) {
        toast({
          title: "Driver deleted",
          description: "The driver has been successfully deleted.",
        })
        router.push("/dashboard/drivers")
      } else {
        setIsDeleting(false)
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

  const isLicenseExpiringSoon = () => {
    const expiryDate = new Date(driver.license_expiry_date)
    const today = new Date()
    const diffTime = expiryDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 30
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Driver Details</h2>
        <div className="flex space-x-2">
          <Button asChild>
            <Link href={`/dashboard/drivers/${driver.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                {driver.name}
                <div className="ml-auto">{getStatusBadge(driver.status)}</div>
              </CardTitle>
              <CardDescription>Driver Information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLicenseExpiringSoon() && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        License expires soon: {formatDate(driver.license_expiry_date)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Email:</span>
                  <span className="ml-2">{driver.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="mr-2 h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Phone:</span>
                  <span className="ml-2">{driver.phone_number}</span>
                </div>
                <div className="flex items-center">
                  <FileText className="mr-2 h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">License Number:</span>
                  <span className="ml-2">{driver.license_number}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">License Expiry:</span>
                  <span className="ml-2">{formatDate(driver.license_expiry_date)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Status</CardTitle>
              <CardDescription>Driver's current status and availability</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Status</p>
                    <p className="text-sm text-gray-500">Current working status</p>
                  </div>
                </div>
                {getStatusBadge(driver.status)}
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button variant="outline" className="w-full">
                Change Status
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assignments</CardTitle>
              <CardDescription>Current and past shipment assignments</CardDescription>
            </CardHeader>
            <CardContent>
              {assignments.length === 0 ? (
                <div className="text-center py-6">
                  <Truck className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No assignments</h3>
                  <p className="mt-1 text-sm text-gray-500">This driver doesn't have any assignments yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {assignments.map((assignment) => (
                    <div key={assignment.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">Shipment #{assignment.shipment_number}</h4>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <MapPin className="mr-1 h-4 w-4" />
                            {assignment.origin} to {assignment.destination}
                          </div>
                        </div>
                        <Badge>{assignment.status}</Badge>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        {formatDate(assignment.start_date)} - {formatDate(assignment.end_date)}
                      </div>
                      <div className="mt-3">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/shipments/${assignment.shipment_id}`}>View Details</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button className="w-full">Assign to Shipment</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>Driver's documents and certifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No documents</h3>
                <p className="mt-1 text-sm text-gray-500">No documents have been uploaded for this driver yet.</p>
                <div className="mt-6">
                  <Button>Upload Document</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
