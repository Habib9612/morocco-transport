import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyJWT(request);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const location = searchParams.get('location');

    const skip = (page - 1) * limit;
    
    const where: any = {};
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

  } catch (error) {
    console.error('Get trucks error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyJWT(request);
    if (!authResult.success || authResult.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const {
      licensePlate,
      model,
      year,
      capacity,
      fuelType,
      driverId,
    } = await request.json();

    // Validation
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

  } catch (error) {
    console.error('Create truck error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
