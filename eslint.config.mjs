import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/**
 * Architecture import-boundary enforcement (Clean Architecture).
 * The authoritative graph check lives in tests/architecture; these ESLint
 * rules give fast, in-editor feedback for the most important violations.
 */
const boundaryRules = [
  {
    name: "domain-boundary",
    files: ["src/shared/domain/**/*.ts", "src/modules/*/domain/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["react", "react-dom", "next", "next/*"],
              message: "Domain layer must not import framework code (React/Next).",
            },
            {
              group: ["@/components/*", "@/app/*"],
              message: "Domain layer must not import presentation.",
            },
            {
              group: ["**/infrastructure/*", "@/modules/*/infrastructure/*"],
              message: "Domain layer must not import infrastructure.",
            },
          ],
        },
      ],
    },
  },
  {
    name: "application-boundary",
    files: ["src/shared/application/**/*.ts", "src/modules/*/application/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["react", "react-dom", "next", "next/*"],
              message: "Application layer must not import framework code.",
            },
            {
              group: ["**/infrastructure/*", "@/modules/*/infrastructure/*"],
              message: "Application layer must not import concrete infrastructure; depend on ports.",
            },
          ],
        },
      ],
    },
  },
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  ...boundaryRules,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
