import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import type { Shipment, ShipmentWithDetails } from "@/types"

// Get all shipments
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const senderId = searchParams.get("sender_id")
    const receiverId = searchParams.get("receiver_id")

    const where: any = {}
    
    if (status) {
      where.status = status.toUpperCase()
    }
    
    if (senderId) {
      where.senderId = senderId
    }
    
    if (receiverId) {
      where.receiverId = receiverId
    }

    const shipments = await db.shipment.findMany({
      where,
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        },
        truck: {
          select: {
            id: true,
            licensePlate: true,
            model: true,
            make: true,
            status: true
          }
        },
        company: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        trackingEvents: {
          orderBy: {
            timestamp: 'desc'
          },
          take: 5
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(shipments)
  } catch (error) {
    console.error("Error fetching shipments:", error)
    return NextResponse.json({ error: "Failed to fetch shipments" }, { status: 500 })
  }
}

// Create a new shipment
export async function POST(request: NextRequest) {
  try {
    const {
      senderId,
      receiverId,
      pickupAddress,
      pickupCity,
      pickupPostal,
      pickupDate,
      pickupContact,
      pickupPhone,
      deliveryAddress,
      deliveryCity,
      deliveryPostal,
      deliveryDate,
      deliveryContact,
      deliveryPhone,
      weight,
      dimensions,
      description,
      specialInstructions,
      price,
      truckId,
      companyId
    } = await request.json()

    // Validate input
    if (!senderId || !receiverId || !pickupAddress || !pickupCity || !deliveryAddress || !deliveryCity) {
      return NextResponse.json({ 
        error: "Sender ID, receiver ID, pickup address, pickup city, delivery address, and delivery city are required" 
      }, { status: 400 })
    }

    // Verify sender and receiver exist
    const [sender, receiver] = await Promise.all([
      db.user.findUnique({ where: { id: senderId } }),
      db.user.findUnique({ where: { id: receiverId } })
    ])

    if (!sender) {
      return NextResponse.json({ error: "Sender not found" }, { status: 404 })
    }

    if (!receiver) {
      return NextResponse.json({ error: "Receiver not found" }, { status: 404 })
    }

    // Generate tracking number
    const trackingNumber = "MRT-" + Date.now() + "-" + Math.floor(Math.random() * 10000).toString().padStart(4, '0')

    // Create shipment
    const shipment = await db.shipment.create({
      data: {
        trackingNumber,
        senderId,
        receiverId,
        pickupAddress,
        pickupCity,
        pickupPostal,
        pickupDate: pickupDate ? new Date(pickupDate) : undefined,
        pickupContact,
        pickupPhone,
        deliveryAddress,
        deliveryCity,
        deliveryPostal,
        deliveryDate: deliveryDate ? new Date(deliveryDate) : undefined,
        deliveryContact,
        deliveryPhone,
        weight: weight ? parseFloat(weight) : undefined,
        dimensions,
        description,
        specialInstructions,
        price: price ? parseFloat(price) : undefined,
        truckId,
        companyId,
        status: 'PENDING'
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        },
        truck: {
          select: {
            id: true,
            licensePlate: true,
            model: true,
            make: true
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

    // Create initial tracking event
    await db.trackingEvent.create({
      data: {
        shipmentId: shipment.id,
        event: 'SHIPMENT_CREATED',
        description: 'Shipment has been created and is pending confirmation',
        location: pickupCity
      }
    })

    return NextResponse.json(shipment, { status: 201 })
  } catch (error) {
    console.error("Error creating shipment:", error)
    return NextResponse.json({ error: "Failed to create shipment" }, { status: 500 })
  }
}
