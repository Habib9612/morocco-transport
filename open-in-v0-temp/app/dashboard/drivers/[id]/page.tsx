import { notFound } from "next/navigation"
import { DriverDetails } from "@/components/driver-details"
import { getDriver } from "@/app/actions/drivers"
import { executeQuery } from "@/lib/db"

export const metadata = {
  title: "Driver Details",
  description: "View and manage driver details",
}

async function getDriverAssignments(driverId: string) {
  try {
    const query = `
      SELECT s.id as shipment_id, s.shipment_number, l1.name as origin, l2.name as destination, 
             s.pickup_date as start_date, s.delivery_date as end_date, s.status
      FROM shipments s
      JOIN locations l1 ON s.origin_id = l1.id
      JOIN locations l2 ON s.destination_id = l2.id
      WHERE s.driver_id = $1
      ORDER BY s.pickup_date DESC
    `
    return await executeQuery(query, [driverId])
  } catch (error) {
    console.error("Failed to fetch driver assignments:", error)
    return []
  }
}

export default async function DriverDetailPage({ params }: { params: { id: string } }) {
  try {
    const driver = await getDriver(params.id)
    const assignments = await getDriverAssignments(params.id)

    return <DriverDetails driver={driver} assignments={assignments} />
  } catch (error) {
    notFound()
  }
}
