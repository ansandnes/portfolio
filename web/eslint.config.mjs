import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";

/** @type {import("eslint").Linter.Config[]} */
const eslintConfig = [
  {
    ignores: [".next/**", "node_modules/**", "coverage/**", "next-env.d.ts"],
  },

  ...nextCoreWebVitals,
  ...nextTypescript,

  // Must come last: disables stylistic rules that would fight Prettier.
  prettier,

  {
    rules: {
      // --- Baseline relaxations -------------------------------------------------
      // These fire almost entirely on code scheduled for rewrite in Phases 2-4.
      // Set to "warn" (lint still exits 0) so Phase 1 does not edit files it is
      // not responsible for. Re-tighten to "error" in the phase noted, then
      // delete the entry.

      // TODO(phase-3): re-enable. Apostrophes in JSX copy across the page
      //   components; that copy moves into content/ in Phase 3.
      "react/no-unescaped-entities": "warn",

      // TODO(phase-3): re-enable. `any` lives in LanguageContext.tsx (deleted in
      //   Phase 3) and a few `(window as any)` casts (GoogleTranslate, removed).
      "@typescript-eslint/no-explicit-any": "warn",

      // TODO(phase-2): re-enable as "error". Unused imports in layout.tsx and
      //   Navbar.tsx are removed during the App Router cleanup.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
];

export default eslintConfig;
