import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { db as prismaDb } from '@/lib/db';

// Get all locations
export async function GET(request: NextRequest) {
  let user; // Keep user variable for potential future use, even if not strictly needed for this GET
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
    // For GET all locations, any authenticated user is allowed as per plan.
    // This includes ADMIN. No specific role check beyond authentication is needed here.

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
    const city = searchParams.get("city")
    const query = searchParams.get("query")

    let sqlQuery = "SELECT * FROM locations"
    const params: any[] = []
    const conditions: string[] = []

    if (city) {
      conditions.push("city = $" + (params.length + 1))
      params.push(city)
    }

    if (query) {
      conditions.push("(name ILIKE $" + (params.length + 1) + " OR address ILIKE $" + (params.length + 1) + ")")
      params.push(`%${query}%`)
    }

    if (conditions.length > 0) {
      sqlQuery += " WHERE " + conditions.join(" AND ")
    }

    sqlQuery += " ORDER BY name"

    const locations = await executeQuery(sqlQuery, params)

    return NextResponse.json(locations)
  } catch (error) {
    console.error("Error fetching locations:", error)
    return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 })
  }
}

// Create a new location
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

    // Authorization check for creating a location
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
    const { name, address, city, state, country, postal_code, latitude, longitude } = await request.json()

    // Validate input
    if (!name || !address || !city || !country) {
      return NextResponse.json({ error: "Name, address, city, and country are required" }, { status: 400 })
    }

    // Create location
    const result = await executeQuery(
      `INSERT INTO locations 
       (name, address, city, state, country, postal_code, latitude, longitude) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [name, address, city, state, country, postal_code, latitude, longitude],
    )

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating location:", error)
    return NextResponse.json({ error: "Failed to create location" }, { status: 500 })
  }
}
