import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// Verify JWT token and extract user info
export async function verifyToken(token: string) {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is not set');
    }

    const decoded = jwt.verify(token, secret) as any;
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// Authentication middleware
export async function authenticate(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    
    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: 'User not found or inactive' },
        { status: 401 }
      );
    }

    return { user };
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid authentication' },
      { status: 401 }
    );
  }
}

// Role-based authorization
export function authorize(allowedRoles: string[]) {
  return async (request: NextRequest, user: any) => {
    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    return null;
  };
}

// Combined auth + authorization middleware
export function withAuth(allowedRoles: string[] = []) {
  return async (request: NextRequest) => {
    const authResult = await authenticate(request);
    
    if (authResult instanceof NextResponse) {
      return authResult; // Return error response
    }

    const { user } = authResult;

    // Check role authorization if roles specified
    if (allowedRoles.length > 0) {
      const authzCheck = authorize(allowedRoles);
      const authzResult = await authzCheck(request, user);
      if (authzResult) {
        return authzResult; // Return authorization error
      }
    }

    return { user };
  };
}
