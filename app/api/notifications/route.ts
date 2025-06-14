import { type NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { db as prismaDb } from '@/lib/db'; // For user lookup during auth
import { getUserNotifications } from '@/lib/notificationService'; // Service function

export async function GET(request: NextRequest) {
  let authUser;
  try {
    const sessionCookie = cookies().get('session');
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'Unauthorized: No session cookie' }, { status: 401 });
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('CRITICAL: JWT_SECRET is not defined.');
      throw new Error('Server configuration error: JWT_SECRET missing.');
    }
    const decoded = verify(sessionCookie.value, jwtSecret) as { userId: string };
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token payload structure' }, { status: 401 });
    }
    authUser = await prismaDb.user.findUnique({ where: { id: decoded.userId } });
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized: User not found' }, { status: 401 });
    }
    // All authenticated users can access their own notifications. No specific role check needed beyond this.

  } catch (authError: any) {
    if (authError.name === 'JsonWebTokenError' || authError.name === 'TokenExpiredError') {
      console.error('Token verification error:', authError.message);
      return NextResponse.json({ error: 'Unauthorized: Invalid or expired token' }, { status: 401 });
    }
    console.error('Authentication process error:', authError);
    return NextResponse.json({ error: 'Internal server error during authentication' }, { status: 500 });
  }

  // Logic for fetching notifications
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    let readStatus: boolean | undefined = undefined;
    const readParam = searchParams.get('read');
    if (readParam === 'true') {
      readStatus = true;
    } else if (readParam === 'false') {
      readStatus = false;
    }

    const notificationsResult = await getUserNotifications(authUser.id, readStatus, page, limit);

    return NextResponse.json(notificationsResult);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}
