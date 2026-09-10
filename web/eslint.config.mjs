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
      // TODO(phase-4): re-enable as "error". Remaining hits are raw quotes/
      //   apostrophes in the testimonial-card markup, which Phase 4 extracts
      //   into a shared <TestimonialCard /> component.
      "react/no-unescaped-entities": "warn",

      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
];

export default eslintConfig;
