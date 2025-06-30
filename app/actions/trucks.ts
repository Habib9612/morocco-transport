"use server"

import { executeQuery } from "@/lib/db"
import { z } from "zod"

// Base Truck interface
interface Truck {
  id: string;
  license_plate: string;
  model: string;
  capacity: number;
  status: 'available' | 'in_use' | 'maintenance';
  fuel_efficiency?: number;
  last_maintenance_date?: string;
  next_maintenance_date?: string;
  created_at: string;
  updated_at: string;
}

// Zod schema for creating a truck
const CreateTruckSchema = z.object({
  license_plate: z.string().min(1, "License plate is required"),
  model: z.string().min(1, "Model is required"),
  capacity: z.number().positive("Capacity must be a positive number"),
  status: z.enum(['available', 'in_use', 'maintenance']).optional(),
  fuel_efficiency: z.number().optional(),
});
type CreateTruckData = z.infer<typeof CreateTruckSchema>;

// Zod schema for updating a truck
const UpdateTruckSchema = CreateTruckSchema.extend({
  last_maintenance_date: z.string().optional(),
  next_maintenance_date: z.string().optional(),
});
type UpdateTruckData = z.infer<typeof UpdateTruckSchema>;


export async function getTrucks(status?: string) {
  try {
    let query = "SELECT * FROM trucks"
    const params: string[] = []

    if (status) {
      query += " WHERE status = $1"
      params.push(status)
    }

    query += " ORDER BY created_at DESC"

    const trucks = (await executeQuery(query, params)) as Truck[]

    return { success: true, trucks }
  } catch (error: any) {
    console.error("Error fetching trucks:", error)
    return { success: false, error: "Failed to fetch trucks" }
  }
}

export async function getTruckById(id: string) {
  try {
    const trucks = (await executeQuery("SELECT * FROM trucks WHERE id = $1", [id])) as Truck[]

    if (trucks.length === 0) {
      return { success: false, error: "Truck not found" }
    }

    return { success: true, truck: trucks[0] }
  } catch (error: any) {
    console.error("Error fetching truck:", error)
    return { success: false, error: "Failed to fetch truck" }
  }
}

export async function createTruck(data: CreateTruckData) {
  try {
    const validatedData = CreateTruckSchema.parse(data);
    const { license_plate, model, capacity, status, fuel_efficiency } = validatedData;

    const existingTruck = (await executeQuery("SELECT * FROM trucks WHERE license_plate = $1", [license_plate])) as Truck[];

    if (existingTruck.length > 0) {
      return { success: false, error: "Truck with this license plate already exists" }
    }

    const result = (await executeQuery(
      `INSERT INTO trucks 
       (license_plate, model, capacity, status, fuel_efficiency) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [license_plate, model, capacity, status || "available", fuel_efficiency],
    )) as Truck[]

    return { success: true, truck: result[0] }
  } catch (error: any) {
    console.error("Error creating truck:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: "Invalid input data." };
    }
    return { success: false, error: "Failed to create truck" }
  }
}

export async function updateTruck(
  id: string,
  data: UpdateTruckData,
) {
  try {
    const validatedData = UpdateTruckSchema.parse(data);
    const { license_plate, model, capacity, status, fuel_efficiency, last_maintenance_date, next_maintenance_date } = validatedData;
    
    const existingTruck = (await executeQuery("SELECT * FROM trucks WHERE id = $1", [id])) as Truck[]

    if (existingTruck.length === 0) {
      return { success: false, error: "Truck not found" }
    }

    const result = (await executeQuery(
      `UPDATE trucks 
       SET license_plate = $1, model = $2, capacity = $3, status = $4, 
           fuel_efficiency = $5, last_maintenance_date = $6, next_maintenance_date = $7,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [license_plate, model, capacity, status, fuel_efficiency, last_maintenance_date, next_maintenance_date, id],
    )) as Truck[]

    return { success: true, truck: result[0] }
  } catch (error: any) {
    console.error("Error updating truck:", error)
     if (error instanceof z.ZodError) {
      return { success: false, error: "Invalid input data." };
    }
    return { success: false, error: "Failed to update truck" }
  }
}

export async function deleteTruck(id: string) {
  try {
    const existingTruck = (await executeQuery("SELECT * FROM trucks WHERE id = $1", [id])) as Truck[]

    if (existingTruck.length === 0) {
      return { success: false, error: "Truck not found" }
    }

    const activeRoutes = (await executeQuery(
      `SELECT id FROM routes 
       WHERE truck_id = $1 
       AND status NOT IN ('completed', 'cancelled')`,
      [id],
    )) as unknown[]

    if (activeRoutes.length > 0) {
      return { success: false, error: "Cannot delete truck that is assigned to active routes" }
    }

    await executeQuery("DELETE FROM trucks WHERE id = $1", [id])

    return { success: true }
  } catch (error: any) {
    console.error("Error deleting truck:", error)
    return { success: false, error: "Failed to delete truck" }
  }
}
