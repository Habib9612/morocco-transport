# Data Security Analysis Report

This report assesses how sensitive data is stored, transmitted, and handled within the MarocTransit platform, based on a review of the codebase.

## 1. Identification of Sensitive Data

The `prisma/schema.prisma` defines several models containing fields that can be considered sensitive:

*   **User Model:**
    *   `email`: Personally Identifiable Information (PII).
    *   `password`: Highly sensitive credential.
    *   `name`: PII.
    *   `phone`: PII.
    *   `company`: Potentially sensitive business information.
    *   `avatar`: URL to an image, could be PII.
*   **Location Model:**
    *   `address`, `city`, `state`, `country`, `postalCode`, `latitude`, `longitude`: Can be sensitive PII if representing a private address (e.g., a user's home used as a pickup/dropoff point). For public business locations, this is less sensitive.
*   **Shipment Model:**
    *   `price`: Financial data (currently unused in core logic).
    *   Details linking `shipperId` (User) to `originId` and `destinationId` (Locations) could reveal patterns or specific activities.
*   **Maintenance Model:**
    *   `cost`: Financial data (currently unused).

## 2. Data Storage Security

*   **Password Storage:**
    *   **JWT Auth System (`app/api/auth/signup/route.ts`):** Passwords are hashed using `bcryptjs.hash()` before being stored in the database (Prisma `User.password` field). This is good practice.
    *   **Custom Auth System (`app/actions/auth.ts`):** Passwords are also hashed using `bcryptjs.hash()`. However, this system appears to interact with a `password_hash` database column, which is inconsistent with the `User.password` field defined in the Prisma schema. This discrepancy should be resolved, but the core principle of hashing is applied.
*   **API Keys and Secrets:**
    *   **JWT Secret (`app/api/auth/login/route.ts`, `app/api/auth/session/route.ts`):** The JWT signing and verification uses `process.env.JWT_SECRET || 'your-secret-key'`. The fallback to a hardcoded default secret (`'your-secret-key'`) is a **critical security vulnerability** if the `JWT_SECRET` environment variable is not properly set in production. This default secret is publicly known and would allow attackers to forge valid JWTs.
    *   **Database URL (`prisma/schema.prisma`):** Sourced from `env("DATABASE_URL")`, which is standard and secure practice, assuming the environment variable itself is managed securely.
    *   No other instances of hardcoded API keys or secrets were found in the specifically reviewed files. A full codebase scan for hardcoded secrets would be beneficial as a general best practice.

## 3. Data Transmission Security

*   **HTTPS:** Assumed to be enforced at the infrastructure level (e.g., by the hosting provider like Vercel). This is crucial for protecting all data in transit. Codebase cannot enforce this directly, but configurations should ensure no http:// links are used for sensitive operations.
*   **Cookie Security:**
    *   **JWT 'session' Cookie (from `app/api/auth/login/route.ts`):**
        *   `httpOnly: true`: Correctly set, preventing client-side JavaScript access.
        *   `secure: process.env.NODE_ENV === 'production'`: Correctly set, ensuring the cookie is sent only over HTTPS in production.
        *   `sameSite: 'lax'`: A good default for balancing security (CSRF protection) and usability.
    *   **Custom "user" Cookie (from `app/actions/auth.ts`):**
        *   `httpOnly: false`: **This is a significant security vulnerability.** It allows client-side JavaScript to access the cookie, making it susceptible to theft via XSS attacks.
        *   `secure: process.env.NODE_ENV === "production"`: Correctly set.
        *   `sameSite: "strict"`: Provides strong CSRF protection.
    *   **Recommendation:** The custom "user" cookie system should be deprecated in favor of the more secure JWT 'session' cookie system. If retained for any reason, its `httpOnly` attribute must be set to `true`.

## 4. Data Handling in Code

*   **Sensitive Data Logging:**
    *   Error logging in API routes and server actions (e.g., `app/actions/auth.ts`, `app/api/shipments/route.ts`, `lib/db.ts`) uses `console.error(error)`.
    *   While direct logging of plaintext passwords or full user objects before hashing/sanitization was not observed, the content of the logged `error` objects themselves could potentially include sensitive input parameters if the underlying libraries (e.g., database driver) include them in error details. This risk is generally low for typical database errors but should be kept in mind.
    *   **Recommendation:** Review the verbosity of error objects from key libraries in a controlled environment to ensure they don't leak excessive detail. Consider structured logging that allows for filtering or redacting sensitive fields if necessary.

*   **Sensitive Data Exposure in API Responses:**
    *   **Auth Endpoints (`app/api/auth/*`):** These endpoints correctly exclude the password hash from user objects returned in API responses (using Prisma's `select` or object destructuring). This is good.
    *   **Resource Endpoints (Shipments, Drivers, Trucks, etc.):** These endpoints (e.g., `app/api/shipments/route.ts`) often return most or all fields from the queried tables (`SELECT *` or `SELECT s.*`).
        *   **Concern:** The primary issue here is the **lack of authentication** on these resource APIs (as detailed in `api_security_analysis.md`). Without authentication, any data returned by these endpoints is effectively public.
        *   If authentication and authorization were properly implemented, the data returned (e.g., shipment details, location data, truck info) seems contextually appropriate for authorized users. However, data minimization principles should always be applied – only return the data necessary for the specific use case.
    *   **Recommendation:** Implement robust authentication and authorization on all API endpoints first. Then, review data exposure for each endpoint to ensure it adheres to the principle of least privilege based on the authenticated user's role.

*   **File Upload Security:**
    *   No file upload functionality (e.g., for user avatars, shipment documents, driver licenses) was identified in the reviewed portions of the codebase.
    *   **Recommendation (if feature is planned/exists elsewhere):** Secure file uploads require careful implementation, including:
        *   Validating file types and sizes.
        *   Scanning for malware.
        *   Storing uploaded files in a secure, non-web-accessible location (e.g., a dedicated storage bucket).
        *   Using secure mechanisms to serve these files, with appropriate authorization checks.

## 5. Recommendations for Improving Data Security

1.  **Standardize on Secure Auth System:** Deprecate the custom "user" cookie system (`app/actions/auth.ts`) and exclusively use the JWT-based system in `app/api/auth/` which has better cookie security (`httpOnly: true`).
2.  **Mandatory Strong JWT Secret:** Ensure `process.env.JWT_SECRET` is always set to a strong, unique secret in all environments, especially production. Remove the insecure fallback default.
3.  **Enforce Authentication & Authorization on All Resource APIs:** As highlighted in `api_security_analysis.md`, this is critical to prevent unauthorized data access and modification.
4.  **Review and Minimize Data Exposure:** For each API endpoint, ensure only necessary data is returned, especially after authentication/authorization is implemented.
5.  **Secure File Handling:** If/when file upload features are implemented, follow security best practices for validation, scanning, and storage.
6.  **Dependency Review for Logging:** Periodically review how errors from key dependencies (database drivers, external APIs) are structured to ensure they don't inadvertently log sensitive inputs passed to them.
7.  **Regular Security Audits:** Conduct regular, more comprehensive security audits of the codebase and infrastructure.
8.  **Resolve Prisma Schema vs. DB Discrepancy:** The difference between `User.password` (Prisma) and `password_hash` (custom auth queries) should be rectified to maintain data model consistency and clarity.
