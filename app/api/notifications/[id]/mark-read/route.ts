import { type NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { db as prismaDb } from '@/lib/db'; // For user lookup during auth
import { markNotificationAsRead } from '@/lib/notificationService'; // Service function

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
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
    // All authenticated users can mark their own notifications as read. Authorization is handled by the service.

  } catch (authError: any) {
    if (authError.name === 'JsonWebTokenError' || authError.name === 'TokenExpiredError') {
      console.error('Token verification error:', authError.message);
      return NextResponse.json({ error: 'Unauthorized: Invalid or expired token' }, { status: 401 });
    }
    console.error('Authentication process error:', authError);
    return NextResponse.json({ error: 'Internal server error during authentication' }, { status: 500 });
  }

  // Logic for marking notification as read
  try {
    const { id: notificationId } = params;

    if (!notificationId) {
      return NextResponse.json({ error: 'Notification ID is required' }, { status: 400 });
    }

    const updatedNotification = await markNotificationAsRead(notificationId, authUser.id);

    if (!updatedNotification) {
      // This case can occur if the notification wasn't found.
      // The service function itself could throw an error for not found or unauthorized,
      // which would be caught by the generic catch block below.
      // Or, if it returns null for "not found", handle it here.
      return NextResponse.json({ error: 'Notification not found or not owned by user' }, { status: 404 });
    }

    return NextResponse.json(updatedNotification);
  } catch (error: any) {
    console.error(`Error marking notification ${params.id} as read:`, error);
    if (error.message.includes('authorized')) { // Check for specific auth error from service
        return NextResponse.json({ error: 'Forbidden: You do not have permission to modify this notification' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to mark notification as read' }, { status: 500 });
  }
}
