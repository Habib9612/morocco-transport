export const runtime = "nodejs";
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createMessageSchema = z.object({
  content: z.string().min(1, 'Message content is required'),
});

// GET /api/support/tickets/[id]/messages - Get messages for a ticket
export const GET = async (req) => {
  if (!req.auth?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = req.url.split('/').pop();

  try {
    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    if (req.auth.user.role !== 'ADMIN' && ticket.userId !== req.auth.user.id) {
      return NextResponse.json(
        { error: 'You can only view messages for your own tickets' },
        { status: 403 }
      );
    }

    const messages = await prisma.chatMessage.findMany({
      where: {
        supportTicketId: id,
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
};

// POST /api/support/tickets/[id]/messages - Add a message to a ticket
export const POST = async (req) => {
  if (!req.auth?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = req.url.split('/').pop();

  try {
    const body = await req.json();
    const result = createMessageSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    if (req.auth.user.role !== 'ADMIN' && ticket.userId !== req.auth.user.id) {
      return NextResponse.json(
        { error: 'You can only add messages to your own tickets' },
        { status: 403 }
      );
    }

    const { content } = result.data;

    const message = await prisma.chatMessage.create({
      data: {
        supportTicketId: id,
        senderId: req.auth.user.id,
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

    if (req.auth.user.role !== 'ADMIN' && (ticket.status === 'RESOLVED' || ticket.status === 'CLOSED')) {
      await prisma.supportTicket.update({
        where: { id },
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
};
