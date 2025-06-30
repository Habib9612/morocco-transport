// Migrated from .eslintrc.json and .eslintignore for ESLint v9+

const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat();

module.exports = [
  {
    ignores: [".next", "node_modules", "dist"],
    ...compat.extends("next/core-web-vitals"),
    ...compat.extends("next/typescript"),
    {
      ignores: [
        "components/components:error-boundary.tsx.ts",
        "lib/lib:auth-context.integration.test.tsx.ts"
      ],
      ignorePatterns: [".next", "node_modules", "dist"]
    }
  }
]; 