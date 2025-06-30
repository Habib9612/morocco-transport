export const runtime = "nodejs";
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/auth';

async function getHandler(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
    try {
        const shipment = await prisma.shipment.findUnique({
            where: { id: params.id },
            include: {
                sender: true,
                receiver: true,
                truck: true,
            }
        });
        if (!shipment) {
            return NextResponse.json({ error: "Shipment not found" }, { status: 404 });
        }
        return NextResponse.json(shipment);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

async function putHandler(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const updatedShipment = await prisma.shipment.update({
            where: { id: params.id },
            data: body,
        });
        return NextResponse.json(updatedShipment);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

async function deleteHandler(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
    try {
        await prisma.shipment.delete({
            where: { id: params.id },
        });
        return new NextResponse(null, { status: 204 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export const GET = withAuth(getHandler);
export const PUT = withAuth(putHandler, ['ADMIN', 'COMPANY']);
export const DELETE = withAuth(deleteHandler, ['ADMIN', 'COMPANY']);
