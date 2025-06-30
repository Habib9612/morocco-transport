export const runtime = "nodejs";
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/auth';

// GET /api/maintenance - Get all maintenance logs
async function getHandler(req: AuthenticatedRequest) {
    try {
        const { user } = req;
        const where: any = {};
        
        // Non-admins can only see their own company's maintenance logs
        if (user.role !== 'ADMIN' && user.companyId) {
             const trucks = await prisma.truck.findMany({
                 where: { companyId: user.companyId },
                 select: { id: true }
             });
             const truckIds = trucks.map(t => t.id);
             where.truckId = { in: truckIds };
        } else if (user.role !== 'ADMIN') {
            // Or if they are a driver, their own truck's logs
            const trucks = await prisma.truck.findMany({
                where: { driverId: user.id },
                select: { id: true }
            });
            const truckIds = trucks.map(t => t.id);
            where.truckId = { in: truckIds };
        }

        const logs = await prisma.maintenanceLog.findMany({ where });
        return NextResponse.json(logs);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST /api/maintenance - Create a new maintenance log
async function postHandler(req: AuthenticatedRequest) {
    try {
        const body = await req.json();
        const newLog = await prisma.maintenanceLog.create({
            data: body,
        });
        return NextResponse.json(newLog, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export const GET = withAuth(getHandler, ['ADMIN', 'COMPANY', 'DRIVER']);
export const POST = withAuth(postHandler, ['ADMIN', 'COMPANY']);
