export const runtime = "nodejs";
import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/auth';
import { getDashboardData } from '@/app/actions/analytics';

async function handler(req: AuthenticatedRequest) {
  try {
    const period = req.nextUrl.searchParams.get('period') as any;
    const data = await getDashboardData(period);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}

export const GET = withAuth(handler, ['ADMIN', 'COMPANY']);
