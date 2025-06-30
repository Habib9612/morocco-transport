export const runtime = "nodejs";
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/auth';
import { hashPassword } from '@/lib/auth';

// GET /api/users - Get all users (ADMIN only)
async function getHandler(req: AuthenticatedRequest) {
    try {
        const users = await prisma.user.findMany({
            include: {
                profile: true,
            },
        });
        return NextResponse.json(users);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST /api/users - Create a new user (ADMIN only)
async function postHandler(req: AuthenticatedRequest) {
    try {
        const body = await req.json();
        const { email, password, firstName, lastName, role } = body;

        if (!email || !password || !firstName || !lastName || !role) {
             return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        
        const hashedPassword = await hashPassword(password);

        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                role
            },
        });
        
        return NextResponse.json(newUser, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


export const GET = withAuth(getHandler, ['ADMIN']);
export const POST = withAuth(postHandler, ['ADMIN']);
