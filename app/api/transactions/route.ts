import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/auth-middleware';
import { z } from 'zod';

const createTransactionSchema = z.object({
  invoiceId: z.string().optional(),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().default('MAD'),
  type: z.enum(['PAYMENT', 'REFUND', 'FEE']),
  reference: z.string().optional(),
  description: z.string().optional(),
});

// GET /api/transactions - Get transactions with pagination and filters
export async function GET(request: NextRequest) {
  const authResult = await withAuth(['USER', 'COMPANY', 'ADMIN'])(request);
  if (authResult instanceof NextResponse) return authResult;
  
  const { user } = authResult;

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const invoiceId = searchParams.get('invoiceId');
    const offset = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    
    // Non-admin users can only see their own transactions
    if (user.role !== 'ADMIN') {
      where.userId = user.id;
    }
    
    if (type) where.type = type;
    if (status) where.status = status;
    if (invoiceId) where.invoiceId = invoiceId;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
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
          invoice: {
            select: {
              id: true,
              amount: true,
              status: true,
              shipment: {
                select: {
                  id: true,
                  trackingNumber: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ]);

    return NextResponse.json({
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

// POST /api/transactions - Create a new transaction
export async function POST(request: NextRequest) {
  const authResult = await withAuth(['USER', 'COMPANY', 'ADMIN'])(request);
  if (authResult instanceof NextResponse) return authResult;
  
  const { user } = authResult;

  try {
    const body = await request.json();
    const result = createTransactionSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { invoiceId, amount, currency, type, reference, description } = result.data;

    // If invoiceId is provided, verify invoice exists and user has permission
    if (invoiceId) {
      const invoice = await prisma.invoice.findUnique({
        where: { id: invoiceId },
        include: {
          user: true,
        },
      });

      if (!invoice) {
        return NextResponse.json(
          { error: 'Invoice not found' },
          { status: 404 }
        );
      }

      // Only admin or invoice owner can create transactions for invoice
      if (user.role !== 'ADMIN' && invoice.userId !== user.id) {
        return NextResponse.json(
          { error: 'You can only create transactions for your own invoices' },
          { status: 403 }
        );
      }
    }

    const transaction = await prisma.transaction.create({
      data: {
        invoiceId,
        userId: user.id,
        amount,
        currency,
        type,
        reference,
        description,
        status: 'PENDING', // Default status
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
        invoice: {
          select: {
            id: true,
            amount: true,
            status: true,
            shipment: {
              select: {
                id: true,
                trackingNumber: true,
              },
            },
          },
        },
      },
    });

    // If this is a payment transaction, check if invoice should be marked as paid
    if (invoiceId && type === 'PAYMENT') {
      const invoice = await prisma.invoice.findUnique({
        where: { id: invoiceId },
        include: {
          transactions: {
            where: {
              type: 'PAYMENT',
              status: 'COMPLETED',
            },
          },
        },
      });

      if (invoice) {
        const totalPaid = invoice.transactions.reduce((sum: number, t: { amount: number }) => sum + t.amount, 0);
        if (totalPaid >= invoice.amount) {
          await prisma.invoice.update({
            where: { id: invoiceId },
            data: {
              status: 'PAID',
              paidAt: new Date(),
            },
          });
        }
      }
    }

    return NextResponse.json({
      message: 'Transaction created successfully',
      transaction,
    }, { status: 201 });
  } catch (error) {
    console.error('Create transaction error:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}
