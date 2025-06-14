import { type NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { db as prismaDb } from '@/lib/db';

// GET /api/invoices/[id] - Get a specific invoice
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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
  } catch (authError: any) {
    if (authError.name === 'JsonWebTokenError' || authError.name === 'TokenExpiredError') {
      console.error('Token verification error:', authError.message);
      return NextResponse.json({ error: 'Unauthorized: Invalid or expired token' }, { status: 401 });
    }
    console.error('Authentication process error:', authError);
    return NextResponse.json({ error: 'Internal server error during authentication' }, { status: 500 });
  }

  // Original logic for fetching a specific invoice
  try {
    const { id: invoiceId } = params;

    if (!invoiceId) {
      return NextResponse.json({ error: 'Invoice ID is required' }, { status: 400 });
    }

    const invoice = await prismaDb.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        shipment: true, // Include full shipment details if linked
        transactions: true, // Include related transactions
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Authorization: ADMIN sees all, others see their own.
    if (authUser.role !== 'ADMIN' && invoice.userId !== authUser.id) {
      return NextResponse.json({ error: 'Forbidden: You do not have permission to view this invoice' }, { status: 403 });
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error(`Error fetching invoice ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch invoice' }, { status: 500 });
  }
}

// Note: PUT (update) and DELETE handlers for invoices would be added here in a similar fashion.
// For PUT, one might update status (e.g., to SENT, VOID), dueDate, notes, etc.
// Authorization for PUT/DELETE would likely be restricted to ADMIN or the User who owns the invoice (if status is DRAFT).
// These are not implemented in this step as per the current subtask's focus on POST and GET.
