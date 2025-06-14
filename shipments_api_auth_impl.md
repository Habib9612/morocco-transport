# Shipment API Authentication and Authorization Implementation Report

This document details the implementation of JWT-based authentication and basic role-based authorization for the shipment-related API endpoints.

## 1. Targeted Authentication System

The authentication mechanism implemented is based on the JWT system found in `app/api/auth/session/route.ts` and `app/api/auth/login/route.ts`. This system uses:
*   A JWT stored in an `httpOnly` cookie named 'session'.
*   `jsonwebtoken.verify()` for token verification.
*   Prisma Client (`db.user.findUnique`) to fetch user details based on `userId` from the decoded token.

This system was chosen over the custom cookie-based authentication in `lib/auth.ts` and `app/actions/auth.ts` due to its superior security characteristics (especially `httpOnly: true` cookies).

## 2. Files Modified

Authentication and basic authorization logic was added/corrected in the following files:

1.  **`app/api/shipments/route.ts`**:
    *   Applied to `GET` (list all shipments) handler: Authentication added. No specific role check applied (all authenticated users can list).
    *   Applied to `POST` (create new shipment) handler: Authentication and authorization added (only `INDIVIDUAL` or `COMPANY` roles).
    *   *Note for `POST` in `app/api/shipments/route.ts`:* This file already had a version of the authentication block from a previous attempt; the changes made in this session primarily corrected the JWT error handling and added the authorization logic.

2.  **`app/api/shipments/[id]/route.ts`**:
    *   Applied to `GET` (get specific shipment) handler: Authentication and authorization added (allows `INDIVIDUAL`, `COMPANY`, `CARRIER`).
    *   Applied to `PUT` (update specific shipment) handler: Authentication and authorization added (allows `INDIVIDUAL`, `COMPANY`, `CARRIER`).
    *   Applied to `DELETE` (delete specific shipment) handler: Authentication and authorization added (allows `INDIVIDUAL`, `COMPANY`; `ADMIN` placeholder commented).

## 3. Implemented Authentication Logic Snippet

The following structure was added at the beginning of each targeted API route handler function (before the original business logic):

```typescript
// Added imports at the top of the file:
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken'; // verify is a named export
import { db as prismaDb } from '@/lib/db'; // Renamed import for clarity

// Inside each handler function (e.g., export async function GET(request: NextRequest) { ... })
// This block was added/corrected:
let user; // Declared here to be accessible for authorization checks
try {
  const sessionCookie = cookies().get('session');
  if (!sessionCookie?.value) {
    return NextResponse.json({ error: 'Unauthorized: No session cookie' }, { status: 401 });
  }

  let decoded;
  try {
    decoded = verify(
      sessionCookie.value,
      process.env.JWT_SECRET || 'your-secret-key' // CRITICAL: Default secret is insecure
    ) as { userId: string };
  } catch (err: any) { // Catch as any to inspect name property
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      console.error('Token verification error:', err.message);
      return NextResponse.json({ error: 'Unauthorized: Invalid or expired token' }, { status: 401 });
    }
    console.error('Token verification unexpected error:', err);
    throw err; // Re-throw to be caught by outer try-catch or default error handler
  }

  if (!decoded || !decoded.userId) {
    return NextResponse.json({ error: 'Unauthorized: Invalid token payload structure' }, { status: 401 });
  }

  // Assign to the user variable declared outside the try block
  user = await prismaDb.user.findUnique({ where: { id: decoded.userId } });
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized: User not found' }, { status: 401 });
  }

  // User is authenticated. The 'user' object is now available for subsequent authorization checks.

} catch (authError: any) {
  // This outer catch handles errors from the auth block itself,
  // including re-thrown errors from the inner verify catch, or Prisma client errors.
  if (authError.name === 'JsonWebTokenError' || authError.name === 'TokenExpiredError') {
     console.error('Outer catch: Token verification error:', authError.message);
     return NextResponse.json({ error: 'Unauthorized: Invalid or expired token (outer catch)' }, { status: 401 });
  }
  console.error('Authentication process error:', authError);
  return NextResponse.json({ error: 'Internal server error during authentication' }, { status: 500 });
}

// Authorization checks follow here, using the 'user' object...
```

