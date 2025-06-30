"use server"

import { executeQuery } from "@/lib/db"
import { z } from "zod"
import { revalidatePath } from 'next/cache'
import { Shipment, Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/auth'

// Define a base Shipment type based on your DB schema
interface Shipment {
  id: string;
  tracking_number: string;
  customer_id: string;
  origin_id: string;
  destination_id: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  weight?: number;
  volume?: number;
  scheduled_pickup?: string;
  scheduled_delivery?: string;
  actual_pickup?: string;
  actual_delivery?: string;
  created_at: string;
  updated_at: string;
}

// Define a detailed Shipment type that includes joined data
interface DetailedShipment extends Shipment {
  origin_name: string;
  origin_address: string;
  origin_city: string;
  destination_name: string;
  destination_address: string;
  destination_city: string;
  customer_name: string;
  customer_email: string;
  route?: any; // Define a Route type if you have one
}

// Zod schema for creating a shipment, aligned with Prisma model
const CreateShipmentSchema = z.object({
  customer_id: z.string(),
  origin_id: z.string(),
  destination_id: z.string(),
  status: z.enum(['pending', 'in_transit', 'delivered', 'cancelled']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  weight: z.number().optional(),
  volume: z.number().optional(),
  scheduled_pickup: z.string().optional(),
  scheduled_delivery: z.string().optional(),
});
type CreateShipmentData = z.infer<typeof CreateShipmentSchema>;

// Zod schema for updating a shipment
const UpdateShipmentSchema = z.object({
    status: z.enum(['pending', 'in_transit', 'delivered', 'cancelled']).optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    weight: z.number().optional(),
    volume: z.number().optional(),
    scheduled_pickup: z.string().optional(),
    scheduled_delivery: z.string().optional(),
    actual_pickup: z.string().optional(),
    actual_delivery: z.string().optional(),
});
type UpdateShipmentData = z.infer<typeof UpdateShipmentSchema>;

const ShipmentSchema = z.object({
  // Zod schema based on your Prisma model
  originId: z.string(),
  destinationId: z.string(),
  // ... other fields
});

export async function getShipments(filters?: {
  status?: string
  customer_id?: string
}) {
  try {
    let query = `
      SELECT s.*, 
             o.name as origin_name, o.address as origin_address, o.city as origin_city,
             d.name as destination_name, d.address as destination_address, d.city as destination_city,
             u.name as customer_name, u.email as customer_email
      FROM shipments s
      JOIN locations o ON s.origin_id = o.id
      JOIN locations d ON s.destination_id = d.id
      JOIN users u ON s.customer_id = u.id
    `

    const params: (string | number)[] = []
    const conditions: string[] = []

    if (filters?.status) {
      conditions.push("s.status = $" + (params.length + 1))
      params.push(filters.status)
    }

    if (filters?.customer_id) {
      conditions.push("s.customer_id = $" + (params.length + 1))
      params.push(filters.customer_id)
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ")
    }

    query += " ORDER BY s.created_at DESC"

    const shipments = (await executeQuery(query, params)) as DetailedShipment[]

    return { success: true, shipments }
  } catch (error: any) {
    console.error("Error fetching shipments:", error)
    return { success: false, error: "Failed to fetch shipments" }
  }
}

export async function getShipmentById(id: string): Promise<Shipment | null> {
  try {
    const shipments = (await executeQuery(
      `SELECT s.*, 
              o.name as origin_name, o.address as origin_address, o.city as origin_city,
              d.name as destination_name, d.address as destination_address, d.city as destination_city,
              u.name as customer_name, u.email as customer_email
       FROM shipments s
       JOIN locations o ON s.origin_id = o.id
       JOIN locations d ON s.destination_id = d.id
       JOIN users u ON s.customer_id = u.id
       WHERE s.id = $1`,
      [id],
    )) as DetailedShipment[]

    if (shipments.length === 0) {
      return null;
    }

    // Get associated route if exists
    const routes = (await executeQuery(
      `SELECT r.*, 
              t.license_plate, t.model as truck_model,
              d.id as driver_id, u.name as driver_name
       FROM routes r
       LEFT JOIN trucks t ON r.truck_id = t.id
       LEFT JOIN drivers d ON r.driver_id = d.id
       LEFT JOIN users u ON d.user_id = u.id
       WHERE r.shipment_id = $1
       ORDER BY r.created_at DESC
       LIMIT 1`,
      [id],
    )) as any[]

    const shipmentData: DetailedShipment = {
      ...shipments[0],
      route: routes.length > 0 ? routes[0] : null,
    }

    return shipmentData;
  } catch (error: any) {
    console.error("Error fetching shipment:", error)
    return null;
  }
}

export async function createShipment(data: z.infer<typeof CreateShipmentSchema>): Promise<Shipment> {
  try {
    const validatedData = CreateShipmentSchema.parse(data);
    const {
      customer_id,
      origin_id,
      destination_id,
      status,
      priority,
      weight,
      volume,
      scheduled_pickup,
      scheduled_delivery,
    } = validatedData;

    // Generate tracking number
    const trackingNumber = "SHP-" + Date.now() + "-" + Math.floor(Math.random() * 1000)

    // Create shipment
    const result = (await executeQuery(
      `INSERT INTO shipments 
       (tracking_number, customer_id, origin_id, destination_id, status, priority, 
        weight, volume, scheduled_pickup, scheduled_delivery) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       RETURNING *`,
      [
        trackingNumber,
        customer_id,
        origin_id,
        destination_id,
        status || "pending",
        priority || "medium",
        weight,
        volume,
        scheduled_pickup,
        scheduled_delivery,
      ],
    )) as Shipment[]

    // Get related data
    const shipment = result[0]

    const [origin] = (await executeQuery("SELECT * FROM locations WHERE id = $1", [origin_id])) as any[]
    const [destination] = (await executeQuery("SELECT * FROM locations WHERE id = $1", [destination_id])) as any[]
    const [customer] = (await executeQuery("SELECT name, email FROM users WHERE id = $1", [customer_id])) as any[]

    const shipmentWithDetails = {
      ...shipment,
      origin_name: origin.name,
      origin_address: origin.address,
      origin_city: origin.city,
      destination_name: destination.name,
      destination_address: destination.address,
      destination_city: destination.city,
      customer_name: customer.name,
      customer_email: customer.email,
    }

    return shipmentWithDetails;
  } catch (error: any) {
    console.error("Error creating shipment:", error)
    if (error instanceof z.ZodError) {
      throw error;
    }
    throw new Error("Failed to create shipment");
  }
}

export async function updateShipment(id: string, data: z.infer<typeof UpdateShipmentSchema>): Promise<Shipment> {
  try {
    const validatedData = UpdateShipmentSchema.parse(data);
    const { status, priority, weight, volume, scheduled_pickup, scheduled_delivery, actual_pickup, actual_delivery } =
      validatedData;

    // Check if shipment exists
    const existingShipment = (await executeQuery("SELECT * FROM locations WHERE id = $1", [id])) as any[]

    if (existingShipment.length === 0) {
      throw new Error("Shipment not found");
    }

    // Update shipment
    const result = (await executeQuery(
      `UPDATE shipments 
       SET status = $1, priority = $2, weight = $3, volume = $4,
           scheduled_pickup = $5, scheduled_delivery = $6,
           actual_pickup = $7, actual_delivery = $8,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [status, priority, weight, volume, scheduled_pickup, scheduled_delivery, actual_pickup, actual_delivery, id],
    )) as Shipment[]

    if (result.length === 0) {
      throw new Error("Failed to update shipment");
    }

    // Get related data
    const shipment = result[0]

    const [origin] = (await executeQuery("SELECT * FROM locations WHERE id = $1", [shipment.origin_id])) as any[]
    const [destination] = (await executeQuery("SELECT * FROM locations WHERE id = $1", [shipment.destination_id])) as any[]
    const [customer] = (await executeQuery("SELECT name, email FROM users WHERE id = $1", [shipment.customer_id])) as any[]

    const shipmentWithDetails = {
      ...shipment,
      origin_name: origin.name,
      origin_address: origin.address,
      origin_city: origin.city,
      destination_name: destination.name,
      destination_address: destination.address,
      destination_city: destination.city,
      customer_name: customer.name,
      customer_email: customer.email,
    }

    return shipmentWithDetails;
  } catch (error: any) {
    console.error("Error updating shipment:", error)
    if (error instanceof z.ZodError) {
      throw error;
    }
    throw new Error("Failed to update shipment");
  }
}

export async function deleteShipment(id: string) {
  try {
    // Check if the shipment exists
    const existingShipment = (await executeQuery(
      "SELECT id FROM shipments WHERE id = $1",
      [id],
    )) as any[]

    if (existingShipment.length === 0) {
      return { success: false, error: "Shipment not found" }
    }

    // Check for active routes associated with the shipment
    const activeRoutes = (await executeQuery(
      "SELECT id FROM routes WHERE shipment_id = $1 AND status != 'completed'",
      [id],
    )) as any[]

    if (activeRoutes.length > 0) {
      return {
        success: false,
        error: "Cannot delete shipment with active routes.",
      }
    }

    // Delete associated routes
    await executeQuery("DELETE FROM routes WHERE shipment_id = $1", [id])

    // Delete shipment
    await executeQuery("DELETE FROM shipments WHERE id = $1", [id])

    return { success: true }
  } catch (error: any) {
    console.error("Error deleting shipment:", error)
    return { success: false, error: "Failed to delete shipment" }
  }
}
