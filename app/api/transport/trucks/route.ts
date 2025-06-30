export const runtime = "nodejs";
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { withAuth, AuthenticatedRequest } from '@/lib/auth';

const createTruckSchema = z.object({
  // ... (schema remains the same)
});

async function getHandler(req: NextRequest) {
  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const status = searchParams.get('status');
  const location = searchParams.get('location');

  const skip = (page - 1) * limit;
  
  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (location) where.currentLocation = { contains: location };

  const [trucks, total] = await Promise.all([
    prisma.truck.findMany({
      where,
      skip,
      take: limit,
      include: {
        driver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        currentShipment: {
          select: {
            id: true,
            trackingNumber: true,
            destination: true,
            estimatedArrival: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.truck.count({ where }),
  ]);

  return NextResponse.json({
    trucks,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}

async function postHandler(req: AuthenticatedRequest) {
  if (!req.auth || req.auth.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const {
    licensePlate,
    model,
    year,
    capacity,
    fuelType,
    driverId,
  } = await req.json();

  if (!licensePlate || !model || !year || !capacity) {
    return NextResponse.json(
      { error: 'Required fields missing' },
      { status: 400 }
    );
  }

  const truck = await prisma.truck.create({
    data: {
      licensePlate,
      model,
      year,
      capacity,
      fuelType: fuelType || 'DIESEL',
      driverId,
      status: 'AVAILABLE',
    },
    include: {
      driver: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phone: true,
        },
      },
    },
  });

  return NextResponse.json({
    message: 'Truck created successfully',
    truck,
  }, { status: 201 });
}

export const GET = getHandler; // Public route
export const POST = withAuth(postHandler, ['ADMIN', 'COMPANY']);
