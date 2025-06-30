import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "./prisma"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"
const JWT_EXPIRES_IN = "7d"

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  phone?: string | null
  isActive: boolean
}

export interface AuthenticatedRequest extends NextRequest {
  user: User;
}

export interface AuthResult {
  success: boolean
  user?: User
  token?: string
  message?: string
}

type ApiHandler = (
  req: AuthenticatedRequest,
  context: unknown
) => Promise<Response> | Response;

// Generate a secure JWT
export function generateToken(user: { id: string, role: string }): string {
  return jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  })
}

// Verify a JWT
export async function verifyToken(token: string): Promise<{ userId: string, role: string } | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded as { userId: string, role: string };
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Compare password
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Authenticate user and return user, token
export async function authenticateUser(email: string, password: string): Promise<AuthResult> {
  try {
    const user = await prisma.user.findUnique({
      where: { 
        email: email,
        isActive: true
      }
    })

    if (!user) {
      return { success: false, message: "Invalid credentials" }
    }

    const isValidPassword = await comparePassword(password, user.password)

    if (!isValidPassword) {
      return { success: false, message: "Invalid credentials" }
    }

    const userForToken = { id: user.id, role: user.role };
    const token = generateToken(userForToken);

    const userWithoutPassword: User = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      phone: user.phone,
      isActive: user.isActive,
    }

    return {
      success: true,
      user: userWithoutPassword,
      token,
      message: "Authentication successful",
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return { success: false, message: "Authentication failed" }
  }
}

// Middleware for API routes
export function withAuth(handler: ApiHandler, allowedRoles: string[] = []) {
  return async (
    req: NextRequest,
    context: unknown
  ): Promise<Response> => {
    try {
      const authHeader = req.headers.get('authorization');
      const token = authHeader?.split(' ')[1];

      if (!token) {
        return NextResponse.json({ error: 'Authentication required. No token provided.' }, { status: 401 });
      }
      
      const decoded = await verifyToken(token);

      if (!decoded || !decoded.userId) {
        return NextResponse.json({ error: 'Invalid token format.' }, { status: 401 });
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, firstName: true, lastName: true, email: true, role: true, isActive: true, phone: true },
      });

      if (!user || !user.isActive) {
        return NextResponse.json({ error: 'User not found or inactive.' }, { status: 401 });
      }
      
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return NextResponse.json({ error: 'Insufficient permissions.' }, { status: 403 });
      }

      const authenticatedReq = req as AuthenticatedRequest;
      authenticatedReq.user = user;

      return handler(authenticatedReq, context);

    } catch (error: unknown) {
      console.error('Authentication error:', error);
      return NextResponse.json(
        { error: 'Invalid authentication token.' },
        { status: 401 }
      );
    }
  };
}
