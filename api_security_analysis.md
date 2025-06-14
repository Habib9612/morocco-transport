# API Security Analysis Report

This report details the security posture of the identified API endpoints under `app/api/`, focusing on authentication, authorization, input validation, data exposure, and other security-relevant aspects.

## 1. Authentication Endpoints (`app/api/auth/`)

These endpoints manage user login, logout, session, and signup.

*   **`POST /api/auth/login`**:
    *   **Authentication:** Primary login endpoint.
    *   **Authorization:** N/A.
    *   **Input Validation:** Basic check for presence of `email` and `password`. Lacks format or length validation.
    *   **Data Exposure:** Returns user object (password hash correctly excluded).
    *   **Security:** Uses `bcryptjs` for password comparison. Sets an `httpOnly: true`, `sameSite: 'lax'` JWT session cookie (`session`). The JWT secret has a default fallback `'your-secret-key'`, which is insecure and **must be changed** for production.
*   **`POST /api/auth/logout`**:
    *   **Authentication:** Implicitly relies on an existing 'session' cookie to be meaningful.
    *   **Authorization:** N/A.
    *   **Data Exposure:** Returns `{ success: true }`.
    *   **Security:** Deletes the 'session' cookie.
*   **`GET /api/auth/session`**:
    *   **Authentication:** Verifies the JWT 'session' cookie to retrieve current user data.
    *   **Authorization:** N/A.
    *   **Data Exposure:** Returns user object (password hash excluded).
    *   **Security:** Correctly verifies JWT. Handles cases where cookie is missing or token is invalid by returning `{ user: null }`.
*   **`POST /api/auth/signup`**:
    *   **Authentication:** N/A (public endpoint).
    *   **Authorization:** N/A.
    *   **Input Validation:** Good use of Zod (`signupSchema`) for validating `email`, `password`, `name`, `role`, and optional fields.
    *   **Data Exposure:** Returns created user object (password hash excluded).
    *   **Security:** Uses `bcryptjs` to hash passwords.
    *   **Note:** The `role` validation (`z.enum(['individual', 'carrier', 'company'])`) uses lowercase strings, which differs from the Prisma `UserRole` enum's uppercase values (e.g., `INDIVIDUAL`). This inconsistency should be resolved.
*   **`app/api/auth/reset-password/route.ts`**:
    *   **Status:** **Not Implemented.** The file is empty. This is a missing critical security feature.

**Observations on Auth System:**
*   These API routes implement a JWT-based authentication mechanism using Prisma Client. This is a more modern and secure approach compared to the custom "user" cookie system identified in `app/actions/auth.ts` (which had `httpOnly: false` cookies).
*   **It's crucial to clarify which authentication system is canonical and deprecate the other to avoid confusion and potential vulnerabilities from the weaker system.** The JWT system in these API routes is preferable.

## 2. Resource API Endpoints (Drivers, Locations, Routes, Shipments, Trucks)

These endpoints are located under `app/api/drivers/`, `app/api/locations/`, `app/api/routes/`, `app/api/shipments/`, and `app/api/trucks/`. They all share common characteristics and vulnerabilities.

**Systemic Weaknesses:**

*   **Critical: Missing Authentication:**
    *   **Issue:** **None** of the reviewed resource API endpoints (GET, POST, PUT, DELETE for drivers, locations, routes, shipments, trucks) implement any authentication checks. They do not verify the 'session' JWT cookie or use any other mechanism to ensure that the requesting user is authenticated.
    *   **Impact:** This allows unauthenticated users to potentially access, create, modify, or delete any of these resources, leading to unauthorized data exposure, data tampering, and denial of service. This is a critical vulnerability.
    *   **Mitigation:** All endpoints that are not intended to be public **must** implement authentication checks. This can be done by:
        1.  Reading the 'session' cookie.
        2.  Verifying the JWT using the same logic as in `app/api/auth/session/route.ts`.
        3.  Rejecting requests if the token is missing, invalid, or the user ID from the token does not correspond to a valid user.

