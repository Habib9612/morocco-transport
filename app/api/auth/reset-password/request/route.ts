import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Prisma client
import { z } from 'zod';
import crypto from 'crypto'; // For token generation
import { hash } from 'bcryptjs'; // For hashing the token
// import { sendPasswordResetEmail } from '@/lib/email'; // Conceptual email sending service

const requestResetSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = requestResetSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const { email } = result.data;

    // Find user by email
    const user = await db.user.findUnique({
      where: { email },
    });

    if (user) {
      // 1. Generate a unique, secure, and time-limited reset token.
      const rawToken = crypto.randomBytes(32).toString('hex');

      // 2. Hash the token before storing it in the database.
      //    Using bcrypt's default salt rounds (usually 10 or 12)
      const hashedToken = await hash(rawToken, 10);

      // 3. Store the hashed token, user ID, and an expiry date.
      //    (Assumes PasswordResetToken model is now available via Prisma Client)
      await db.passwordResetToken.create({
        data: {
          userId: user.id,
          token: hashedToken, // Store the hashed token
          expiresAt: new Date(Date.now() + 3600000), // 1 hour expiry
        },
      });

      // 4. Send an email to the user with a link containing the *unhashed* token.
      //    This link would point to a frontend page where they can enter their new password.
      //    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password?token=${rawToken}`;
      //    await sendPasswordResetEmail(user.email, user.name, resetLink); // Conceptual

      console.log(`Password reset token generated and stored (hashed) for user: ${user.email}. Raw token (for email): ${rawToken}. In a real app, an email would be sent.`);
    } else {
      // User not found. Still return a generic success message to prevent user enumeration.
      console.log(`Password reset requested for non-existent email: ${email}. No token generated or stored.`);
    }

    // Always return a generic success message to prevent user enumeration.
    return NextResponse.json({ message: 'If your email is registered, you will receive a password reset link.' });

  } catch (error) {
    console.error('Request password reset error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
