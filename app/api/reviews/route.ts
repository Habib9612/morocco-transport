import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/auth-middleware';
import { z } from 'zod';

const createReviewSchema = z.object({
  shipmentId: z.string().min(1, 'Shipment ID is required'),
  rating: z.number().min(1).max(5, 'Rating must be between 1 and 5'),
  comment: z.string().optional(),
  driverId: z.string().optional(),
});

// GET /api/reviews - Get reviews with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const shipmentId = searchParams.get('shipmentId');
    const driverId = searchParams.get('driverId');
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (shipmentId) where.shipmentId = shipmentId;
    if (driverId) where.driverId = driverId;
    if (userId) where.userId = userId;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          shipment: {
            select: {
              id: true,
              origin: true,
              destination: true,
              status: true,
            },
          },
          driver: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.review.count({ where }),
    ]);

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST /api/reviews - Create a new review
export async function POST(request: NextRequest) {
  const authResult = await withAuth(['USER', 'COMPANY'])(request);
  if (authResult instanceof NextResponse) return authResult;
  
  const { user } = authResult;

  try {
    const body = await request.json();
    const result = createReviewSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { shipmentId, rating, comment, driverId } = result.data;

    // Verify shipment exists and user has permission to review it
    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
      include: {
        user: true,
        driver: true,
      },
    });

    if (!shipment) {
      return NextResponse.json(
        { error: 'Shipment not found' },
        { status: 404 }
      );
    }

    // Only the shipment owner can create a review
    if (shipment.userId !== user.id) {
      return NextResponse.json(
        { error: 'You can only review your own shipments' },
        { status: 403 }
      );
    }

    // Check if shipment is completed
    if (shipment.status !== 'DELIVERED') {
      return NextResponse.json(
        { error: 'You can only review completed shipments' },
        { status: 400 }
      );
    }

    // Check if review already exists
    const existingReview = await prisma.review.findFirst({
      where: {
        shipmentId,
        userId: user.id,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this shipment' },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        shipmentId,
        userId: user.id,
        driverId: driverId || shipment.driverId,
        rating,
        comment,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        shipment: {
          select: {
            id: true,
            origin: true,
            destination: true,
            status: true,
          },
        },
        driver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: 'Review created successfully',
      review,
    }, { status: 201 });
  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}
