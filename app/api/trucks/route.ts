import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { db as prismaDb } from '@/lib/db'; // Assuming User model has a 'role' property

// Get all trucks
export async function GET(request: NextRequest) {
  let user;
  try {
    const sessionCookie = cookies().get('session');
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'Unauthorized: No session cookie' }, { status: 401 });
    }

    let decoded;
    try {
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        console.error('CRITICAL: JWT_SECRET is not defined.');
        throw new Error('Server configuration error: JWT_SECRET missing.');
      }
      decoded = verify(sessionCookie.value, jwtSecret) as { userId: string };
    } catch (err: any) {
      if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        console.error('Token verification error:', err.message);
        return NextResponse.json({ error: 'Unauthorized: Invalid or expired token' }, { status: 401 });
      }
      console.error('Token verification unexpected error:', err);
      throw err;
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token payload structure' }, { status: 401 });
    }

    user = await prismaDb.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: User not found' }, { status: 401 });
    }

    // Authorization check
    if (user.role !== 'ADMIN' && user.role !== 'COMPANY' && user.role !== 'CARRIER') {
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
    }

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

    let query = "SELECT * FROM trucks"
    const params: any[] = []

    if (status) {
      query += " WHERE status = $1"
      params.push(status)
    }

    query += " ORDER BY created_at DESC"

    const trucks = await executeQuery(query, params)

    return NextResponse.json(trucks)
  } catch (error) {
    console.error("Error fetching trucks:", error)
    return NextResponse.json({ error: "Failed to fetch trucks" }, { status: 500 })
  }
}

// Create a new truck
export async function POST(request: NextRequest) {
  let user;
  try {
    const sessionCookie = cookies().get('session');
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'Unauthorized: No session cookie' }, { status: 401 });
    }

    let decoded;
    try {
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        console.error('CRITICAL: JWT_SECRET is not defined.');
        throw new Error('Server configuration error: JWT_SECRET missing.');
      }
      decoded = verify(sessionCookie.value, jwtSecret) as { userId: string };
    } catch (err: any) {
      if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        console.error('Token verification error:', err.message);
        return NextResponse.json({ error: 'Unauthorized: Invalid or expired token' }, { status: 401 });
      }
      console.error('Token verification unexpected error:', err);
      throw err;
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token payload structure' }, { status: 401 });
    }

    user = await prismaDb.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: User not found' }, { status: 401 });
    }

    // Authorization check
    if (user.role !== 'ADMIN' && user.role !== 'COMPANY' && user.role !== 'CARRIER') {
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
    }
    // Note: For creating a truck, the `carrierId` in the Truck model should ideally be linked to this authenticated user if they are a CARRIER.
    // Or, if a COMPANY is creating it for one of their carriers, that logic would be more complex.
    // For now, just the role check.

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
    const { license_plate, model, capacity, status, fuel_efficiency } = await request.json()

    // Validate input
    if (!license_plate || !model || !capacity) {
      return NextResponse.json({ error: "License plate, model, and capacity are required" }, { status: 400 })
    }

    // Check if truck with license plate already exists
    const existingTruck = await executeQuery("SELECT * FROM trucks WHERE license_plate = $1", [license_plate])

    if (existingTruck.length > 0) {
      return NextResponse.json({ error: "Truck with this license plate already exists" }, { status: 409 })
    }

    // Create truck
    const result = await executeQuery(
      `INSERT INTO trucks 
       (license_plate, model, capacity, status, fuel_efficiency) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [license_plate, model, capacity, status || "available", fuel_efficiency],
    )

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating truck:", error)
    return NextResponse.json({ error: "Failed to create truck" }, { status: 500 })
  }
}
