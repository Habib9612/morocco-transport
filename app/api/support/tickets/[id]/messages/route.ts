import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/auth-middleware';
import { z } from 'zod';

const createMessageSchema = z.object({
  content: z.string().min(1, 'Message content is required'),
});

// GET /api/support/tickets/[id]/messages - Get messages for a ticket
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await withAuth(['USER', 'COMPANY', 'ADMIN'])(request);
  if (authResult instanceof NextResponse) return authResult;
  
  const { user } = authResult;

  try {
    // Check if ticket exists and user has permission
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: params.id },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Non-admin users can only see messages for their own tickets
    if (user.role !== 'ADMIN' && ticket.userId !== user.id) {
      return NextResponse.json(
        { error: 'You can only view messages for your own tickets' },
        { status: 403 }
      );
    }

    const messages = await prisma.chatMessage.findMany({
      where: {
        supportTicketId: params.id,
      },
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
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// POST /api/support/tickets/[id]/messages - Add a message to a ticket
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await withAuth(['USER', 'COMPANY', 'ADMIN'])(request);
  if (authResult instanceof NextResponse) return authResult;
  
  const { user } = authResult;

  try {
    const body = await request.json();
    const result = createMessageSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    // Check if ticket exists and user has permission
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: params.id },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Non-admin users can only add messages to their own tickets
    if (user.role !== 'ADMIN' && ticket.userId !== user.id) {
      return NextResponse.json(
        { error: 'You can only add messages to your own tickets' },
        { status: 403 }
      );
    }

    const { content } = result.data;

    const message = await prisma.chatMessage.create({
      data: {
        supportTicketId: params.id,
        senderId: user.id,
        content,
      },
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
    });

    // Update ticket status if it was resolved/closed and user is adding a message
    if (user.role !== 'ADMIN' && (ticket.status === 'RESOLVED' || ticket.status === 'CLOSED')) {
      await prisma.supportTicket.update({
        where: { id: params.id },
        data: { status: 'OPEN' },
      });
    }

    return NextResponse.json({
      message: 'Message added successfully',
      chatMessage: message,
    }, { status: 201 });
  } catch (error) {
    console.error('Create message error:', error);
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    );
  }
}
