import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { db as prismaDb } from '@/lib/db';

// Get a specific driver
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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
    // Ownership/management/self-view checks would go here in a real scenario

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

    const drivers = await executeQuery(
      `SELECT d.*, u.name, u.email 
       FROM drivers d
       JOIN users u ON d.user_id = u.id
       WHERE d.id = $1`,
      [id],
    )

    if (drivers.length === 0) {
      return NextResponse.json({ error: "Driver not found" }, { status: 404 })
    }

    return NextResponse.json(drivers[0])
  } catch (error) {
    console.error("Error fetching driver:", error)
    return NextResponse.json({ error: "Failed to fetch driver" }, { status: 500 })
  }
}

// Update a driver
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

    // Authorization check
    if (user.role !== 'ADMIN' && user.role !== 'COMPANY' && user.role !== 'CARRIER') {
    if (user.role !== 'ADMIN' && user.role !== 'COMPANY' && user.role !== 'CARRIER') {
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
    }
    // Ownership/management checks would go here

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
    const { license_number, license_expiry_date, phone_number, status, rating } = await request.json()

    // Check if driver exists
    const existingDriver = await executeQuery("SELECT * FROM drivers WHERE id = $1", [id])

    if (existingDriver.length === 0) {
      return NextResponse.json({ error: "Driver not found" }, { status: 404 })
    }

    // Update driver
    const result = await executeQuery(
      `UPDATE drivers 
       SET license_number = $1, license_expiry_date = $2, phone_number = $3, 
           status = $4, rating = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
      [license_number, license_expiry_date, phone_number, status, rating, id],
    )

    // Get user details
    const user = await executeQuery("SELECT name, email FROM users WHERE id = $1", [result[0].user_id])

    const driverWithUser = {
      ...result[0],
      name: user[0].name,
      email: user[0].email,
    }

    return NextResponse.json(driverWithUser)
  } catch (error) {
    console.error("Error updating driver:", error)
    return NextResponse.json({ error: "Failed to update driver" }, { status: 500 })
  }
}

// Delete a driver
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

    // Authorization check
    if (user.role !== 'COMPANY' && user.role !== 'CARRIER' /* && user.role !== 'ADMIN' */) {
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
    }
    // Ownership/management checks would go here

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

    // Check if driver exists
    const existingDriver = await executeQuery("SELECT * FROM drivers WHERE id = $1", [id])

    if (existingDriver.length === 0) {
      return NextResponse.json({ error: "Driver not found" }, { status: 404 })
    }

    // Check if driver is assigned to any active routes
    const activeRoutes = await executeQuery(
      `SELECT * FROM routes 
       WHERE driver_id = $1 
       AND status NOT IN ('completed', 'cancelled')`,
      [id],
    )

    if (activeRoutes.length > 0) {
      return NextResponse.json({ error: "Cannot delete driver that is assigned to active routes" }, { status: 400 })
    }

    // Delete driver
    await executeQuery("DELETE FROM drivers WHERE id = $1", [id])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting driver:", error)
    return NextResponse.json({ error: "Failed to delete driver" }, { status: 500 })
  }
}
