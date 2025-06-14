import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { db as prismaDb } from '@/lib/db';

// Get a specific shipment
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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

    const user = await prismaDb.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: User not found' }, { status: 401 });
    }
    // Authorization: Check user role for GET specific shipment
    if (user.role !== 'ADMIN' && user.role !== 'INDIVIDUAL' && user.role !== 'COMPANY' && user.role !== 'CARRIER') {
      // console.log(`User role ${user.role} not authorized to GET shipment by ID.`);
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
    }
    // (request as any).user = user; // Make user available to handler

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

    const shipments = await executeQuery(
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
    )

    if (shipments.length === 0) {
      return NextResponse.json({ error: "Shipment not found" }, { status: 404 })
    }

    // Get associated route if exists
    const routes = await executeQuery(
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
    )

    const shipmentData = {
      ...shipments[0],
      route: routes.length > 0 ? routes[0] : null,
    }

    return NextResponse.json(shipmentData)
  } catch (error) {
    console.error("Error fetching shipment:", error)
    return NextResponse.json({ error: "Failed to fetch shipment" }, { status: 500 })
  }
}

// Update a shipment
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const user = await prismaDb.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: User not found' }, { status: 401 });
    }
    // Authorization: Check user role for PUT shipment
    if (user.role !== 'ADMIN' && user.role !== 'INDIVIDUAL' && user.role !== 'COMPANY' && user.role !== 'CARRIER') {
      // console.log(`User role ${user.role} not authorized to PUT shipment.`);
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
    }
    // (request as any).user = user;
    // TODO: Add finer-grained checks, e.g., user.id matches shipment's customer_id or assigned carrierId, or ADMIN role.

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
    const { status, priority, weight, volume, scheduled_pickup, scheduled_delivery, actual_pickup, actual_delivery } =
      await request.json()

    // Check if shipment exists
    const existingShipment = await executeQuery("SELECT * FROM shipments WHERE id = $1", [id])

    if (existingShipment.length === 0) {
      return NextResponse.json({ error: "Shipment not found" }, { status: 404 })
    }

    // Update shipment
    const result = await executeQuery(
      `UPDATE shipments 
       SET status = $1, priority = $2, weight = $3, volume = $4,
           scheduled_pickup = $5, scheduled_delivery = $6,
           actual_pickup = $7, actual_delivery = $8,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [status, priority, weight, volume, scheduled_pickup, scheduled_delivery, actual_pickup, actual_delivery, id],
    )

    // Get related data
    const shipment = result[0]

    const [origin] = await executeQuery("SELECT * FROM locations WHERE id = $1", [shipment.origin_id])
    const [destination] = await executeQuery("SELECT * FROM locations WHERE id = $1", [shipment.destination_id])
    const [customer] = await executeQuery("SELECT name, email FROM users WHERE id = $1", [shipment.customer_id])

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

    return NextResponse.json(shipmentWithDetails)
  } catch (error) {
    console.error("Error updating shipment:", error)
    return NextResponse.json({ error: "Failed to update shipment" }, { status: 500 })
  }
}

// Delete a shipment
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    const user = await prismaDb.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: User not found' }, { status: 401 });
    }
    // Authorization: Check user role for DELETE shipment
    if (user.role !== 'ADMIN' && user.role !== 'INDIVIDUAL' && user.role !== 'COMPANY') {
      // console.log(`User role ${user.role} not authorized to DELETE shipment.`);
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
    }
    // (request as any).user = user;
    // TODO: Add finer-grained checks, e.g., user.id matches shipment's customer_id or ADMIN role.

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

    // Check if shipment exists
    const existingShipment = await executeQuery("SELECT * FROM shipments WHERE id = $1", [id])

    if (existingShipment.length === 0) {
      return NextResponse.json({ error: "Shipment not found" }, { status: 404 })
    }

    // Check if shipment has active routes
    const activeRoutes = await executeQuery(
      `SELECT * FROM routes 
       WHERE shipment_id = $1 
       AND status NOT IN ('completed', 'cancelled')`,
      [id],
    )

    if (activeRoutes.length > 0) {
      return NextResponse.json({ error: "Cannot delete shipment with active routes" }, { status: 400 })
    }

    // Delete associated routes
    await executeQuery("DELETE FROM routes WHERE shipment_id = $1", [id])

    // Delete shipment
    await executeQuery("DELETE FROM shipments WHERE id = $1", [id])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting shipment:", error)
    return NextResponse.json({ error: "Failed to delete shipment" }, { status: 500 })
  }
}
