export const runtime = "nodejs";
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/auth';

async function getHandler(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
    try {
        const { user: requestingUser } = req;
        const targetUserId = params.id;

        // Admins can get any user. Other users can only get their own profile.
        if (requestingUser.role !== 'ADMIN' && requestingUser.id !== targetUserId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const user = await prisma.user.findUnique({
            where: { id: targetUserId },
            include: { profile: true, companies: true }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        return NextResponse.json(user);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

async function putHandler(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
    try {
        // ... (similar authorization logic as GET)
        const body = await req.json();
        const updatedUser = await prisma.user.update({
            where: { id: params.id },
            data: body,
        });
        return NextResponse.json(updatedUser);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

async function deleteHandler(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
    try {
        // ... (similar authorization logic, only ADMIN should delete)
        await prisma.user.delete({
            where: { id: params.id },
        });
        return new NextResponse(null, { status: 204 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export const GET = withAuth(getHandler);
export const PUT = withAuth(putHandler);
export const DELETE = withAuth(deleteHandler, ['ADMIN']);
