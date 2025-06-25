import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/auth-middleware';
import { z } from 'zod';

const createInvoiceSchema = z.object({
  shipmentId: z.string().min(1, 'Shipment ID is required'),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().default('MAD'),
  dueDate: z.string().transform((str) => new Date(str)),
});

const updateInvoiceSchema = z.object({
  amount: z.number().positive('Amount must be positive').optional(),
  currency: z.string().optional(),
  dueDate: z.string().transform((str) => new Date(str)).optional(),
  status: z.enum(['PENDING', 'PAID', 'OVERDUE', 'CANCELLED']).optional(),
});

// GET /api/invoices - Get invoices with pagination and filters
export async function GET(request: NextRequest) {
  const authResult = await withAuth(['USER', 'COMPANY', 'ADMIN'])(request);
  if (authResult instanceof NextResponse) return authResult;
  
  const { user } = authResult;

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const offset = (page - 1) * limit;

    const where: any = {};
    
    // Non-admin users can only see their own invoices
    if (user.role !== 'ADMIN') {
      where.userId = user.id;
    }
    
    if (status) where.status = status;

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
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
              trackingNumber: true,
              pickupAddress: true,
              deliveryAddress: true,
              status: true,
            },
          },
          transactions: {
            select: {
              id: true,
              amount: true,
              type: true,
              status: true,
              createdAt: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.invoice.count({ where }),
    ]);

    return NextResponse.json({
      invoices,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get invoices error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}

// POST /api/invoices - Create a new invoice
export async function POST(request: NextRequest) {
  const authResult = await withAuth(['COMPANY', 'ADMIN'])(request);
  if (authResult instanceof NextResponse) return authResult;
  
  const { user } = authResult;

  try {
    const body = await request.json();
    const result = createInvoiceSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { shipmentId, amount, currency, dueDate } = result.data;

    // Verify shipment exists and user has permission
    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
      include: {
        sender: true,
        invoice: true,
      },
    });

    if (!shipment) {
      return NextResponse.json(
        { error: 'Shipment not found' },
        { status: 404 }
      );
    }

    // Check if invoice already exists
    if (shipment.invoice) {
      return NextResponse.json(
        { error: 'Invoice already exists for this shipment' },
        { status: 400 }
      );
    }

    // Only admin or shipment sender can create invoice
    if (user.role !== 'ADMIN' && shipment.senderId !== user.id) {
      return NextResponse.json(
        { error: 'You can only create invoices for your own shipments' },
        { status: 403 }
      );
    }

    const invoice = await prisma.invoice.create({
      data: {
        shipmentId,
        userId: shipment.senderId,
        amount,
        currency,
        dueDate,
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
            trackingNumber: true,
            pickupAddress: true,
            deliveryAddress: true,
            status: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: 'Invoice created successfully',
      invoice,
    }, { status: 201 });
  } catch (error) {
    console.error('Create invoice error:', error);
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}
