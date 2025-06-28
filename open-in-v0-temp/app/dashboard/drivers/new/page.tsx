import { DriverForm } from "@/components/driver-form"
import { executeQuery } from "@/lib/db"

export const metadata = {
  title: "Add New Driver",
  description: "Add a new driver to your fleet",
}

async function getUsers() {
  try {
    // Get users that don't already have a driver profile
    const query = `
      SELECT u.id, u.name, u.email 
      FROM users u
      LEFT JOIN drivers d ON u.id = d.user_id
      WHERE d.id IS NULL
      ORDER BY u.name
    `
    return await executeQuery(query, [])
  } catch (error) {
    console.error("Failed to fetch users:", error)
    return []
  }
}

export default async function NewDriverPage() {
  const users = await getUsers()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Add New Driver</h2>
        <p className="text-muted-foreground">Create a new driver profile for your fleet</p>
      </div>

      <div className="border rounded-lg p-6">
        <DriverForm users={users} mode="create" />
      </div>
    </div>
  )
}
