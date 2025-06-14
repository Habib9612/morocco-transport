# Password Reset Functionality Implementation Report

This document details the implementation of the password reset functionality, including the new Prisma model for reset tokens, the logic within the API routes for requesting and confirming password resets, and the drafted unit tests for these API routes.

## 1. Prisma Model for Password Reset Tokens

*   **File Modified:** `prisma/schema.prisma`
*   **New Model `PasswordResetToken`:**
    ```prisma
    model PasswordResetToken {
      id        String   @id @default(cuid())
      token     String   @unique // Stores the HASHED token
      userId    String
      user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
      expiresAt DateTime
      createdAt DateTime @default(now())
    }
    ```
*   **Relation to `User` Model:**
    *   A corresponding relation `passwordResetTokens PasswordResetToken[]` was added to the `User` model.
    *   `onDelete: Cascade` ensures that if a user is deleted, their associated password reset tokens are also deleted.
*   **Note on Prisma Client Generation:** After these schema changes, `npx prisma generate` (and `npx prisma migrate dev`) must be run in a functional environment to update the Prisma Client and database schema. This is assumed for the implemented logic.

## 2. Request Password Reset Implementation

*   **File Modified:** `app/api/auth/reset-password/request/route.ts`
*   **Logic Overview:**
    1.  **Input Validation:** Expects an `email` in the request body, validated using Zod.
    2.  **User Lookup:** Finds the user by email using `db.user.findUnique`.
    3.  **Token Generation (if user found):**
        *   A cryptographically secure raw token (32 bytes, hex encoded) is generated using `crypto.randomBytes(32).toString('hex')`.
        *   This `rawToken` is then **hashed** using `bcryptjs.hash(rawToken, 10)`.
    4.  **Token Storage (if user found):**
        *   The `hashedToken` (not the raw token) is stored in the `PasswordResetToken` table along with the `userId` and an `expiresAt` timestamp (set to 1 hour from creation).
    5.  **Email Sending (Conceptual):** Comments in the code indicate that this is where an email containing the `rawToken` (not the hashed one) would be sent to the user. The link in the email would direct the user to a frontend page to complete the reset process.
    6.  **Response:** Returns a generic success message ("If your email is registered, you will receive a password reset link.") regardless of whether the user was found or not, to prevent user enumeration.

*   **Key Code Snippet (Token Generation & Storage):**
    ```typescript
    // ... inside POST handler, after finding 'user' ...
    if (user) {
      const rawToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = await hash(rawToken, 10);

      await db.passwordResetToken.create({
        data: {
          userId: user.id,
          token: hashedToken, // Store the hashed token
          expiresAt: new Date(Date.now() + 3600000), // 1 hour expiry
        },
      });
      // Conceptual: await sendPasswordResetEmail(user.email, user.name, resetLinkWithRawToken);
      console.log(`Password reset token generated and stored (hashed) for user: ${user.email}. Raw token (for email): ${rawToken}.`);
    } else {
      console.log(`Password reset requested for non-existent email: ${email}. No token generated or stored.`);
    }
    return NextResponse.json({ message: 'If your email is registered, you will receive a password reset link.' });
    ```

## 3. Confirm Password Reset Implementation

*   **File Modified:** `app/api/auth/reset-password/confirm/route.ts`
*   **Logic Overview:**
    1.  **Input Validation:** Expects a `token` (the raw token sent to the user) and a `newPassword` in the request body, validated using Zod. The token is expected to be a 64-character hex string.
    2.  **Token Validation:**
        *   Fetches all non-expired `PasswordResetToken` records from the database.
        *   Iterates through these records and uses `bcryptjs.compare(rawTokenFromUser, record.token)` to find a match between the raw token provided by the user and a stored hashed token.
        *   **Performance Note:** This iteration is not ideal for a large number of active tokens. More optimized strategies might involve requiring email alongside the token to narrow the search or using a portion of the raw token as a non-unique lookup key if security permits.
    3.  **Password Update (if token is valid and matched):**
        *   Retrieves the `userId` from the validated token record.
        *   Hashes the `newPassword` using `bcryptjs.hash(newPassword, 12)`.
        *   Updates the user's `password` in the `User` table.
    4.  **Token Deletion:** Deletes the used `PasswordResetToken` from the database to prevent reuse.
    5.  **Response:** Returns a success message if the password was reset, or an error message if the token was invalid/expired or another issue occurred.

