import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { auth } from "@/lib/auth"

// Get a specific driver
export const GET = auth(async (req) => {
  if (!req.auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = req.url.split('/').pop();

  try {
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
});

// Update a driver
export const PUT = auth(async (req) => {
  if (!req.auth || req.auth.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const id = req.url.split('/').pop();
  const { license_number, license_expiry_date, phone_number, status, rating } = await req.json();

  try {
    const existingDriver = await executeQuery("SELECT * FROM drivers WHERE id = $1", [id])

    if (existingDriver.length === 0) {
      return NextResponse.json({ error: "Driver not found" }, { status: 404 })
    }

    const result = await executeQuery(
      `UPDATE drivers 
       SET license_number = $1, license_expiry_date = $2, phone_number = $3, 
           status = $4, rating = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
      [license_number, license_expiry_date, phone_number, status, rating, id],
    )

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
});

// Delete a driver
export const DELETE = auth(async (req) => {
  if (!req.auth || req.auth.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const id = req.url.split('/').pop();

  try {
    const existingDriver = await executeQuery("SELECT * FROM drivers WHERE id = $1", [id])

    if (existingDriver.length === 0) {
      return NextResponse.json({ error: "Driver not found" }, { status: 404 })
    }

    const activeRoutes = await executeQuery(
      `SELECT * FROM routes 
       WHERE driver_id = $1 
       AND status NOT IN ('completed', 'cancelled')`,
      [id],
    )

    if (activeRoutes.length > 0) {
      return NextResponse.json({ error: "Cannot delete driver that is assigned to active routes" }, { status: 400 })
    }

    await executeQuery("DELETE FROM drivers WHERE id = $1", [id])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting driver:", error)
    return NextResponse.json({ error: "Failed to delete driver" }, { status: 500 })
  }
});
