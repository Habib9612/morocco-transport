import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const sessionCookie = cookies().get('session');

    if (!sessionCookie?.value) {
      return NextResponse.json({ user: null });
    }

    // Verify token
    const decoded = verify(
      sessionCookie.value,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as { userId: string };

    // Get user from database
    const user = await db.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        company: true,
        phone: true,
        avatar: true,
      },
    });

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ user: null });
  }
} 