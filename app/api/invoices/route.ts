export const runtime = "nodejs";
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/auth';

// GET /api/invoices - Get all invoices
async function getHandler(req: AuthenticatedRequest) {
    try {
        const { user } = req;
        const where = user.role === 'ADMIN' ? {} : { userId: user.id };
        const invoices = await prisma.invoice.findMany({ where });
        return NextResponse.json(invoices);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST /api/invoices - Create a new invoice
async function postHandler(req: AuthenticatedRequest) {
    try {
        const { user } = req;
        const body = await req.json();
        const newInvoice = await prisma.invoice.create({
            data: { ...body, userId: user.id },
        });
        return NextResponse.json(newInvoice, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export const GET = withAuth(getHandler);
export const POST = withAuth(postHandler);
