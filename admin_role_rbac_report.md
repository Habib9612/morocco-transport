# ADMIN Role Definition and RBAC Update Report

This document details the addition of an `ADMIN` role to the user system, the logic for assigning this role to the first registered user, the subsequent update of resource API authorization checks to include `ADMIN` permissions, and the drafted tests for these functionalities.

## 1. ADMIN Role Definition in Prisma Schema

*   **File Modified:** `prisma/schema.prisma`
*   **Change:** The `ADMIN` role was added to the `UserRole` enum.

    ```prisma
    enum UserRole {
      INDIVIDUAL
      CARRIER
      COMPANY
      ADMIN // New role
    }
    ```

*   **Note on Prisma Client Generation:** After this schema change, in a functional environment, `npx prisma generate` would need to be run to update the Prisma Client types to recognize the new `ADMIN` role. This step is assumed to be completed for the purpose of subsequent code logic. `npx prisma migrate dev` would also be needed to apply this change to the database schema.

## 2. Initial ADMIN Role Assignment Logic

The strategy chosen for initial ADMIN role assignment is to make the first user created in the system an ADMIN. This logic was implemented in both identified user signup flows.

**a. API-Based Signup (`app/api/auth/signup/route.ts`)**

This signup flow uses Prisma Client and Zod for validation.

*   **File Modified:** `app/api/auth/signup/route.ts`
*   **Logic Implemented:**
    1.  Before creating a new user, the system now counts the total number of existing users using `await db.user.count()`.
    2.  If `userCount` is 0, the `finalRole` for the new user is set to `'ADMIN'`.
    3.  If `userCount` is greater than 0, the role provided in the signup request (validated by Zod to be one of 'individual', 'carrier', 'company') is converted to its uppercase equivalent (e.g., 'individual' -> 'INDIVIDUAL') to match the Prisma `UserRole` enum values.
    4.  The `user` is created with this `finalRole`.

*   **Relevant Code Snippet (from `app/api/auth/signup/route.ts`):**
    ```typescript
    // ... inside export async function POST(request: Request)
    // After Zod validation of input:
    // let { email, password, name, role, company, phone } = result.data;

    const userCount = await db.user.count();
    let finalRole;

    if (userCount === 0) {
      finalRole = 'ADMIN';
    } else {
      switch (role.toLowerCase()) { // role is from validated input
        case 'individual': finalRole = 'INDIVIDUAL'; break;
        case 'carrier': finalRole = 'CARRIER'; break;
        case 'company': finalRole = 'COMPANY'; break;
        default: return NextResponse.json({ error: 'Invalid role specified' }, { status: 400 });
      }
    }
    // ... user creation with finalRole ...
    ```

**b. Custom Server Action Signup (`app/actions/auth.ts`)**

This signup flow uses raw SQL queries via `executeQuery`.

*   **File Modified:** `app/actions/auth.ts`
*   **Logic Implemented:**
    1.  Checks if any users exist (`SELECT id FROM users LIMIT 1`).
    2.  If no users exist, `roleToAssign` is set to `'ADMIN'`.
    3.  Otherwise, `roleToAssign` defaults to `'user'` (lowercase string, an existing inconsistency for this auth system).

*   **Relevant Code Snippet (from `app/actions/auth.ts`):**
    ```typescript
    // ... inside export async function signup(...)
    const allUsers = await executeQuery("SELECT id FROM users LIMIT 1", []);
    let roleToAssign;
    if (allUsers.length === 0) {
      roleToAssign = 'ADMIN'; // Use uppercase to match Prisma enum
    } else {
      roleToAssign = 'user'; // Existing behavior for non-admin in this custom system
    }
    // ... user insertion with roleToAssign ...
    ```

## 3. ADMIN Role Permissions in Resource APIs

Following the definition of the `ADMIN` role, authorization logic in previously secured resource APIs was updated to grant broad permissions to `ADMIN` users.

**Files Modified:**
*   `app/api/shipments/route.ts`
*   `app/api/shipments/[id]/route.ts`
*   `app/api/trucks/route.ts`
*   `app/api/trucks/[id]/route.ts`
*   `app/api/locations/route.ts`
*   `app/api/locations/[id]/route.ts`
*   `app/api/drivers/route.ts`
*   `app/api/drivers/[id]/route.ts`

**General Update Pattern:**
For each handler (GET, POST, PUT, DELETE) in the files above, the role check condition was modified to include `'ADMIN'`.

