# Authentication and Authorization Analysis Report

This report details the current state of authentication and authorization mechanisms within the MarocTransit platform codebase.

## 1. Authentication Setup

The platform exhibits a mixed setup where NextAuth.js is configured but seemingly not fully or correctly implemented for active authentication. A custom, cookie-based authentication system appears to be the one currently in use.

**a. NextAuth.js Configuration (`lib/auth.config.ts`)**
*   **Providers:**
    *   A `CredentialsProvider` is configured.
    *   **Critical Issue:** The `authorize` function within this provider is a **mock implementation**. It does not validate credentials against the database but returns a hardcoded "Test User". This means NextAuth.js, as it stands, cannot be used for real user login.
*   **Session Strategy:** Configured for JWT (`session: { strategy: 'jwt' }`).
*   **Pages:** `signIn` and `signUp` pages are defined, but these likely point to custom pages rather than NextAuth.js default pages, given the custom API routes.

**b. Custom Authentication System (`app/actions/auth.ts` & `lib/auth.ts`)**
*   This system handles the actual user authentication lifecycle.
*   **Registration (`app/actions/auth.ts::signup`):**
    *   Checks if a user already exists.
    *   Hashes the password using `bcrypt.hash`.
    *   Stores the new user in the database with a default role (e.g., "user" as seen in the code, though Prisma defines `INDIVIDUAL`, `CARRIER`, `COMPANY`).
    *   Sets a custom "user" cookie containing user data (id, name, email, role).
*   **Login (`app/actions/auth.ts::login`):**
    *   Retrieves the user from the database by email.
    *   Verifies the password using `bcrypt.compare` against the stored hash.
    *   Sets the same custom "user" cookie.
*   **Logout (`app/actions/auth.ts::logout`):**
    *   Deletes the "user" cookie.
*   **Password Handling:** Passwords are appropriately hashed using `bcryptjs` before storage and compared during login.

**c. Discrepancies and Concerns:**
*   **Dual Systems:** The presence of a non-functional NextAuth.js configuration alongside a functioning custom system is confusing and could lead to maintenance issues or incorrect assumptions by developers. The README states NextAuth.js is used, which is misleading given its current mocked state.
*   **Prisma Schema vs. Query Discrepancy:**
    *   The `prisma/schema.prisma` defines `User { password String ... }`.
    *   The custom authentication actions in `app/actions/auth.ts` use `password_hash` in SQL queries (e.g., `SELECT * FROM users WHERE email = $1`, `bcrypt.compare(password, user.password_hash)`).
    *   This indicates a significant mismatch. Either Prisma schema is not the source of truth for the DB schema being queried by `executeQuery`, or `executeQuery` is bypassing Prisma models, potentially leading to inconsistencies.

## 2. Session Management

*   **Strategy:** Primarily relies on the custom "user" cookie managed by `app/actions/auth.ts` and interpreted by `lib/auth.ts`.
*   **Cookie Details:**
    *   The "user" cookie stores a JSON string of user data (id, name, email, role).
    *   **Security Concern:** The cookie is set with `httpOnly: false`. This makes the cookie accessible to client-side JavaScript, exposing it to Cross-Site Scripting (XSS) attacks. If compromised, user session data can be stolen. It should be `httpOnly: true`.
    *   Cookie lifetime is set to 1 day (`maxAge: 60 * 60 * 24`).

## 3. Authorization Logic & RBAC

*   **Role Definition (`prisma/schema.prisma`):**
    *   The `User` model has a `role` field of type `UserRole`.
    *   The `UserRole` enum defines `INDIVIDUAL`, `CARRIER`, and `COMPANY`.
    *   **Critical Gap:** There is **no `ADMIN` role** defined in this enum, which is a major omission considering the README mentions admin permissions.
*   **Role Assignment:**
    *   The `signup` server action in `app/actions/auth.ts` assigns a default role of `"user"` (a string) when creating new users. This string literal "user" does not match any of the defined `UserRole` enum values (`INDIVIDUAL`, `CARRIER`, `COMPANY`). This is another significant discrepancy.
*   **Accessing User Roles (`lib/auth.ts`):**
    *   The `getAuthUser` function reads the role from the custom "user" cookie.
    *   The `hasRole(role: string | string[])` function checks if the current user (from the cookie) has the specified role(s).
*   **Route/Feature Protection:**
    *   The codebase does not show clear examples of how `hasRole` is systematically used in API middleware or page components to protect routes or features. This would need further investigation by searching for usages of `hasRole` or similar logic.
    *   Given the discrepancies in role definition and assignment, effective RBAC is likely not fully implemented or is inconsistent.
*   **Gaps & Areas for Improvement:**
    *   **Define `ADMIN` Role:** Add an `ADMIN` role to the `UserRole` enum in `prisma/schema.prisma`.
    *   **Consistent Role Assignment:** Ensure the `signup` process and any user management functions assign roles consistent with the `UserRole` enum values.
    *   **Systematic RBAC Enforcement:** Implement middleware or higher-order components/functions to protect API routes and UI sections based on user roles using the `hasRole` utility or similar.
    *   **Clarify NextAuth.js vs. Custom Auth:** Decide on a single source of truth for authentication. If NextAuth.js is preferred, its `authorize` callback needs to be correctly implemented to use the database, and the custom cookie logic should be deprecated. If the custom system is preferred, NextAuth.js configuration should be removed to avoid confusion.

## 4. Potential Security Considerations (Initial Observations)

*   **`httpOnly: false` for Session Cookie:** As mentioned, this is a significant XSS vulnerability. The session cookie should be `httpOnly: true`.
*   **CSRF Protection:** It's not immediately clear if Cross-Site Request Forgery (CSRF) protection mechanisms are in place for the custom authentication actions. While Next.js API routes have some built-in protections, explicit CSRF tokens are often recommended, especially for sensitive actions like login/signup if not using a framework like NextAuth.js that handles it.
*   **Error Handling in Auth Actions:** The `app/actions/auth.ts` functions catch errors and return generic messages (e.g., "Invalid credentials," "Failed to authenticate"). This is good for preventing information leakage, but detailed logs should be kept server-side for diagnostics.
*   **Inconsistent Role System:** The discrepancy between string roles ("user") and enum roles (`INDIVIDUAL`, etc.) and the missing `ADMIN` role can lead to authorization bypasses if not carefully managed or if parts of the system make different assumptions.
*   **Mocked NextAuth.js Provider:** If any part of the system mistakenly relies on the NextAuth.js setup (e.g., if a developer tries to use NextAuth.js client methods expecting them to work with the mocked provider), it could lead to unexpected behavior or security bypasses.

This analysis is based on the provided file contents. A deeper review of how these auth functions are called and how session data is consumed across the application would be necessary for a more comprehensive security assessment.
