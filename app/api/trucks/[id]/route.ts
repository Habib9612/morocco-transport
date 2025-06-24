import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// Get a specific truck
export const GET = auth(async (req) => {
  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = req.url.split('/').pop();

  try {
    const truck = await prisma.truck.findUnique({
      where: { id: id },
    });

    if (!truck) {
      return NextResponse.json({ error: 'Truck not found' }, { status: 404 });
    }

    return NextResponse.json(truck);
  } catch (error) {
    console.error('Error fetching truck:', error);
    return NextResponse.json(
      { error: 'Failed to fetch truck' },
      { status: 500 }
    );
  }
});

// Update a truck
export const PUT = auth(async (req) => {
  if (!req.auth || req.auth.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = req.url.split('/').pop();

  try {
    const body = await req.json();
    const updatedTruck = await prisma.truck.update({
      where: { id: id },
      data: body,
    });

    return NextResponse.json(updatedTruck);
  } catch (error) {
    console.error('Error updating truck:', error);
    return NextResponse.json(
      { error: 'Failed to update truck' },
      { status: 500 }
    );
  }
});

// Delete a truck
export const DELETE = auth(async (req) => {
  if (!req.auth || req.auth.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = req.url.split('/').pop();

  try {
    // Check if truck is being used in any active routes
    const activeRoutes = await prisma.route.findMany({
      where: {
        truckId: id,
        status: {
          notIn: ['COMPLETED', 'CANCELLED'],
        },
      },
    });

    if (activeRoutes.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete truck that is assigned to active routes' },
        { status: 400 }
      );
    }

    await prisma.truck.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: 'Truck deleted successfully' });
  } catch (error) {
    console.error('Error deleting truck:', error);
    return NextResponse.json(
      { error: 'Failed to delete truck' },
      { status: 500 }
    );
  }
});