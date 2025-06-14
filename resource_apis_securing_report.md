# Securing Resource APIs Report

This document details the implementation of authentication and basic role-based authorization for various resource-specific API endpoints.

## Trucks API (`app/api/trucks/` and `app/api/trucks/[id]/`)

**Objective:** Secure all Trucks API endpoints by implementing JWT-based authentication and basic role-based authorization.

**1. Files Modified:**
*   `app/api/trucks/route.ts` (for `GET` all trucks, `POST` create new truck)
*   `app/api/trucks/[id]/route.ts` (for `GET` specific truck, `PUT` update truck, `DELETE` delete truck)

**2. Authentication Logic Added:**
The same JWT authentication logic previously implemented for Shipment APIs (and defined in `shipments_api_auth_impl.md`) was added to the beginning of each HTTP handler in the Trucks API files. This logic:
*   Imports `cookies` from `next/headers`, `verify` from `jsonwebtoken`, and `db as prismaDb` from ` '@/lib/db'`.
*   Retrieves the 'session' cookie.
*   Verifies the JWT using `process.env.JWT_SECRET`. It includes a critical check to ensure `JWT_SECRET` is defined, throwing an error if not.
*   Handles JWT-specific errors (`JsonWebTokenError`, `TokenExpiredError`) by checking `err.name` and returns a 401 status.
*   Fetches the user from the database using `prismaDb.user.findUnique` based on `userId` from the decoded token.
*   Returns a 401 status if the token is missing, invalid, the payload is incorrect, or the user is not found.
*   A `user` variable is populated with the authenticated user's data for subsequent authorization checks.

**Snippet of Authentication Block (example from one handler):**
```typescript
// At the top of the file:
// import { type NextRequest, NextResponse } from "next/server"
// import { executeQuery } from "@/lib/db" // Original import
// import { cookies } from 'next/headers';
// import { verify } from 'jsonwebtoken';
// import { db as prismaDb } from '@/lib/db';

// Inside each handler (e.g., export async function GET(request: NextRequest) { ... })
let user; // Declared to be accessible for authorization
try {
  const sessionCookie = cookies().get('session');
  if (!sessionCookie?.value) {
    return NextResponse.json({ error: 'Unauthorized: No session cookie' }, { status: 401 });
  }

  let decoded;
  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('CRITICAL: JWT_SECRET is not defined.');
      throw new Error('Server configuration error: JWT_SECRET missing.');
    }
    decoded = verify(sessionCookie.value, jwtSecret) as { userId: string };
  } catch (err: any) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      console.error('Token verification error:', err.message);
      return NextResponse.json({ error: 'Unauthorized: Invalid or expired token' }, { status: 401 });
    }
    console.error('Token verification unexpected error:', err);
    throw err; // Re-throw to be caught by outer try-catch
  }

  if (!decoded || !decoded.userId) {
    return NextResponse.json({ error: 'Unauthorized: Invalid token payload structure' }, { status: 401 });
  }

  user = await prismaDb.user.findUnique({ where: { id: decoded.userId } });
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized: User not found' }, { status: 401 });
  }
  // User is authenticated and 'user' object is available.

} catch (authError: any) {
  if (authError.name === 'JsonWebTokenError' || authError.name === 'TokenExpiredError') {
     console.error('Outer catch: Token verification error:', authError.message);
     return NextResponse.json({ error: 'Unauthorized: Invalid or expired token (outer catch)' }, { status: 401 });
  }
  console.error('Authentication process error:', authError);
  return NextResponse.json({ error: 'Internal server error during authentication' }, { status: 500 });
}

// Authorization check follows...
// Original handler logic follows...
```

**3. Authorization Rules Implemented (Conceptual):**
Following successful authentication, basic role checks were added based on the `user.role` field. The `ADMIN` role is treated as conceptual and commented out in checks, as it's not yet in the Prisma schema.

*   **`POST /api/trucks` (Create Truck):**
    *   Allowed for roles: `COMPANY`, `CARRIER` (and conceptual `ADMIN`).
    *   Snippet:
        ```typescript
        if (user.role !== 'COMPANY' && user.role !== 'CARRIER' /* && user.role !== 'ADMIN' */) {
          return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
        }
        ```
*   **`GET /api/trucks` (List Trucks):**
    *   Allowed for roles: `COMPANY`, `CARRIER` (and conceptual `ADMIN`).
    *   Snippet (same as POST).
*   **`GET /api/trucks/[id]` (Specific Truck):**
    *   Allowed for roles: `COMPANY`, `CARRIER` (and conceptual `ADMIN`).
    *   Snippet (same as POST).
    *   *Note: Ownership/management link to the specific truck was not implemented in this pass.*
