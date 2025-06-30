export const runtime = "nodejs";
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/auth';

async function getHandler(req: AuthenticatedRequest) {
    try {
        const { user } = req;
        const where: any = {};

        if (user.role !== 'ADMIN') {
            where.OR = [
                { senderId: user.id },
                { receiverId: user.id },
            ];
            if (user.companyId) {
                where.OR.push({ companyId: user.companyId });
            }
        }

        const shipments = await prisma.shipment.findMany({
            where,
            include: {
                sender: true,
                receiver: true,
                truck: true,
            },
        });
        return NextResponse.json(shipments);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

async function postHandler(req: AuthenticatedRequest) {
    try {
        const { user } = req;
        const body = await req.json();
        
        const newShipment = await prisma.shipment.create({
            data: {
                ...body,
                senderId: user.id, // Set the sender as the currently authenticated user
            },
        });
        
        return NextResponse.json(newShipment, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export const GET = withAuth(getHandler);
export const POST = withAuth(postHandler);
