export const runtime = "nodejs";
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/auth';

// GET /api/messages - Get messages for a support ticket or chat
async function getHandler(req: AuthenticatedRequest) {
    try {
        const { user } = req;
        const ticketId = req.nextUrl.searchParams.get('ticketId');
        
        if (!ticketId) {
            return NextResponse.json({ error: 'Ticket ID is required' }, { status: 400 });
        }

        // Optional: Add logic to ensure user is part of this ticket conversation
        
        const messages = await prisma.chatMessage.findMany({
            where: { supportTicketId: ticketId },
            orderBy: { createdAt: 'asc' },
            include: { user: { select: { id: true, firstName: true, lastName: true, role: true } } },
        });

        return NextResponse.json(messages);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST /api/messages - Create a new message
async function postHandler(req: AuthenticatedRequest) {
    try {
        const { user } = req;
        const body = await req.json();
        const { supportTicketId, content } = body;
        
        if (!supportTicketId || !content) {
            return NextResponse.json({ error: 'Ticket ID and content are required' }, { status: 400 });
        }

        const newMessage = await prisma.chatMessage.create({
            data: {
                supportTicketId,
                content,
                userId: user.id,
            },
        });
        
        return NextResponse.json(newMessage, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export const GET = withAuth(getHandler);
export const POST = withAuth(postHandler);
