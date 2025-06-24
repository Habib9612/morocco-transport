import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import crypto from 'crypto';

// Validation schemas
const requestResetSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const confirmResetSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Request password reset (POST)
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check if this is a reset confirmation or reset request
    if (body.token && body.password) {
      return await confirmPasswordReset(body);
    } else {
      return await requestPasswordReset(body);
    }
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Request password reset token
async function requestPasswordReset(body: Record<string, unknown>) {
  // Validate input
  const result = requestResetSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.errors[0].message },
      { status: 400 }
    );
  }

  const { email } = result.data;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, name: true },
  });

  // Always return success for security (don't reveal if email exists)
  if (!user) {
    return NextResponse.json({ 
      message: 'If an account with that email exists, you will receive a password reset email.' 
    });
  }

  // Generate secure reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

  // Save reset token to database
  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken,
      resetTokenExpiry,
    },
  });

  // TODO: Send email with reset link
  // For now, we'll just return the token (in production, this should be sent via email)
  console.log(`Password reset token for ${email}: ${resetToken}`);

  return NextResponse.json({ 
    message: 'If an account with that email exists, you will receive a password reset email.',
    // Remove this in production - only for development
    ...(process.env.NODE_ENV === 'development' && { resetToken })
  });
}

// Confirm password reset with token
async function confirmPasswordReset(body: Record<string, unknown>) {
  // Validate input
  const result = confirmResetSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.errors[0].message },
      { status: 400 }
    );
  }

  const { token, password } = result.data;

  // Find user with valid reset token
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: {
        gt: new Date(), // Token must not be expired
      },
    },
    select: { id: true, email: true },
  });

  if (!user) {
    return NextResponse.json(
      { error: 'Invalid or expired reset token' },
      { status: 400 }
    );
  }

  // Hash new password
  const hashedPassword = await hash(password, 12);

  // Update password and clear reset token
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  return NextResponse.json({ 
    message: 'Password has been reset successfully' 
  });
}
