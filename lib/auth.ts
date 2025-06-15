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
