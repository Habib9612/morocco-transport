import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/auth-middleware';
import { z } from 'zod';

const createTicketSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  description: z.string().min(1, 'Description is required'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
});

const updateTicketSchema = z.object({
  subject: z.string().min(1, 'Subject is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  assignedTo: z.string().optional(),
});

// GET /api/support/tickets - Get support tickets
export async function GET(request: NextRequest) {
  const authResult = await withAuth(['USER', 'COMPANY', 'ADMIN'])(request);
  if (authResult instanceof NextResponse) return authResult;
  
  const { user } = authResult;

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const offset = (page - 1) * limit;

    const where: any = {};
    
    // Non-admin users can only see their own tickets
    if (user.role !== 'ADMIN') {
      where.userId = user.id;
    }
    
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const [tickets, total] = await Promise.all([
      prisma.supportTicket.findMany({
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
          _count: {
            select: {
              messages: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.supportTicket.count({ where }),
    ]);

    return NextResponse.json({
      tickets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get tickets error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}

// POST /api/support/tickets - Create a new support ticket
export async function POST(request: NextRequest) {
  const authResult = await withAuth(['USER', 'COMPANY'])(request);
  if (authResult instanceof NextResponse) return authResult;
  
  const { user } = authResult;

  try {
    const body = await request.json();
    const result = createTicketSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { subject, description, priority } = result.data;

    const ticket = await prisma.supportTicket.create({
      data: {
        userId: user.id,
        subject,
        description,
        priority,
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
      },
    });

    return NextResponse.json({
      message: 'Support ticket created successfully',
      ticket,
    }, { status: 201 });
  } catch (error) {
    console.error('Create ticket error:', error);
    return NextResponse.json(
      { error: 'Failed to create ticket' },
      { status: 500 }
    );
  }
}