*   **Key Code Snippet (Token Validation & Password Update):**
    ```typescript
    // ... inside POST handler, after Zod validation ...
    const { token: rawTokenFromUser, newPassword } = result.data;

    const now = new Date();
    const potentialTokens = await db.passwordResetToken.findMany({
      where: { expiresAt: { gt: now } },
    });

    let validTokenRecord = null;
    for (const record of potentialTokens) {
      const isMatch = await compare(rawTokenFromUser, record.token);
      if (isMatch) {
        validTokenRecord = record;
        break;
      }
    }

    if (!validTokenRecord) {
      return NextResponse.json({ error: 'Invalid or expired reset token.' }, { status: 400 });
    }

    const userId = validTokenRecord.userId;
    const newHashedPassword = await hash(newPassword, 12);

    await db.user.update({
      where: { id: userId },
      data: { password: newHashedPassword },
    });

    await db.passwordResetToken.delete({
      where: { id: validTokenRecord.id },
    });

    return NextResponse.json({ message: 'Password has been reset successfully.' });
    ```

## 4. Drafted Tests for Password Reset Logic

*   **Test File Created:** `app/api/auth/reset-password/reset-password.test.ts`
*   **Testing Framework Assumed:** Jest, with mocking for `crypto`, `next/headers`, `jsonwebtoken`, and `@/lib/db` (Prisma Client).
*   **Coverage for `request/route.ts`:**
    *   **User Exists:** Verifies `PasswordResetToken` creation with a hashed token, correct expiry, and a 200 status. Checks that the stored token is not the raw token but matches its hash.
    *   **User Does Not Exist:** Ensures no token is created and a 200 status is returned (to prevent user enumeration).
    *   **Invalid Email Input:** Verifies a 400 status and Zod error message.
*   **Coverage for `confirm/route.ts`:**
    *   **Valid Token & New Password:** Mocks successful token lookup (by iterating and comparing hashed token with raw input) and expiry check. Verifies `db.user.update` is called with the new hashed password and the correct `userId`. Verifies `db.passwordResetToken.delete` is called. Ensures a 200 status.
    *   **Invalid/Mismatched Token:** Mocks token lookup to find no match. Verifies a 400 error.
    *   **Expired Token:** Mocks token lookup to return an expired token (or no token if pre-filtered by DB). Verifies a 400 error.
    *   **Invalid Input (e.g., short password):** Verifies a 400 error based on Zod schema.

## 5. Assumptions and Limitations

*   **Prisma Client & Schema:** Assumes `prisma generate` and `prisma migrate dev` have been run after the schema change, making the `PasswordResetToken` model available via `db.passwordResetToken`.
*   **`bcryptjs` Availability:** Assumes `bcryptjs` (used for hashing/comparing) is correctly installed and available.
*   **Untested Code & Tests:** Due to persistent tooling/environment blockers, these code changes and the drafted tests are un-linted and un-executed. Thorough testing is critical.
*   **Email Sending:** The actual sending of emails with the reset token is conceptual and not implemented. A separate email service/library would be required.
*   **Token Confirmation Strategy:** The current token confirmation iterates through all active tokens. For systems with a very high volume of password reset requests, this could become a performance bottleneck.
*   **Error Handling:** Basic error handling is in place. Specific error types from Prisma or other operations are caught generically.
*   **Frontend Implementation:** This work only covers the backend API routes. Corresponding frontend pages are required.

This implementation provides the core backend logic and drafted unit tests for a secure password reset flow using hashed, expiring tokens.