**Representative Code Snippet (e.g., from a POST handler that previously only allowed `COMPANY` or `CARRIER`):**
```typescript
// Original conceptual check:
// if (user.role !== 'COMPANY' && user.role !== 'CARRIER') { ... }

// Updated check:
if (user.role !== 'ADMIN' && user.role !== 'COMPANY' && user.role !== 'CARRIER') {
  return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
}
```
*(Specific permissions granted to ADMINs for each API group are detailed in `resource_apis_securing_report.md` and implicitly cover full CRUD access where other roles were already permitted, or provide access where it was previously more restricted).*

## 4. Drafted Tests for Password Reset, ADMIN Role Access, and Assignment

To support the implementation of password reset functionality and the ADMIN role, unit tests were drafted. These tests are conceptual and assume a Jest-like environment with mocking capabilities, as the current environment prevents test execution.

**a. Password Reset API Tests:**
*   **New Test File Created:** `app/api/auth/reset-password/reset-password.test.ts`
*   **Types of Test Cases Drafted for `request/route.ts`:**
    *   Valid email for existing user: Verifies `PasswordResetToken` creation with hashed token and correct expiry; ensures 200 response.
    *   Valid email for non-existent user: Verifies no token creation and 200 response (prevents user enumeration).
    *   Invalid email format: Verifies 400 error response.
*   **Types of Test Cases Drafted for `confirm/route.ts`:**
    *   Valid token and new password: Verifies password update, token deletion, and 200 response. Mocks involve `findMany` for tokens and `compare` for token matching.
    *   Invalid/mismatched token: Verifies 400 error.
    *   Expired token: Verifies 400 error.
    *   Invalid input (e.g., short password): Verifies 400 error based on Zod schema.

**b. Resource API Tests for ADMIN Permissions:**
*   **Test Files Updated:**
    *   `app/api/shipments/shipments-api.test.ts`
    *   `app/api/trucks/trucks-api.test.ts`
    *   `app/api/locations/locations-api.test.ts`
    *   `app/api/drivers/drivers-api.test.ts`
*   **Types of Test Cases Added:**
    *   Verifying that an authenticated user with the `ADMIN` role is allowed to perform actions previously restricted to other roles or now explicitly granted to admins (e.g., `ADMIN` can create, list, view specific, update, and delete Shipments, Trucks, Locations, and Drivers).
    *   These tests involve mocking the user object returned by the authentication layer to have `role: 'ADMIN'`.

**c. Signup Logic Tests for ADMIN Assignment:**
*   **New Test File Created:** `app/api/auth/signup-admin.test.ts`
*   **Types of Test Cases Drafted:**
    *   **First User Signup (API):** Mocks `db.user.count()` to return 0. Verifies that a call to the signup API route (`app/api/auth/signup/route.ts`) results in the `db.user.create` function being called with `role: 'ADMIN'`.
    *   **Subsequent User Signup (API):** Mocks `db.user.count()` to return > 0. Verifies that a call to the signup API with a requested role (e.g., 'individual') results in `db.user.create` being called with the corresponding uppercase Prisma enum value (e.g., `INDIVIDUAL`).
    *   **Invalid Role (API):** Verifies that if an invalid role string (not 'individual', 'carrier', or 'company') is provided for a subsequent user, a 400 error is returned.

## 5. Implications and Next Steps

*   **Role Consistency:** The custom server action auth in `app/actions/auth.ts` still assigns a lowercase string `'user'` for non-admin users. This needs to be reconciled with the Prisma `UserRole` enum. Standardizing on the JWT/Prisma-based auth system (`app/api/auth/*`) is recommended.
*   **Granular RBAC:** The current `ADMIN` permissions are broad. Future work should focus on implementing more fine-grained permissions and ownership checks for non-admin roles.
*   **Security of First User Creation:** The "first user is ADMIN" is for initial setup. Production systems need secure ways to manage admin users post-initialization.
*   **Untested Changes:** All these changes (schema, signup logic, API authorization, test drafts) remain unverified at a code execution level due to the persistent tooling and environment blockers. Rigorous testing is crucial once the environment is stable.
*   **Remaining APIs:** The `app/api/routes/...` endpoints still need to have authentication and authorization logic applied, including `ADMIN` permissions and corresponding tests drafted.

This work establishes the `ADMIN` role with initial broad permissions across key resource APIs, outlines test coverage for these and related auth functionalities, laying more groundwork for a comprehensive RBAC system.
