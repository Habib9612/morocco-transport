import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export async function verifyJWT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { success: false, error: 'No token provided' };
    }

    const token = authHeader.substring(7);
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    
    return { success: true, user: decoded };
  } catch (error) {
    return { success: false, error: 'Invalid token' };
  }
}

export function generateJWT(payload: JWTPayload) {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// --- Client-side auth utilities ---

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  name?: string; // Optional name field
}

// Function to safely parse JSON
function safeJsonParse<T>(jsonString: string | undefined | null): T | null {
  if (!jsonString) {
    return null;
  }
  try {
    return JSON.parse(jsonString) as T;
  } catch (e) {
    console.error("Auth error:", e);
    return null;
  }
}

// Universal getAuthUser (client or server components)
export function getAuthUser(request?: NextRequest): AuthUser | null {
  let userJson: string | undefined | null = null;

  if (request) {
    // Server-side context (e.g., middleware, route handlers)
    userJson = request.cookies.get('user')?.value;
  } else {
    // Client-side context or Server Components where `next/headers` is available
    // This part will rely on the `next/headers` cookies mock in tests.
    try {
      // Dynamically import 'next/headers' only when not in a pure client-side environment
      // or when it's available (like in Server Components).
      // For tests, this will be mocked.
      const cookies = require('next/headers').cookies;
      userJson = cookies().get('user')?.value;
    } catch (e) {
      // This might fail in pure client-side components if `next/headers` isn't available
      // and not polyfilled/mocked for client-side.
      // For testing, this path won't be hit due to the mock.
      // In a real app, you might need separate client/server versions or use a context.
      console.warn("`next/headers` cookies() failed, likely client-side. Cookie access might be limited here.");
    }
  }

  if (!userJson) {
    return null;
  }

  const user = safeJsonParse<AuthUser>(userJson);

  if (user) {
    // Provide default values for optional fields if missing
    return {
      id: user.id,
      email: user.email || '',
      role: user.role || 'user',
      name: user.name || '',
    };
  }
  return null;
}

export function isAuthenticated(request?: NextRequest): boolean {
  return !!getAuthUser(request);
}

export function hasRole(roleOrRoles: string | string[], request?: NextRequest): boolean {
  const user = getAuthUser(request);
  if (!user) {
    return false;
  }

  if (Array.isArray(roleOrRoles)) {
    return roleOrRoles.includes(user.role);
  }
  return user.role === roleOrRoles;
}
