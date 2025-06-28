import { notFound } from "next/navigation"
import { DriverForm } from "@/components/driver-form"
import { getDriver } from "@/app/actions/drivers"

export const metadata = {
  title: "Edit Driver",
  description: "Edit driver details",
}

export default async function EditDriverPage({ params }: { params: { id: string } }) {
  try {
    const driver = await getDriver(params.id)

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Driver</h2>
          <p className="text-muted-foreground">Update driver information and status</p>
        </div>

        <div className="border rounded-lg p-6">
          <DriverForm driver={driver} mode="edit" />
        </div>
      </div>
    )
  } catch (error) {
    notFound()
  }
}