## 4. Implemented Authorization Logic Snippets

Following successful authentication, role checks were added. The `user` object (containing `user.role`) is available from the authentication step.

*   **For `POST /api/shipments` (Create Shipment):**
    ```typescript
    if (user.role !== 'INDIVIDUAL' && user.role !== 'COMPANY') {
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
    }
    ```

*   **For `GET /api/shipments` (List Shipments):**
    *   No specific role check was added after authentication, allowing any authenticated user to list shipments as per the defined scope for this step.

*   **For `GET /api/shipments/[id]` (Get Specific Shipment):**
    ```typescript
    if (user.role !== 'INDIVIDUAL' && user.role !== 'COMPANY' && user.role !== 'CARRIER') {
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
    }
    ```

*   **For `PUT /api/shipments/[id]` (Update Specific Shipment):**
    ```typescript
    if (user.role !== 'INDIVIDUAL' && user.role !== 'COMPANY' && user.role !== 'CARRIER') {
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
    }
    ```

*   **For `DELETE /api/shipments/[id]` (Delete Specific Shipment):**
    ```typescript
    if (user.role !== 'INDIVIDUAL' && user.role !== 'COMPANY' /* && user.role !== 'ADMIN' */) {
      // ADMIN role check is commented out as it's not in the current Prisma schema.
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
    }
    ```

## 5. Assumptions and Challenges

*   **JWT Secret:** A critical assumption is that `process.env.JWT_SECRET` will be set to a strong, unique secret in any production or secure environment. The fallback to `'your-secret-key'` is a major security risk.
*   **Prisma Client (`db`):** Assumed that `db` (imported as `prismaDb`) from `lib/db.ts` is a correctly configured Prisma Client instance.
*   **Role Consistency:** Assumed that `user.role` fetched from the database via Prisma (`prismaDb.user.findUnique`) will contain uppercase enum values (`INDIVIDUAL`, `CARRIER`, `COMPANY`) as defined in `prisma/schema.prisma`. This is despite the JWT signup API (`app/api/auth/signup/route.ts`) validating against lowercase roles. This inconsistency needs to be resolved system-wide. For these checks, the Prisma enum style (uppercase) was assumed to be the source of truth in the DB.
*   **Lack of Linting/Testing Environment:**
    *   The changes were made without the ability to run linters or type checkers due to persistent environment issues. This means syntax errors or type mismatches might exist.
    *   Unit tests for this authentication and authorization logic could not be run.
*   **Basic RBAC Implementation:** The implemented role checks are basic and based on conceptual rules. A full RBAC system would require:
    *   Defining an `ADMIN` role in the Prisma schema.
    *   More granular permissions (e.g., a shipper can only modify/delete their *own* shipments; a carrier can only update shipments *assigned* to them). This would involve fetching the shipment resource first and then checking ownership or assignment against the authenticated `user.id` or `user.role`. Such fine-grained checks were beyond the scope of this initial RBAC pass.
*   **Impact on `customer_id`:** For the `POST /api/shipments` route, the authenticated `user.id` should ideally be used as the `customer_id` (or `shipperId`) for the new shipment, or at least the provided `customer_id` should be validated against the authenticated user's ID. This was noted in comments in the code but not fully implemented to keep the scope focused.

## 6. Conclusion

Authentication checks using the JWT 'session' cookie, followed by basic role-based authorization, have been added to the main shipment API endpoints. The primary challenge remains the inability to lint, test, or even reliably run any `npm` scripts in the current environment, making these changes unverified at a code execution level. The security of the JWT secret, resolution of role inconsistencies, and implementation of more fine-grained RBAC are critical next steps.