*   **Missing Authorization (RBAC):**
    *   **Issue:** Beyond the lack of authentication, there are **no role-based access control (RBAC) checks** on any of these resource endpoints. Even if authentication were added, any authenticated user could potentially perform any action.
    *   **Impact:** For example, a user with a 'shipper' role might be able to delete truck records, or a 'carrier' might be able to modify shipment details they are not part of. This violates the principle of least privilege.
    *   **Mitigation:** After implementing authentication:
        1.  Define clear roles and permissions (the `UserRole` enum in Prisma needs an `ADMIN` role, and the string vs. enum inconsistency for roles needs fixing).
        2.  For each endpoint and operation, check if the authenticated user's role (from the JWT payload) permits them to perform that action. For instance, creating a truck might be restricted to `ADMIN` or `CARRIER` roles. Modifying a shipment might be restricted to the owning shipper, the assigned carrier, or an `ADMIN`.

*   **Insufficient Input Validation:**
    *   **Issue:** Most `POST` and `PUT` endpoints perform only basic presence checks for a few required fields. They generally lack comprehensive validation for data types, formats, lengths, ranges, or specific business rules (e.g., validating that dates are in a correct sequence, or that `weight` is a positive number). Zod, which is used in `app/api/auth/signup/route.ts`, is not used in these resource APIs.
    *   **Impact:** This can lead to data integrity issues, unexpected errors, and potential vulnerabilities if malformed data causes crashes or is improperly handled by downstream logic.
    *   **Mitigation:** Implement robust input validation for all incoming data (request bodies, query parameters, path parameters) using a library like Zod. Return clear 400 Bad Request errors for invalid input.

*   **Database Interaction via Raw SQL (`executeQuery`):**
    *   **Issue:** All these resource endpoints use the `executeQuery` function with raw SQL strings.
    *   **Security Assessment:** As per `db_security_analysis.md`, `executeQuery` uses Prisma's `$queryRaw` with parameterization, which is secure against SQL injection.
    *   **Consistency/Maintainability:** This is inconsistent with the use of Prisma Client in the `/api/auth/` routes. Using Prisma Client directly would offer better type safety and align with the ORM pattern.

**Other Common Points:**
*   **Secure Data Exposure:** Generally, GET endpoints return data relevant to the resource. However, without authentication, any data exposure is problematic. Password hashes are not exposed.
*   **Rate Limiting:** No evidence of rate limiting implemented at the application level for any of these endpoints. This could make them susceptible to brute-force attacks (less relevant for these non-auth endpoints directly, but still a general API hardening measure) or denial-of-service through resource exhaustion.
    *   **Mitigation:** Implement rate limiting, potentially at an API gateway or middleware level.
*   **HTTP Methods:** Appropriate HTTP methods (GET, POST, PUT, DELETE) are generally used for their intended operations.

## Specific Endpoint Group Summaries (Excluding Auth Endpoints)

*   **`app/api/drivers/**`:** Unauthenticated; no RBAC; basic input validation for POST.
*   **`app/api/locations/**`:** Unauthenticated; no RBAC; basic input validation for POST.
*   **`app/api/routes/**`:** Unauthenticated; no RBAC; basic input validation for POST (checks `shipment_id` presence). Contains business logic for truck/driver status updates.
*   **`app/api/shipments/**`:** Unauthenticated; no RBAC; basic input validation for POST.
*   **`app/api/trucks/**`:** Unauthenticated; no RBAC; basic input validation for POST.

## Overall Recommendations:

1.  **Prioritize Authentication:** Implement mandatory authentication checks on all resource API endpoints that are not explicitly public. Leverage the existing JWT 'session' cookie mechanism.
2.  **Implement RBAC:** Once authentication is in place, add role-based authorization to all endpoints based on defined business rules and user roles (which need to be refined, including adding an `ADMIN` role and fixing case inconsistencies).
3.  **Standardize on Prisma Client:** Migrate database queries from `executeQuery` with raw SQL to Prisma Client's typed query builders for consistency, type safety, and maintainability, even though `executeQuery` appears to be SQLi-safe.
4.  **Comprehensive Input Validation:** Implement thorough input validation (e.g., using Zod) for all incoming data on all `POST` and `PUT` requests.
5.  **Implement `reset-password` functionality.**
6.  **Review and enforce a single, consistent authentication system** (preferably the JWT-based one in `app/api/auth/`, deprecating the custom cookie logic in `app/actions/auth.ts`).
7.  **Consider application-level rate limiting** as a defense-in-depth measure.
8.  Ensure the **JWT secret is strong and managed securely**, not using default fallback values in production.
