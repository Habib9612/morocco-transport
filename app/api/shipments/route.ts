import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken'; // Keep verify, remove specific error types from import
// import { db } // This comment can be removed or kept, prismaDb is used.
import { db as prismaDb } from '@/lib/db';


// Get all shipments
export async function GET(request: NextRequest) {
  try {
    const sessionCookie = cookies().get('session');
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'Unauthorized: No session cookie' }, { status: 401 });
    }

    let decoded;
    try {
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        console.error('CRITICAL: JWT_SECRET is not defined. Authentication cannot proceed securely.');
        // For API routes, we should throw to be caught by the outer authError block or return a 500
        throw new Error('Server configuration error: JWT_SECRET missing.');
      }
      decoded = verify(
        sessionCookie.value,
        jwtSecret
      ) as { userId: string };
    } catch (err: any) { // Catch as any to inspect name property
      if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        console.error('Token verification error:', err.message);
        return NextResponse.json({ error: 'Unauthorized: Invalid or expired token' }, { status: 401 });
      }
      console.error('Token verification unexpected error:', err);
      throw err; // Re-throw to be caught by outer try-catch
    }

    if (!decoded || !decoded.userId) { // Check decoded itself first
      return NextResponse.json({ error: 'Unauthorized: Invalid token payload structure' }, { status: 401 });
    }

    const user = await prismaDb.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: User not found' }, { status: 401 });
    }
    // User is authenticated. For GET all, no specific role check for now as per plan.
    // (request as any).user = user; // Make user available to handler if needed

  } catch (authError: any) {
    if (authError.name === 'JsonWebTokenError' || authError.name === 'TokenExpiredError') {
       console.error('Outer catch: Token verification error:', authError.message);
       return NextResponse.json({ error: 'Unauthorized: Invalid or expired token (outer catch)' }, { status: 401 });
    }
    console.error('Authentication process error:', authError);
    return NextResponse.json({ error: 'Internal server error during authentication' }, { status: 500 });
  }

  // Original logic starts here
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const customerId = searchParams.get("customer_id")

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

    const params: any[] = []
    const conditions: string[] = []

    if (status) {
      conditions.push("s.status = $" + (params.length + 1))
      params.push(status)
    }

    if (customerId) {
      conditions.push("s.customer_id = $" + (params.length + 1))
      params.push(customerId)
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ")
    }

    query += " ORDER BY s.created_at DESC"

    const shipments = await executeQuery(query, params)

    return NextResponse.json(shipments)
  } catch (error) {
    console.error("Error fetching shipments:", error)
    return NextResponse.json({ error: "Failed to fetch shipments" }, { status: 500 })
  }
}

// Create a new shipment
export async function POST(request: NextRequest) {
  try {
    const sessionCookie = cookies().get('session');
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'Unauthorized: No session cookie' }, { status: 401 });
    }

    let decoded;
    try {
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        console.error('CRITICAL: JWT_SECRET is not defined. Authentication cannot proceed securely.');
        throw new Error('Server configuration error: JWT_SECRET missing.');
      }
      decoded = verify(
        sessionCookie.value,
        jwtSecret
      ) as { userId: string };
    } catch (err: any) { // Catch as any to inspect name property
      if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        console.error('Token verification error:', err.message);
        return NextResponse.json({ error: 'Unauthorized: Invalid or expired token' }, { status: 401 });
      }
      console.error('Token verification unexpected error:', err);
      throw err; // Re-throw to be caught by outer try-catch
    }

    if (!decoded || !decoded.userId) { // Check decoded itself first
      return NextResponse.json({ error: 'Unauthorized: Invalid token payload structure' }, { status: 401 });
    }

    const user = await prismaDb.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: User not found' }, { status: 401 });
    }

    // Authorization: Check user role for creating a shipment
    if (user.role !== 'INDIVIDUAL' && user.role !== 'COMPANY') {
      // console.log(`User role ${user.role} not authorized to create shipment.`); // For debugging
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
    }
    // User is authenticated and authorized.
    // (request as any).user = user; // Make user available to handler
    // NOTE: The `customer_id` in the request body should be validated against `user.id`
    // or ideally, `user.id` (the authenticated user) should be used as the `customer_id`.

  } catch (authError: any) {
    if (authError.name === 'JsonWebTokenError' || authError.name === 'TokenExpiredError') {
       console.error('Outer catch: Token verification error:', authError.message);
       return NextResponse.json({ error: 'Unauthorized: Invalid or expired token (outer catch)' }, { status: 401 });
    }
    console.error('Authentication process error:', authError);
    return NextResponse.json({ error: 'Internal server error during authentication' }, { status: 500 });
  }

  // Original logic starts here
  try {
    const {
      customer_id, // This should ideally be replaced/validated by authenticated user.id
      origin_id,
      destination_id,
      status,
      priority,
      weight,
      volume,
      scheduled_pickup,
      scheduled_delivery,
    } = await request.json()

    // Validate input
    if (!customer_id || !origin_id || !destination_id) {
      return NextResponse.json({ error: "Customer ID, origin ID, and destination ID are required" }, { status: 400 })
    }

    // Generate tracking number
    const trackingNumber = "SHP-" + Date.now() + "-" + Math.floor(Math.random() * 1000)

    // Create shipment
    const result = await executeQuery(
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
    )

    // Get related data
    const shipment = result[0]

    const [origin] = await executeQuery("SELECT * FROM locations WHERE id = $1", [origin_id])
    const [destination] = await executeQuery("SELECT * FROM locations WHERE id = $1", [destination_id])
    const [customer] = await executeQuery("SELECT name, email FROM users WHERE id = $1", [customer_id])

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

    return NextResponse.json(shipmentWithDetails, { status: 201 })
  } catch (error) {
    console.error("Error creating shipment:", error)
    return NextResponse.json({ error: "Failed to create shipment" }, { status: 500 })
  }
}
