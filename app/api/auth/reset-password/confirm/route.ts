import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Prisma client
import { z } from 'zod';
import { hash, compare } from 'bcryptjs'; // For hashing the new password and comparing tokens

const confirmResetSchema = z.object({
  token: z.string().min(64, 'Reset token is invalid (too short)'), // Raw token should be 64 hex chars (32 bytes)
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = confirmResetSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const { token: rawTokenFromUser, newPassword } = result.data;

    // It's not feasible to directly query by the raw token if we stored its hash.
    // We need to find *potential* tokens and then verify.
    // A common approach is to iterate through non-expired tokens for a user
    // if the user can be identified first (e.g. via a separate email step not done here).
    // Or, if tokens are globally unique enough, this approach is okay but less efficient.
    // For this implementation, we will iterate through all non-expired tokens.
    // This is NOT ideal for performance with many tokens. A better way would be to also store
    // a non-sensitive lookup part of the token, or require email alongside token.

    const now = new Date();
    const potentialTokens = await db.passwordResetToken.findMany({
      where: {
        expiresAt: {
          gt: now, // Greater than now (not expired)
        },
      },
    });

    let validTokenRecord = null;
    for (const record of potentialTokens) {
      const isMatch = await compare(rawTokenFromUser, record.token); // Compare raw user token with stored hashed token
      if (isMatch) {
        validTokenRecord = record;
        break;
      }
    }

    if (!validTokenRecord) {
      return NextResponse.json({ error: 'Invalid or expired reset token.' }, { status: 400 });
    }

    // Token is valid and not expired.
    const userId = validTokenRecord.userId;

    // Hash the new password.
    const newHashedPassword = await hash(newPassword, 12);

    // Update the user's password.
    await db.user.update({
      where: { id: userId },
      data: { password: newHashedPassword },
    });

    // Delete the used PasswordResetToken.
    await db.passwordResetToken.delete({
      where: { id: validTokenRecord.id },
    });

    // Optionally, delete all other reset tokens for this user
    // await db.passwordResetToken.deleteMany({ where: { userId: userId }});


    return NextResponse.json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    console.error('Confirm password reset error:', error);
    // Avoid leaking specific error details like "token not found" if possible,
    // though for a failed reset, a generic error is often okay.
    return NextResponse.json({ error: 'Failed to reset password. Please try again.' }, { status: 500 });
  }
}
