# Backend Security Test Drafts and Strategies

This document outlines drafted unit tests and testing strategies for key backend security features, including API authentication/authorization and JWT secret handling.

## 1. Shipment API Authentication and Authorization Tests

*   **Test File Created:** `app/api/shipments/shipments-api.test.ts`
*   **Testing Framework Assumed:** Jest, with mocking capabilities for Next.js and other modules.
*   **Dependencies Mocked:**
    *   `next/headers` (for `cookies()`)
    *   `jsonwebtoken` (for `verify()`)
    *   `@/lib/db` (for `prismaDb.user.findUnique()` and `executeQuery`)

*   **Test Cases Drafted:**

    *   **Authentication:**
        *   **No Session Cookie:** Verifies that a request to a protected shipment route (e.g., `GET /api/shipments`) without a 'session' cookie returns a 401 Unauthorized error.
        *   **Invalid/Expired JWT:** Verifies that a request with an invalid or expired JWT results in a 401 error. This test mocks `jsonwebtoken.verify` to throw JWT-specific errors.
        *   **User Not Found for JWT:** Verifies that if the `userId` in a valid JWT does not correspond to an existing user in the database, a 401 error is returned. This mocks `prismaDb.user.findUnique` to return `null`.
        *   **Successful Authentication:** Verifies that a request with a valid JWT and a corresponding user proceeds (e.g., returns a 200 status for GET, or 201 for POST, assuming the underlying original handler logic is mocked to succeed).

    *   **Authorization (Role-Based Access Control - Conceptual Roles):**
        *   These tests build upon successful authentication (i.e., a valid user object with a role is established).
        *   **Create Shipment (POST `/api/shipments`):**
            *   Tests that a user with an 'INDIVIDUAL' role is allowed (returns 201).
            *   Tests that a user with a 'CARRIER' role is forbidden (returns 403).
        *   **Delete Shipment (DELETE `/api/shipments/[id]`):**
            *   Tests that a user with an 'INDIVIDUAL' role is allowed (conceptual, assuming ownership or broader permission for this role for now).
            *   Tests that a user with a 'CARRIER' role is forbidden (returns 403).
        *   **Get Specific Shipment (GET `/api/shipments/[id]`):**
            *   Tests that a user with a 'CARRIER' role is allowed (as per the defined conceptual rules).
        *   *(Other PUT scenarios would follow similar patterns based on defined rules).*

*   **Notes on Shipment API Tests:**
    *   The tests rely heavily on mocking the authentication dependencies (`cookies`, `verify`, `prismaDb.user.findUnique`) to isolate the logic within the API route handlers.
    *   The authorization tests use conceptual roles (`INDIVIDUAL`, `CARRIER`, `COMPANY`) based on the Prisma schema. The lack of an `ADMIN` role and inconsistencies in role string casing (uppercase in Prisma Enum, lowercase in JWT signup validation) are known limitations affecting real-world applicability until resolved.
    *   Finer-grained authorization (e.g., ownership checks like "user can only delete their own shipment") is not covered in these initial drafts but would be a necessary addition.

## 2. JWT Secret Handling Testing Strategy

*   **Strategy Document:** `jwt_testing_notes.md`
*   **Summary of Strategy:**
    *   **Manual/Configuration Testing (Primary):**
        *   The most critical test involves running the application in a controlled environment with `process.env.JWT_SECRET` explicitly unset or set to an empty string.
        *   The expected outcome is that the server logs critical errors and API endpoints requiring JWT signing or verification fail with 500-level server configuration errors, preventing insecure operation with a default/weak key.
    *   **Integration Testing (Conditional):**
        *   If the test environment allows per-suite/per-test environment variable manipulation, automated integration tests could verify that API endpoints fail correctly when `JWT_SECRET` is misconfigured.
        *   Advanced tests could check for mismatched signing/verification keys.
    *   **Code Review & Static Analysis:**
        *   Regularly review code to ensure the pattern of checking `process.env.JWT_SECRET` and failing securely is consistently applied.
        *   Discourage or lint against any fallback to default secrets.

*   **Reasoning:** Direct unit testing of `process.env` states is often unreliable. Therefore, a combination of manual configuration testing and vigilant code review, supplemented by integration tests where feasible, is recommended for JWT secret handling.

**Overall Status:**
Test cases have been drafted for key security aspects of the shipment APIs. A strategy for verifying robust JWT secret handling has been outlined. These tests and strategies are conceptual due to the current inability to run test environments or Node.js scripts reliably. They provide a solid foundation for when the tooling/environment issues are resolved.
