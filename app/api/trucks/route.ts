import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import type { Truck, TruckWithDetails } from "@/types"

// Get all trucks
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const companyId = searchParams.get("company_id")
    const driverId = searchParams.get("driver_id")

    const where: any = {}
    
    if (status) {
      where.status = status.toUpperCase()
    }
    
    if (companyId) {
      where.companyId = companyId
    }
    
    if (driverId) {
      where.driverId = driverId
    }

    const trucks = await db.truck.findMany({
      where,
      include: {
        driver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        },
        company: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        currentShipment: {
          select: {
            id: true,
            trackingNumber: true,
            status: true,
            pickupCity: true,
            deliveryCity: true
          }
        },
        maintenanceLogs: {
          orderBy: {
            performedAt: 'desc'
          },
          take: 3
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(trucks)
  } catch (error) {
    console.error("Error fetching trucks:", error)
    return NextResponse.json({ error: "Failed to fetch trucks" }, { status: 500 })
  }
}

// Create a new truck
export async function POST(request: NextRequest) {
  try {
    const { 
      licensePlate, 
      model, 
      make, 
      year, 
      capacity, 
      fuelType, 
      currentLocation, 
      driverId, 
      companyId 
    } = await request.json()

    // Validate input
    if (!licensePlate || !model || !year || !capacity) {
      return NextResponse.json({ 
        error: "License plate, model, year, and capacity are required" 
      }, { status: 400 })
    }

    // Check if truck with license plate already exists
    const existingTruck = await db.truck.findUnique({
      where: { licensePlate }
    })

    if (existingTruck) {
      return NextResponse.json({ 
        error: "Truck with this license plate already exists" 
      }, { status: 409 })
    }

    // Verify driver exists if provided
    if (driverId) {
      const driver = await db.user.findUnique({
        where: { id: driverId, role: 'DRIVER' }
      })
      
      if (!driver) {
        return NextResponse.json({ error: "Driver not found" }, { status: 404 })
      }
    }

    // Verify company exists if provided
    if (companyId) {
      const company = await db.company.findUnique({
        where: { id: companyId }
      })
      
      if (!company) {
        return NextResponse.json({ error: "Company not found" }, { status: 404 })
      }
    }

    // Create truck
    const truck = await db.truck.create({
      data: {
        licensePlate,
        model,
        make,
        year: parseInt(year),
        capacity: parseFloat(capacity),
        fuelType: fuelType || 'DIESEL',
        status: 'AVAILABLE',
        currentLocation,
        driverId,
        companyId
      },
      include: {
        driver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        },
        company: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(truck, { status: 201 })
  } catch (error) {
    console.error("Error creating truck:", error)
    return NextResponse.json({ error: "Failed to create truck" }, { status: 500 })
  }
}
