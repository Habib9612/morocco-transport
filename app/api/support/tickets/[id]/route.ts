import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/auth-middleware';
import { z } from 'zod';

const updateTicketSchema = z.object({
  subject: z.string().min(1, 'Subject is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  assignedTo: z.string().optional(),
});

// GET /api/support/tickets/[id] - Get a specific ticket
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await withAuth(['USER', 'COMPANY', 'ADMIN'])(request);
  if (authResult instanceof NextResponse) return authResult;
  
  const { user } = authResult;

  try {
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                role: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Non-admin users can only see their own tickets
    if (user.role !== 'ADMIN' && ticket.userId !== user.id) {
      return NextResponse.json(
        { error: 'You can only view your own tickets' },
        { status: 403 }
      );
    }

    return NextResponse.json({ ticket });
  } catch (error) {
    console.error('Get ticket error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ticket' },
      { status: 500 }
    );
  }
}

// PUT /api/support/tickets/[id] - Update a ticket
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await withAuth(['USER', 'COMPANY', 'ADMIN'])(request);
  if (authResult instanceof NextResponse) return authResult;
  
  const { user } = authResult;

  try {
    const body = await request.json();
    const result = updateTicketSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    // Check if ticket exists
    const existingTicket = await prisma.supportTicket.findUnique({
      where: { id: params.id },
    });

    if (!existingTicket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Non-admin users can only update their own tickets and limited fields
    if (user.role !== 'ADMIN') {
      if (existingTicket.userId !== user.id) {
        return NextResponse.json(
          { error: 'You can only update your own tickets' },
          { status: 403 }
        );
      }
      
      // Users can only update subject and description
      const allowedFields = ['subject', 'description'];
      const updateData = Object.keys(result.data)
        .filter(key => allowedFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = result.data[key];
          return obj;
        }, {});
      
      if (Object.keys(updateData).length === 0) {
        return NextResponse.json(
          { error: 'No valid fields to update' },
          { status: 400 }
        );
      }
      
      result.data = updateData;
    }

    const updatedTicket = await prisma.supportTicket.update({
      where: { id: params.id },
      data: result.data,
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
      message: 'Ticket updated successfully',
      ticket: updatedTicket,
    });
  } catch (error) {
    console.error('Update ticket error:', error);
    return NextResponse.json(
      { error: 'Failed to update ticket' },
      { status: 500 }
    );
  }
}
