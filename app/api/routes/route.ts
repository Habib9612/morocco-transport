export const runtime = "nodejs";
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/auth';

async function getHandler(req: AuthenticatedRequest) {
    try {
        const routes = await prisma.route.findMany({
            where: { isActive: true }, // Example filter
        });
        return NextResponse.json(routes);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

async function postHandler(req: AuthenticatedRequest) {
    try {
        const body = await req.json();
        const newRoute = await prisma.route.create({
            data: body,
        });
        return NextResponse.json(newRoute, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export const GET = withAuth(getHandler, ['ADMIN', 'COMPANY', 'DRIVER']);
export const POST = withAuth(postHandler, ['ADMIN', 'COMPANY']);
