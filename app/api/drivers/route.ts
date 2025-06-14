import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { db as prismaDb } from '@/lib/db';

// Get all drivers
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

    // Authorization check for listing drivers
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

    let query = `
      SELECT d.*, u.name, u.email 
      FROM drivers d
      JOIN users u ON d.user_id = u.id
    `
    const params: any[] = []

    if (status) {
      query += " WHERE d.status = $1"
      params.push(status)
    }

    query += " ORDER BY d.created_at DESC"

    const drivers = await executeQuery(query, params)

    return NextResponse.json(drivers)
  } catch (error) {
    console.error("Error fetching drivers:", error)
    return NextResponse.json({ error: "Failed to fetch drivers" }, { status: 500 })
  }
}

// Create a new driver
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

    // Authorization check for creating a driver
    if (user.role !== 'ADMIN' && user.role !== 'COMPANY' && user.role !== 'CARRIER') {
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
    }
    // Note: Further logic might be needed to associate the driver with the user's company/carrier ID.

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
    const { user_id, license_number, license_expiry_date, phone_number, status } = await request.json()

    // Validate input
    if (!user_id || !license_number || !license_expiry_date || !phone_number) {
      return NextResponse.json(
        { error: "User ID, license number, expiry date, and phone number are required" },
        { status: 400 },
      )
    }

    // Check if user exists
    const existingUser = await executeQuery("SELECT * FROM users WHERE id = $1", [user_id])

    if (existingUser.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if driver with license number already exists
    const existingDriver = await executeQuery("SELECT * FROM drivers WHERE license_number = $1", [license_number])

    if (existingDriver.length > 0) {
      return NextResponse.json({ error: "Driver with this license number already exists" }, { status: 409 })
    }

    // Create driver
    const result = await executeQuery(
      `INSERT INTO drivers 
       (user_id, license_number, license_expiry_date, phone_number, status) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [user_id, license_number, license_expiry_date, phone_number, status || "available"],
    )

    // Get user details
    const user = await executeQuery("SELECT name, email FROM users WHERE id = $1", [user_id])

    const driverWithUser = {
      ...result[0],
      name: user[0].name,
      email: user[0].email,
    }

    return NextResponse.json(driverWithUser, { status: 201 })
  } catch (error) {
    console.error("Error creating driver:", error)
    return NextResponse.json({ error: "Failed to create driver" }, { status: 500 })
  }
}
