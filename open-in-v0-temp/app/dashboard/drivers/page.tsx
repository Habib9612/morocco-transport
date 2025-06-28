import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DriverTable } from "@/components/driver-table"
import { getDrivers } from "@/app/actions/drivers"
import { Plus, RefreshCcw, Filter } from "lucide-react"

export const metadata = {
  title: "Driver Management",
  description: "Manage your drivers and their assignments",
}

export default async function DriversPage() {
  const drivers = await getDrivers()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Driver Management</h2>
          <p className="text-muted-foreground">Manage your drivers, their licenses, and assignments</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/drivers/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Driver
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <Suspense fallback={<div>Loading drivers...</div>}>
        <DriverTable drivers={drivers} />
      </Suspense>
    </div>
  )
}
