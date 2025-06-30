export const runtime = "nodejs";
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/auth';

async function getHandler(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
    try {
        const log = await prisma.maintenanceLog.findUnique({
            where: { id: params.id },
        });
        if (!log) {
            return NextResponse.json({ error: "Maintenance log not found" }, { status: 404 });
        }
        return NextResponse.json(log);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

async function putHandler(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const updatedLog = await prisma.maintenanceLog.update({
            where: { id: params.id },
            data: body,
        });
        return NextResponse.json(updatedLog);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

async function deleteHandler(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
    try {
        await prisma.maintenanceLog.delete({
            where: { id: params.id },
        });
        return new NextResponse(null, { status: 204 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


export const GET = withAuth(getHandler, ['ADMIN', 'COMPANY']);
export const PUT = withAuth(putHandler, ['ADMIN', 'COMPANY']);
export const DELETE = withAuth(deleteHandler, ['ADMIN', 'COMPANY']);
