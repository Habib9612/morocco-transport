export const runtime = "nodejs";
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/auth';
import { hashPassword } from '@/lib/auth'; // Assuming you have a hash function

// GET /api/drivers - Get all drivers
async function getHandler(req: AuthenticatedRequest) {
    try {
        const drivers = await prisma.user.findMany({
            where: { role: 'DRIVER' },
            include: { profile: true },
        });
        return NextResponse.json(drivers);
    } catch (error: any) {
        console.error("Error fetching drivers:", error);
        return NextResponse.json({ error: error.message || "Failed to fetch drivers" }, { status: 500 });
    }
}

// POST /api/drivers - Create a new driver
async function postHandler(req: AuthenticatedRequest) {
    try {
        const body = await req.json();
        const { email, password, firstName, lastName, phone, ...profileData } = body;

        // Basic validation
        if (!email || !password || !firstName || !lastName) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const hashedPassword = await hashPassword(password);
        
        const newDriver = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                phone,
                role: 'DRIVER',
                profile: {
                    create: profileData,
                },
            },
        });
        return NextResponse.json(newDriver, { status: 201 });
    } catch (error: any) {
        console.error("Error creating driver:", error);
        return NextResponse.json({ error: error.message || "Failed to create driver" }, { status: 500 });
    }
}


export const GET = withAuth(getHandler, ['ADMIN', 'COMPANY']);
export const POST = withAuth(postHandler, ['ADMIN', 'COMPANY']);
