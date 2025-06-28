"use server"

import { executeQuery } from "@/lib/db"

export async function getTrucks(status?: string) {
  try {
    let query = "SELECT * FROM trucks"
    const params: any[] = []

    if (status) {
      query += " WHERE status = $1"
      params.push(status)
    }

    query += " ORDER BY created_at DESC"

    const trucks = await executeQuery(query, params)

    return { success: true, trucks }
  } catch (error) {
    console.error("Error fetching trucks:", error)
    return { success: false, error: "Failed to fetch trucks" }
  }
}

export async function getTruckById(id: string) {
  try {
    const trucks = await executeQuery("SELECT * FROM trucks WHERE id = $1", [id])

    if (trucks.length === 0) {
      return { success: false, error: "Truck not found" }
    }

    return { success: true, truck: trucks[0] }
  } catch (error) {
    console.error("Error fetching truck:", error)
    return { success: false, error: "Failed to fetch truck" }
  }
}

export async function createTruck(data: {
  license_plate: string
  model: string
  capacity: number
  status?: string
  fuel_efficiency?: number
}) {
  try {
    const { license_plate, model, capacity, status, fuel_efficiency } = data

    // Check if truck with license plate already exists
    const existingTruck = await executeQuery("SELECT * FROM trucks WHERE license_plate = $1", [license_plate])

    if (existingTruck.length > 0) {
      return { success: false, error: "Truck with this license plate already exists" }
    }

    // Create truck
    const result = await executeQuery(
      `INSERT INTO trucks 
       (license_plate, model, capacity, status, fuel_efficiency) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [license_plate, model, capacity, status || "available", fuel_efficiency],
    )

    return { success: true, truck: result[0] }
  } catch (error) {
    console.error("Error creating truck:", error)
    return { success: false, error: "Failed to create truck" }
  }
}

export async function updateTruck(
  id: string,
  data: {
    license_plate: string
    model: string
    capacity: number
    status?: string
    fuel_efficiency?: number
    last_maintenance_date?: string
    next_maintenance_date?: string
  },
) {
  try {
    const { license_plate, model, capacity, status, fuel_efficiency, last_maintenance_date, next_maintenance_date } =
      data

    // Check if truck exists
    const existingTruck = await executeQuery("SELECT * FROM trucks WHERE id = $1", [id])

    if (existingTruck.length === 0) {
      return { success: false, error: "Truck not found" }
    }

    // Update truck
    const result = await executeQuery(
      `UPDATE trucks 
       SET license_plate = $1, model = $2, capacity = $3, status = $4, 
           fuel_efficiency = $5, last_maintenance_date = $6, next_maintenance_date = $7,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [license_plate, model, capacity, status, fuel_efficiency, last_maintenance_date, next_maintenance_date, id],
    )

    return { success: true, truck: result[0] }
  } catch (error) {
    console.error("Error updating truck:", error)
    return { success: false, error: "Failed to update truck" }
  }
}

export async function deleteTruck(id: string) {
  try {
    // Check if truck exists
    const existingTruck = await executeQuery("SELECT * FROM trucks WHERE id = $1", [id])

    if (existingTruck.length === 0) {
      return { success: false, error: "Truck not found" }
    }

    // Check if truck is being used in any active routes
    const activeRoutes = await executeQuery(
      `SELECT * FROM routes 
       WHERE truck_id = $1 
       AND status NOT IN ('completed', 'cancelled')`,
      [id],
    )

    if (activeRoutes.length > 0) {
      return { success: false, error: "Cannot delete truck that is assigned to active routes" }
    }

    // Delete truck
    await executeQuery("DELETE FROM trucks WHERE id = $1", [id])

    return { success: true }
  } catch (error) {
    console.error("Error deleting truck:", error)
    return { success: false, error: "Failed to delete truck" }
  }
}