*   **`PUT /api/trucks/[id]` (Update Truck):**
    *   Allowed for roles: `COMPANY`, `CARRIER` (and conceptual `ADMIN`).
    *   Snippet (same as POST).
    *   *Note: Ownership/management link not implemented in this pass.*
*   **`DELETE /api/trucks/[id]` (Delete Truck):**
    *   Allowed for roles: `COMPANY`, `CARRIER` (and conceptual `ADMIN`).
    *   Snippet (same as POST).
    *   *Note: Ownership/management link not implemented in this pass.*

**4. Error Handling:**
*   Authentication failures (no cookie, invalid token, user not found) result in a `401 Unauthorized` response.
*   Authorization failures (role not permitted) result in a `403 Forbidden` response.
*   Server-side configuration issues (e.g., missing `JWT_SECRET`) result in a `500 Internal Server Error`.

**5. Assumptions and Limitations:**
*   **JWT Secret:** Assumes `process.env.JWT_SECRET` is securely managed. The code now fails if it's missing.
*   **Role Consistency:** Assumes `user.role` from the database (via Prisma) aligns with the `UserRole` enum (e.g., `COMPANY`, `CARRIER`). The existing inconsistency with lowercase roles during JWT signup needs to be addressed separately.
*   **Untested Code:** Due to persistent tooling/environment blockers preventing `npm run lint`, `npm test`, etc., these changes are un-linted and untested.
*   **Basic RBAC:** The authorization implemented is role-based but does not yet include finer-grained ownership or resource-specific permission checks (e.g., a carrier can only modify *their own* trucks). This is a necessary future enhancement.
*   **`ADMIN` Role:** The `ADMIN` role is treated conceptually and commented out in checks, as it is not yet defined in the `prisma/schema.prisma` `UserRole` enum.

**6. Drafted Tests (Conceptual):**
*   **Test File:** `app/api/trucks/trucks-api.test.ts` (created in a parallel subtask).
*   **Coverage:** Test cases were drafted for:
    *   **Authentication:** Unauthenticated access (no cookie, invalid token, user not found for token) returning 401. Successful authentication proceeding.
    *   **Authorization:** Users with allowed roles (e.g., `COMPANY` for POST) passing checks. Users with disallowed roles (e.g., `INDIVIDUAL` for POST) receiving 403.
*   **Status:** These tests are drafted and rely on mocking `next/headers`, `jsonwebtoken`, and `@/lib/db`. They cannot be executed due to current tooling/environment blockers.

**Next Steps (Post Environment Stabilization):**
1.  Lint and test all modified files.
2.  Define and implement the `ADMIN` role in the Prisma schema and update authorization checks.
3.  Implement more granular RBAC, including ownership and specific permission checks.
4.  Apply similar auth/authz patterns to other remaining unsecured resource APIs (drivers, locations, routes).
5.  Resolve role casing inconsistencies between signup and Prisma schema.
6.  Ensure the `carrierId` field in the `Truck` model is appropriately linked or validated against the authenticated user when a `CARRIER` role creates/manages a truck.

---

## Locations API (`app/api/locations/` and `app/api/locations/[id]/`)

**Objective:** Secure all Locations API endpoints by implementing JWT-based authentication and basic role-based authorization.

**1. Files Modified:**
*   `app/api/locations/route.ts` (for `GET` all locations, `POST` create new location)
*   `app/api/locations/[id]/route.ts` (for `GET` specific location, `PUT` update location, `DELETE` delete location)

**2. Authentication Logic Added:**
The same JWT authentication logic as detailed for the Trucks API (and previously for Shipments API) was added to the beginning of each HTTP handler in the Locations API files.

**3. Authorization Rules Implemented (Conceptual):**
Following successful authentication, basic role checks were added:

*   **`POST /api/locations` (Create Location):**
    *   Allowed for roles: `COMPANY`, `CARRIER` (and conceptual `ADMIN`).
    *   Snippet:
        ```typescript
        if (user.role !== 'COMPANY' && user.role !== 'CARRIER' /* && user.role !== 'ADMIN' */) {
          return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
        }
        ```
*   **`GET /api/locations` (List Locations):**
    *   Allowed for **any authenticated user**. No specific role check beyond authentication was implemented for this endpoint as per the defined scope.
*   **`GET /api/locations/[id]` (Specific Location):**
    *   Allowed for **any authenticated user**. No specific role check beyond authentication.
*   **`PUT /api/locations/[id]` (Update Location):**
    *   Allowed for roles: `COMPANY`, `CARRIER` (and conceptual `ADMIN`).
    *   Snippet (same as POST create).
*   **`DELETE /api/locations/[id]` (Delete Location):**
    *   Allowed for roles: `COMPANY`, `CARRIER` (and conceptual `ADMIN`).
    *   Snippet (same as POST create).

