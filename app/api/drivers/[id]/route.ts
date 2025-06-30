export const runtime = "nodejs";
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/auth';

// GET /api/drivers/[id] - Get a specific driver
async function getHandler(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
    try {
        const driver = await prisma.user.findUnique({
            where: { id: params.id, role: 'DRIVER' },
            include: { profile: true },
        });

        if (!driver) {
            return NextResponse.json({ error: "Driver not found" }, { status: 404 });
        }
        return NextResponse.json(driver);
    } catch (error: any) {
        console.error("Error fetching driver:", error);
        return NextResponse.json({ error: error.message || "Failed to fetch driver" }, { status: 500 });
    }
}

// PUT /api/drivers/[id] - Update a specific driver
async function putHandler(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
    try {
        const data = await req.json();
        const updatedDriver = await prisma.user.update({
            where: { id: params.id, role: 'DRIVER' },
            data: data, // Make sure 'data' only contains valid User fields
        });
        return NextResponse.json(updatedDriver);
    } catch (error: any) {
        console.error("Error updating driver:", error);
        return NextResponse.json({ error: error.message || "Failed to update driver" }, { status: 500 });
    }
}

// DELETE /api/drivers/[id] - Deactivate a driver
async function deleteHandler(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
    try {
        // Instead of deleting, we deactivate the user
        await prisma.user.update({
            where: { id: params.id, role: 'DRIVER' },
            data: { isActive: false },
        });
        return NextResponse.json({ success: true, message: "Driver deactivated successfully" });
    } catch (error: any) {
        console.error("Error deleting driver:", error);
        return NextResponse.json({ error: error.message || "Failed to delete driver" }, { status: 500 });
    }
}


export const GET = withAuth(getHandler, ['ADMIN', 'COMPANY']);
export const PUT = withAuth(putHandler, ['ADMIN', 'COMPANY']);
export const DELETE = withAuth(deleteHandler, ['ADMIN', 'COMPANY']);
