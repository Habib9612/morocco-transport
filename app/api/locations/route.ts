export const runtime = "nodejs";
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/auth';

// GET /api/locations - Get all unique locations from shipments
async function getHandler(req: AuthenticatedRequest) {
    try {
        const locations = await prisma.shipment.findMany({
            distinct: ['pickupCity', 'deliveryCity'],
            select: {
                pickupCity: true,
                deliveryCity: true,
            },
        });

        // Combine and deduplicate cities
        const cities = new Set(locations.flatMap(l => [l.pickupCity, l.deliveryCity]));

        return NextResponse.json(Array.from(cities));
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST /api/locations - This doesn't make sense in the new context
// Creating a "location" happens when a shipment is created.
// To avoid confusion, I am removing the POST handler.

export const GET = withAuth(getHandler);
