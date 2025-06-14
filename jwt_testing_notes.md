# Testing Strategy for JWT Secret Handling

This document outlines strategies for testing the robustness of JWT secret handling within the application, particularly focusing on the behavior when `process.env.JWT_SECRET` is not properly configured. Direct unit testing of `process.env` manipulation can be tricky and sometimes unreliable depending on the test runner and environment.

## 1. Manual/Configuration Testing (Critical)

This is the most straightforward and crucial way to test this specific aspect.

*   **Objective:** Verify that the application fails safe (i.e., does not operate with an insecure default secret) if `process.env.JWT_SECRET` is missing or empty.
*   **Procedure:**
    1.  **Environment Setup:** Run the application in a controlled test/staging environment where you can manipulate environment variables.
    2.  **Scenario 1: `JWT_SECRET` is undefined.**
        *   Unset or remove the `JWT_SECRET` environment variable entirely.
        *   Start the application.
        *   **Expected Outcome:** The application server should log a "CRITICAL: JWT_SECRET is not defined..." error during startup or upon the first attempt to use the JWT signing/verification functions (e.g., in `app/api/auth/login/route.ts`, `app/api/auth/session/route.ts`, or any protected API like shipments). API endpoints that attempt to sign or verify JWTs should return a 500 "Internal server configuration error" or similar, preventing authentication or session validation.
    3.  **Scenario 2: `JWT_SECRET` is an empty string.**
        *   Set `JWT_SECRET=""`.
        *   Start the application.
        *   **Expected Outcome:** Same as Scenario 1. The code explicitly checks `if (!jwtSecret)`, which should treat an empty string as a falsy value, triggering the error path.
*   **Verification:** Check server logs for the critical error message. Attempt to use authentication features (login, access protected routes) and confirm they fail with appropriate server-side errors, not with tokens signed by a default/weak key.

## 2. Integration Testing (If Environment Allows More Control)

If the testing environment or CI/CD pipeline allows for more sophisticated control over environment variables per test run or test suite, more automated integration tests could be devised.

*   **Objective:** Automate the verification that API endpoints fail correctly when the JWT secret is misconfigured.
*   **Approach (Conceptual):**
    1.  **Test Suite 1 (No `JWT_SECRET`):**
        *   Run a test suite where `process.env.JWT_SECRET` is explicitly unset before the application server starts for that suite.
        *   Make API calls to login endpoints or protected endpoints.
        *   **Expected Outcome:** Assert that these API calls return 500-level errors related to server configuration or 401 errors if the verification path is reached but fails due to the missing secret for verification.
    2.  **Test Suite 2 (Mismatched Secrets - Advanced):**
        *   This is more complex. It would involve having a way to make the application sign a token with one secret (e.g., "SECRET_A") and then configure the verification part (e.g., in a middleware or another API call) to expect "SECRET_B".
        *   **Expected Outcome:** Verification should fail, resulting in 401 Unauthorized. This tests that the verification process correctly uses the configured `JWT_SECRET`.
*   **Challenges:**
    *   Manipulating `process.env` effectively and reliably within a single test runner process for different test cases can be difficult, as `process.env` is global. Test runners might execute tests in parallel or reuse processes.
    *   This often requires external scripts to run the application with different environment configurations for each test scenario.

## 3. Code Review and Static Analysis

*   **Objective:** Ensure the pattern of checking for `process.env.JWT_SECRET` and failing if it's not set is consistently applied wherever JWTs are signed or verified.
*   **Procedure:**
    *   Regularly review all code locations that use `process.env.JWT_SECRET`.
    *   Ensure no fallback to a default weak secret exists.
    *   Use static analysis tools (linters with custom rules, if possible) to flag any direct usage of default secrets in JWT operations.

**Conclusion on Testing JWT Secret Handling:**
The most reliable method for verifying the critical JWT secret handling is through **manual configuration testing** in a controlled environment. Integration tests can provide some automation if the environment supports per-test environment variable overrides, but this is often non-trivial. Code reviews remain essential to ensure the secure pattern is consistently applied. The critical aspect is that the application **must not operate** with a known weak or default JWT secret.
