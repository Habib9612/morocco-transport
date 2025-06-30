import { NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/auth';

async function meHandler(req: AuthenticatedRequest) {
  // The withAuth middleware has already authenticated the user
  // and attached the user object to the request.
  // We can just return it.
  return NextResponse.json({ user: req.user });
}

// Wrap the handler with withAuth. No specific roles are required,
// so any authenticated user can access this endpoint.
export const GET = withAuth(meHandler, []);
