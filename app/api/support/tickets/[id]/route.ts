export const runtime = "nodejs";
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/support/tickets/[id] - Get a specific ticket
export const GET = async (req) => {
  if (!req.auth?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = req.url.split('/').pop();

  try {
    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
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
              },
            },
          },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    if (req.auth.user.role !== 'ADMIN') {
      if (ticket.userId !== req.auth.user.id) {
        return NextResponse.json(
          { error: 'You can only update your own tickets' },
          { status: 403 }
        );
      }
    }

    return NextResponse.json({ ticket });
  } catch (error) {
    console.error('Get ticket error', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};

// PUT /api/support/tickets/[id] - Update a specific ticket
export const PUT = async (req) => {
  if (!req.auth?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = req.url.split('/').pop();

  try {
    const existingTicket = await prisma.supportTicket.findUnique({
      where: { id },
    });

    if (!existingTicket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    if (req.auth.user.role !== 'ADMIN') {
      if (existingTicket.userId !== req.auth.user.id) {
        return NextResponse.json(
          { error: 'You can only update your own tickets' },
          { status: 403 }
        );
      }
    }

    const allowedFields = ['subject', 'description'];
    const body = await req.json();
    const updateData: { [key: string]: string } = {};
    
    allowedFields
      .filter(key => body.hasOwnProperty(key))
      .forEach(key => {
        updateData[key] = body[key];
      });

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    const updatedTicket = await prisma.supportTicket.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json({ ticket: updatedTicket });
  } catch (error) {
    console.error('Update ticket error', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};

// DELETE /api/support/tickets/[id] - Delete a specific ticket
export const DELETE = async (req) => {
  if (!req.auth?.user?.role || req.auth.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = req.url.split('/').pop();

  try {
    await prisma.supportTicket.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error('Delete ticket error', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};