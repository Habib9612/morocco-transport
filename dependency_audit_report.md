# Dependency Audit Report

This report summarizes the findings from an attempted dependency audit of the MarocTransit platform.

## 1. `npm audit` Execution Attempt

*   **Command:** `npm audit`
*   **Outcome:** Failed
*   **Error Message:** "Failed to compute affected file count and total size after command execution. This is unexpected. All changes to the repo have been rolled back."
*   **Analysis:** This is a persistent critical error encountered when running `npm` commands (including `npm run lint` previously) via the `run_in_bash_session` tool. This error prevents automated vulnerability scanning of dependencies using `npm audit`. The rollback behavior also complicates any attempts to modify the environment or `package.json` for further testing.

## 2. Manual `package.json` Review

Due to the failure of `npm audit`, a high-level manual review of `package.json` was performed.

**Key Observations & Potential Concerns:**

*   **Overabundance of Database-Related Dependencies:**
    *   A very large number of database clients, ORMs, and related tools are listed as dependencies (e.g., `@prisma/client`, multiple SQL and NoSQL clients for various cloud providers like AWS RDS, Neon, PlanetScale, TiDB Cloud, Xata, as well as `better-sqlite3`, `drizzle-orm`, `knex`, `kysely`, `mysql2`, `pg`, `postgres`, `sql.js`, `sqlite3`).
    *   **Potential Impact:** This significantly increases the project's attack surface. Each additional dependency is a potential source of vulnerabilities. It also suggests that the codebase might contain unused dependencies, experimental code, or an overly complex data layer. It is highly unlikely that all these are actively and necessarily used by the core application.
    *   **Recommendation:** Identify and remove any unused database dependencies. Consolidate on a primary database stack (e.g., Prisma with PostgreSQL, which seems to be the intent for core features).

*   **Use of `latest` Tag for Many Dependencies:**
    *   Numerous dependencies are specified with the version `latest`.
    *   **Potential Impact:** Using `latest` can lead to unexpected breaking changes when new versions are released by package maintainers. It also makes builds less reproducible, as the exact versions pulled can vary between installs.
    *   **Recommendation:** Pin dependencies to specific versions, preferably using semantic versioning ranges (e.g., `^1.2.3` for minor updates, or fixed versions for critical stability). Use a tool like `npm outdated` regularly to check for updates and apply them intentionally.

*   **Use of Bleeding-Edge Major Versions:**
    *   `next: "15.2.4"` (assuming this is not a typo for a 14.x version, as 14.x is the current stable line).
    *   `react: "^19"`, `react-dom: "^19"` (React 19 is very recent).
    *   **Potential Impact:** Using very new or potentially unstable major versions can introduce new bugs or vulnerabilities that haven't been widely discovered or patched.
    *   **Recommendation:** Evaluate if these newer versions are essential. If stability is paramount, consider using the latest stable LTS (Long Term Support) versions or widely adopted stable releases.

*   **Unnecessary Type Definitions:**
    *   `@types/bcryptjs: "^3.0.0"` is listed. Previous `npm install` logs indicated this is a deprecated stub package as `bcryptjs` now includes its own types.
    *   **Recommendation:** Remove `@types/bcryptjs`.

*   **Peer Dependency Conflict (Previously Overridden):**
    *   A peer dependency conflict between `date-fns@4.1.0` and `react-day-picker@8.10.1` was noted in previous `npm install` attempts and bypassed using `--legacy-peer-deps`.
    *   **Potential Impact:** This can lead to runtime errors or unexpected behavior if the versions are truly incompatible.
    *   **Recommendation:** Investigate compatible versions for `date-fns` and `react-day-picker` to resolve this conflict properly.

**General Recommendations:**

1.  **Resolve `npm audit` Execution Blocker:** The underlying issue preventing `npm audit` (and other `npm` commands) from running in the provided environment needs to be fixed. This is critical for enabling automated vulnerability scanning.
2.  **Dependency Cleanup:** Conduct a thorough review of all dependencies in `package.json`.
    *   Remove unused packages, especially the numerous database clients if they are not needed.
    *   Pin versions for all dependencies instead of using `latest`.
3.  **Regularly Update Dependencies:** Once versions are pinned, establish a process for regularly checking for and applying security updates (e.g., `npm outdated`, Dependabot, Snyk).
4.  **Address Specific Version Issues:**
    *   Remove `@types/bcryptjs`.
    *   Resolve the `date-fns` / `react-day-picker` version conflict.
    *   Carefully consider the stability and necessity of using Next.js 15 and React 19 if they are indeed pre-stable releases.

**Conclusion:**
Without a successful `npm audit` run, a definitive list of CVEs and specific vulnerable package versions cannot be provided. However, the manual review of `package.json` reveals several risky practices (over-dependency, use of `latest`, very new major versions) that should be addressed to improve the project's security posture and stability. The failure of `npm audit` itself is a critical blocker that needs immediate attention.
