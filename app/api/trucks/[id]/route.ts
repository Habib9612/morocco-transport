export const runtime = "nodejs";
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/auth';

async function getHandler(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
    try {
        const truck = await prisma.truck.findUnique({
            where: { id: params.id },
            include: {
                driver: true,
                company: true,
            }
        });
        if (!truck) {
            return NextResponse.json({ error: "Truck not found" }, { status: 404 });
        }
        return NextResponse.json(truck);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

async function putHandler(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const updatedTruck = await prisma.truck.update({
            where: { id: params.id },
            data: body,
        });
        return NextResponse.json(updatedTruck);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

async function deleteHandler(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
    try {
        await prisma.truck.delete({
            where: { id: params.id },
        });
        return new NextResponse(null, { status: 204 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export const GET = withAuth(getHandler, ['ADMIN', 'COMPANY', 'DRIVER']);
export const PUT = withAuth(putHandler, ['ADMIN', 'COMPANY']);
export const DELETE = withAuth(deleteHandler, ['ADMIN', 'COMPANY']);