**4. Error Handling & Assumptions/Limitations:**
*   Same as for Trucks API (401 for auth failure, 403 for authz failure, 500 for server config issues).
*   The same assumptions and limitations regarding JWT secret, role consistency, untested code, basic RBAC, and the conceptual `ADMIN` role apply.

**5. Drafted Tests (Conceptual):**
*   **Test File:** `app/api/locations/locations-api.test.ts` (created in a parallel subtask).
*   **Coverage:** Test cases were drafted for:
    *   **Authentication:** Unauthenticated access and invalid token scenarios returning 401.
    *   **Authorization:** Users with allowed roles (e.g., `COMPANY` for POST, any authenticated for GET list) passing checks. Users with disallowed roles (e.g., `INDIVIDUAL` for POST) receiving 403.
*   **Status:** These tests are drafted and rely on mocking. They cannot be executed due to current tooling/environment blockers.

**Next Steps (Post Environment Stabilization):**
Similar to Trucks API, these include:
1.  Lint and test all modified files.
2.  Implement/use `ADMIN` role properly.
3.  Implement more granular RBAC (e.g., who can create/edit specific types of locations if needed).
4.  Apply auth/authz to remaining unsecured APIs (drivers, routes).
5.  Resolve role inconsistencies.

---

## Drivers API (`app/api/drivers/` and `app/api/drivers/[id]/`)

**Objective:** Secure all Drivers API endpoints by implementing JWT-based authentication and basic role-based authorization.

**1. Files Modified:**
*   `app/api/drivers/route.ts` (for `GET` all drivers, `POST` create new driver)
*   `app/api/drivers/[id]/route.ts` (for `GET` specific driver, `PUT` update driver, `DELETE` delete driver)

**2. Authentication Logic Added:**
The same JWT authentication logic as detailed for the Trucks and Locations APIs was added to the beginning of each HTTP handler in the Drivers API files.

**3. Authorization Rules Implemented (Conceptual):**
Following successful authentication, basic role checks were added based on the `user.role` field.

*   **`POST /api/drivers` (Create Driver):**
    *   Allowed for roles: `COMPANY`, `CARRIER` (and conceptual `ADMIN`).
    *   Snippet:
        ```typescript
        if (user.role !== 'COMPANY' && user.role !== 'CARRIER' /* && user.role !== 'ADMIN' */) {
          return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
        }
        ```
*   **`GET /api/drivers` (List Drivers):**
    *   Allowed for roles: `COMPANY`, `CARRIER` (and conceptual `ADMIN`).
    *   Snippet (same as POST create).
*   **`GET /api/drivers/[id]` (Specific Driver):**
    *   Allowed for roles: `COMPANY`, `CARRIER` (and conceptual `ADMIN`).
    *   *Note: More granular checks like company/carrier ownership or self-view for a driver user were not implemented in this pass.*
    *   Snippet (same as POST create).
*   **`PUT /api/drivers/[id]` (Update Driver):**
    *   Allowed for roles: `COMPANY`, `CARRIER` (and conceptual `ADMIN`).
    *   Snippet (same as POST create).
*   **`DELETE /api/drivers/[id]` (Delete Driver):**
    *   Allowed for roles: `COMPANY`, `CARRIER` (and conceptual `ADMIN`).
    *   Snippet (same as POST create).

**4. Error Handling & Assumptions/Limitations:**
*   Same as for Trucks and Locations APIs (401 for auth failure, 403 for authz failure, 500 for server config issues).
*   The same assumptions and limitations regarding JWT secret, role consistency, untested code, basic RBAC, and the conceptual `ADMIN` role apply.

**5. Drafted Tests (Conceptual):**
*   **Test File:** `app/api/drivers/drivers-api.test.ts` (created in a parallel subtask).
*   **Coverage:** Test cases were drafted for:
    *   **Authentication:** Unauthenticated access and invalid token scenarios returning 401.
    *   **Authorization:** Users with allowed roles (e.g., `COMPANY` for POST/GET) passing checks. Users with disallowed roles (e.g., `INDIVIDUAL` for POST/GET) receiving 403.
*   **Status:** These tests are drafted and rely on mocking. They cannot be executed due to current tooling/environment blockers.

**Next Steps (Post Environment Stabilization):**
Similar to other secured APIs:
1.  Lint and test all modified files.
2.  Implement/use `ADMIN` role properly.
3.  Implement more granular RBAC (e.g., a company can only manage its own drivers).
4.  Apply auth/authz to the remaining `app/api/routes/**` endpoints.
5.  Resolve role inconsistencies.
6.  Ensure the `user_id` for a new Driver is appropriately linked to a User record and potentially validated against the creating COMPANY/CARRIER.
