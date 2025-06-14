import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { db as prismaDb } from '@/lib/db';

// Get a specific location
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  let user; // Keep user variable for potential future use
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
    // For GET specific location, any authenticated user is allowed as per plan.
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
    const id = params.id

    const locations = await executeQuery("SELECT * FROM locations WHERE id = $1", [id])

    if (locations.length === 0) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 })
    }

    return NextResponse.json(locations[0])
  } catch (error) {
    console.error("Error fetching location:", error)
    return NextResponse.json({ error: "Failed to fetch location" }, { status: 500 })
  }
}

// Update a location
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Authorization check for updating a location
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
    const id = params.id
    const { name, address, city, state, country, postal_code, latitude, longitude } = await request.json()

    // Check if location exists
    const existingLocation = await executeQuery("SELECT * FROM locations WHERE id = $1", [id])

    if (existingLocation.length === 0) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 })
    }

    // Update location
    const result = await executeQuery(
      `UPDATE locations 
       SET name = $1, address = $2, city = $3, state = $4,
           country = $5, postal_code = $6, latitude = $7, longitude = $8,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [name, address, city, state, country, postal_code, latitude, longitude, id],
    )

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating location:", error)
    return NextResponse.json({ error: "Failed to update location" }, { status: 500 })
  }
}

// Delete a location
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Authorization check for deleting a location
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
    const id = params.id

    // Check if location exists
    const existingLocation = await executeQuery("SELECT * FROM locations WHERE id = $1", [id])

    if (existingLocation.length === 0) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 })
    }

    // Check if location is being used in shipments
    const shipments = await executeQuery("SELECT * FROM shipments WHERE origin_id = $1 OR destination_id = $1", [id])

    if (shipments.length > 0) {
      return NextResponse.json({ error: "Cannot delete location that is used in shipments" }, { status: 400 })
    }

    // Check if location is being used in route waypoints
    const waypoints = await executeQuery("SELECT * FROM route_waypoints WHERE location_id = $1", [id])

    if (waypoints.length > 0) {
      return NextResponse.json({ error: "Cannot delete location that is used in route waypoints" }, { status: 400 })
    }

    // Delete location
    await executeQuery("DELETE FROM locations WHERE id = $1", [id])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting location:", error)
    return NextResponse.json({ error: "Failed to delete location" }, { status: 500 })
  }
}
