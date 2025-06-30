export const runtime = "nodejs";
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/auth';

// GET /api/trucks - Get all trucks
async function getHandler(req: AuthenticatedRequest) {
    try {
        const { user } = req;
        const where: any = {};
        
        if (user.role === 'COMPANY') {
            const companies = await prisma.company.findMany({
                where: { ownerId: user.id },
                select: { id: true }
            });
            const companyIds = companies.map(c => c.id);
            where.companyId = { in: companyIds };
        } else if (user.role === 'DRIVER') {
            where.driverId = user.id;
        }

        const trucks = await prisma.truck.findMany({
            where,
            include: {
                driver: true,
                company: true,
            },
        });
        return NextResponse.json(trucks);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST /api/trucks - Create a new truck
async function postHandler(req: AuthenticatedRequest) {
    try {
        const { user } = req;
        const body = await req.json();

        // When a company user creates a truck, we need to find their company first.
        if (user.role === 'COMPANY') {
            const company = await prisma.company.findFirst({
                where: { ownerId: user.id }
            });
            if (company) {
                body.companyId = company.id;
            } else {
                return NextResponse.json({ error: "User is not associated with a company." }, { status: 400 });
            }
        }
        
        const newTruck = await prisma.truck.create({
            data: body,
        });
        
        return NextResponse.json(newTruck, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


export const GET = withAuth(getHandler, ['ADMIN', 'COMPANY', 'DRIVER']);
export const POST = withAuth(postHandler, ['ADMIN', 'COMPANY']);
