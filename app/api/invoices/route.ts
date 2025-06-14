import { type NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { db as prismaDb, db } from '@/lib/db'; // Using prismaDb for clarity with Prisma Client
import { z } from 'zod';

// Zod schema for invoice creation
const createInvoiceSchema = z.object({
  userId: z.string().cuid('Invalid user ID'),
  shipmentId: z.string().cuid('Invalid shipment ID').optional(),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().min(3, 'Currency code must be at least 3 characters'), // e.g., "MAD", "USD"
  dueDate: z.string().datetime('Invalid due date'), // Expect ISO string
  status: z.enum(['DRAFT', 'SENT', 'PAID', 'VOID', 'OVERDUE']).optional().default('DRAFT'),
  invoiceNumber: z.string().min(1, "Invoice number is required"), // e.g., INV-2024-0001
  notes: z.string().optional(),
});

// POST /api/invoices - Create a new invoice
export async function POST(request: NextRequest) {
  let authUser;
  try {
    const sessionCookie = cookies().get('session');
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'Unauthorized: No session cookie' }, { status: 401 });
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('CRITICAL: JWT_SECRET is not defined.');
      throw new Error('Server configuration error: JWT_SECRET missing.');
    }
    const decoded = verify(sessionCookie.value, jwtSecret) as { userId: string };
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token payload structure' }, { status: 401 });
    }
    authUser = await prismaDb.user.findUnique({ where: { id: decoded.userId } });
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized: User not found' }, { status: 401 });
    }

    // Authorization: Only ADMIN or COMPANY can create invoices
    if (authUser.role !== 'ADMIN' && authUser.role !== 'COMPANY') {
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
    }

  } catch (authError: any) {
    if (authError.name === 'JsonWebTokenError' || authError.name === 'TokenExpiredError') {
      console.error('Token verification error:', authError.message);
      return NextResponse.json({ error: 'Unauthorized: Invalid or expired token' }, { status: 401 });
    }
    console.error('Authentication process error:', authError);
    return NextResponse.json({ error: 'Internal server error during authentication' }, { status: 500 });
  }

  // Original logic for creating invoice
  try {
    const body = await request.json();
    const validation = createInvoiceSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input', details: validation.error.flatten() }, { status: 400 });
    }

    const { userId, shipmentId, amount, currency, dueDate, status, invoiceNumber, notes } = validation.data;

    // TODO: Add logic to ensure invoiceNumber is truly unique, possibly via a sequence or more robust generation.
    // For now, relying on the @unique constraint in Prisma.

    const newInvoice = await prismaDb.invoice.create({
      data: {
        invoiceNumber,
        userId,
        shipmentId,
        amount,
        currency,
        dueDate: new Date(dueDate), // Convert string to Date
        status,
        notes,
        // issueDate is defaulted by Prisma schema
      },
    });
    return NextResponse.json(newInvoice, { status: 201 });
  } catch (error: any) {
    console.error('Error creating invoice:', error);
    if (error.code === 'P2002' && error.meta?.target?.includes('invoiceNumber')) {
        return NextResponse.json({ error: 'Invoice number already exists.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
  }
}

// GET /api/invoices - List invoices
export async function GET(request: NextRequest) {
  let authUser;
  try {
    const sessionCookie = cookies().get('session');
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'Unauthorized: No session cookie' }, { status: 401 });
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('CRITICAL: JWT_SECRET is not defined.');
      throw new Error('Server configuration error: JWT_SECRET missing.');
    }
    const decoded = verify(sessionCookie.value, jwtSecret) as { userId: string };
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token payload structure' }, { status: 401 });
    }
    authUser = await prismaDb.user.findUnique({ where: { id: decoded.userId } });
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized: User not found' }, { status: 401 });
    }
  } catch (authError: any) {
    if (authError.name === 'JsonWebTokenError' || authError.name === 'TokenExpiredError') {
      console.error('Token verification error:', authError.message);
      return NextResponse.json({ error: 'Unauthorized: Invalid or expired token' }, { status: 401 });
    }
    console.error('Authentication process error:', authError);
    return NextResponse.json({ error: 'Internal server error during authentication' }, { status: 500 });
  }

  // Original logic for fetching invoices
  try {
    const { searchParams } = new URL(request.url);
    // Basic pagination (example, can be enhanced)
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    let whereClause: any = {};

    // Authorization: ADMIN sees all, others see their own.
    if (authUser.role !== 'ADMIN') {
      whereClause.userId = authUser.id;
    }

    // Example filter by status
    const statusFilter = searchParams.get('status');
    if (statusFilter) {
        whereClause.status = statusFilter.toUpperCase(); // Assuming status enum is uppercase
    }


    const invoices = await prismaDb.invoice.findMany({
      where: whereClause,
      include: {
        user: { select: { id: true, name: true, email: true } }, // Include some user details
        shipment: { select: { id: true } }, // Include basic shipment id
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: skip,
      take: limit,
    });

    const totalInvoices = await prismaDb.invoice.count({ where: whereClause });

    return NextResponse.json({
      data: invoices,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalInvoices / limit),
        totalResults: totalInvoices,
      },
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  }
}
