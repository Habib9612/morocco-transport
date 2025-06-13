# Common Vulnerabilities Analysis Report

This report details potential common vulnerabilities found within the MarocTransit platform codebase, based on a targeted review of specific areas.

## 1. Cross-Site Scripting (XSS)

**a. Session Cookie Accessible to JavaScript (`httpOnly: false`)**
*   **File:** `app/actions/auth.ts`
*   **Issue:** The custom "user" session cookie is set with the `httpOnly: false` attribute:
    ```typescript
    // Set cookie with user data
    cookies().set({
      name: "user",
      value: JSON.stringify(userData),
      httpOnly: false, // Allow JavaScript access
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    })
    ```
*   **Vulnerability:** Setting `httpOnly` to `false` allows client-side JavaScript to access the session cookie. If an XSS vulnerability exists anywhere else on the site (e.g., through injection of user-supplied data into the DOM), an attacker could execute script to steal this cookie. This would allow them to hijack the user's session.
*   **Mitigation:** The session cookie should be set with `httpOnly: true` to prevent access from client-side scripts. Ensure that any client-side JavaScript that needs user information gets it through other means (e.g., an API endpoint, or data embedded in the initial page load by the server if using NextAuth.js session handling correctly).

**b. Potential CSS Injection via `dangerouslySetInnerHTML` in Chart Component**
*   **File:** `components/ui/chart.tsx`
*   **Issue:** The `ChartStyle` component uses `dangerouslySetInnerHTML` to inject CSS styles generated from a `config` prop:
    ```tsx
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
    ${prefix} [data-chart=${id}] {
    ${colorConfig
      .map(([key, itemConfig]) => {
        const color =
          itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
          itemConfig.color
        return color ? `  --color-${key}: ${color};` : null
      })
      .join("\n")}
    }
    `
          )
          .join("\n"),
      }}
    />
    ```
*   **Vulnerability:** If the `color` values or other parts of `itemConfig` that contribute to the generated CSS string can be controlled by un-sanitized user input (e.g., if users can save and share chart configurations), this could lead to CSS injection. While modern browsers have mitigated many direct XSS vectors through CSS (like `expression()`), it can still be used to deface pages, potentially load external resources in some contexts, or in older browsers, might have more severe XSS implications.
*   **Mitigation:**
    *   Ensure that any user-supplied values contributing to the `config` prop (especially color strings or theme elements) are strictly validated and sanitized. For colors, use a whitelist of allowed formats (e.g., hex, rgba) or a color picker that generates safe values.
    *   Avoid constructing CSS as strings if possible. If dynamic styles are needed, prefer manipulating CSS Custom Properties directly on DOM elements if the chart library supports it, or use a safer CSS-in-JS approach if applicable.

## 2. SQL Injection (Potential - Dependent on `executeQuery` Implementation)

*   **Files:** `app/actions/auth.ts`, `app/actions/shipments.ts`, `app/api/shipments/route.ts`, `app/api/trucks/route.ts` (and others using `executeQuery` from `lib/db.ts`).
*   **Issue:** These files use a utility function `executeQuery` for database operations with raw SQL queries. For example, in `app/actions/shipments.ts`:
    ```typescript
    const result = await executeQuery(
      `INSERT INTO shipments
       (tracking_number, customer_id, origin_id, destination_id, status, priority,
        weight, volume, scheduled_pickup, scheduled_delivery)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        trackingNumber,
        customer_id,
        origin_id,
        // ... other parameters
      ],
    )
    ```
*   **Vulnerability Assessment:** The use of placeholders like `$1`, `$2` strongly suggests that `executeQuery` is intended to be used with **parameterized queries**. If `executeQuery` correctly implements parameterized queries (i.e., it sends the SQL template and parameters to the database driver separately, without string interpolation), then the risk of SQL injection is **low**.
*   **Critical Dependency:** The security against SQL injection entirely depends on the **correct and secure implementation of `executeQuery` in `lib/db.ts`**. If `executeQuery` were to simply interpolate the parameters into the SQL string, these queries would be highly vulnerable.
*   **Mitigation:**
    *   **Verify `executeQuery`:** The implementation of `lib/db.ts` and its `executeQuery` function **must be reviewed** to confirm it uses a secure method for parameterization provided by the PostgreSQL driver (e.g., `pg.query(text, values)`).
    *   **Prefer ORM Usage:** Transitioning from raw SQL to using the Prisma Client (already set up in the project) for database operations would significantly reduce the risk of SQL injection, as Prisma Client handles query generation and parameterization securely. This was also noted as a general code quality/consistency issue in previous reports.

## 3. Cross-Site Request Forgery (CSRF)

*   **Files:** `app/actions/auth.ts`, `app/actions/shipments.ts` (and other server actions).
*   **Issue:** These server actions perform state-changing operations (login, signup, create shipment, etc.).
*   **Vulnerability Assessment:** Next.js Server Actions are designed with built-in CSRF protection mechanisms, particularly when invoked from Client Components using forms or function calls. These protections generally rely on HTTP headers and SameSite cookie attributes. The session cookie in `app/actions/auth.ts` is set with `sameSite: "strict"`, which provides strong CSRF defense for supporting browsers.
*   **Potential Gaps (Low Risk if using Server Actions correctly):**
    *   If these actions were ever exposed or callable in ways that bypass the typical Next.js Server Action invocation flow (e.g., if they were somehow triggered by traditional GET requests or from forms submitted from outside the Next.js application without proper token handling), CSRF could become a concern.
    *   The custom API routes (e.g., `app/api/shipments/route.ts`) would also need CSRF protection if they handle state-changing operations and are session-based. Standard Next.js API routes do not have automatic CSRF protection like server actions do; it would need to be implemented manually (e.g., using libraries like `csurf` or custom token generation/validation).
*   **Mitigation:**
    *   Continue to use Server Actions as intended within the Next.js framework to leverage built-in CSRF protections.
    *   If creating traditional API endpoints that modify state and rely on cookie-based sessions, implement standard CSRF protection patterns (e.g., double-submit cookie, synchronizer token pattern).

## 4. Improper Error Handling (Low Current Risk Noted)

*   **Files:** `app/actions/auth.ts`, `app/actions/shipments.ts`, API routes.
*   **Issue:** Error handling in the reviewed server actions and API routes generally returns generic error messages to the client (e.g., "Invalid credentials," "Failed to create shipment").
*   **Assessment:** This is good practice as it avoids leaking potentially sensitive information (stack traces, detailed database errors, file paths) to the client. Server-side `console.error` is used for logging details, which is appropriate.
*   **Mitigation/Best Practice:** Ensure this pattern of generic client-facing errors and detailed server-side logging is consistently applied across all backend code. Ensure logs do not inadvertently contain overly sensitive user data.

## 5. Security-Relevant Configurations (`next.config.mjs`)

*   **File:** `next.config.mjs`
*   **Assessment:** The reviewed `next.config.mjs` (eslint, typescript, images.unoptimized settings) does not currently contain any obvious security misconfigurations. Standard security headers (like those configurable via `next.config.js headers` function) are not explicitly set here, but Next.js may apply some defaults.
*   **Mitigation/Consideration:** Review and implement security headers as needed (e.g., `Content-Security-Policy`, `X-Content-Type-Options`, `Strict-Transport-Security`) via `next.config.js` to further harden the application. This was outside the scope of the current specific scan.

**Note:** This report is based on a limited review of specific files and patterns. A comprehensive security audit would require a more in-depth analysis of the entire codebase, runtime environment, and dependencies. The `executeQuery` implementation in `lib/db.ts` is a critical point for SQL injection verification.
