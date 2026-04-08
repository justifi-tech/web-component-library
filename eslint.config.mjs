import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

const repoRoot = import.meta.dirname;

/** Rules that need strictNullChecks or are too noisy for this codebase today */
const relaxTypeCheckedRules = {
  "@typescript-eslint/no-unsafe-assignment": "off",
  "@typescript-eslint/no-unsafe-call": "off",
  "@typescript-eslint/no-unsafe-member-access": "off",
  "@typescript-eslint/no-unsafe-argument": "off",
  "@typescript-eslint/no-unsafe-return": "off",
  "@typescript-eslint/prefer-nullish-coalescing": "off",
  "@typescript-eslint/no-unnecessary-condition": "off",
  "@typescript-eslint/no-confusing-void-expression": "off",
  "@typescript-eslint/restrict-template-expressions": "off",
  "@typescript-eslint/no-base-to-string": "off",
  "@typescript-eslint/no-redundant-type-constituents": "off",
  "@typescript-eslint/no-unnecessary-type-parameters": "off",
  "@typescript-eslint/no-unsafe-enum-comparison": "off",
  "@typescript-eslint/no-unsafe-unary-minus": "off",
  "@typescript-eslint/prefer-promise-reject-errors": "off",
  "@typescript-eslint/no-require-imports": "off",
  "@typescript-eslint/no-unused-expressions": "off",
  "@typescript-eslint/use-unknown-in-catch-callback-variable": "off",
  "@typescript-eslint/no-misused-promises": "off",
  "@typescript-eslint/await-thenable": "off",
  "@typescript-eslint/no-floating-promises": "off",
  "@typescript-eslint/no-meaningless-void-operator": "off",
  "@typescript-eslint/only-throw-error": "off",
  "@typescript-eslint/related-getter-setter-pairs": "off",
  "@typescript-eslint/no-invalid-void-type": "off",
  "@typescript-eslint/no-for-in-array": "off",
  "@typescript-eslint/restrict-plus-operands": "off",
  "@typescript-eslint/no-explicit-any": "off",
  "@typescript-eslint/no-unnecessary-type-assertion": "off",
  "@typescript-eslint/require-await": "off",
  "@typescript-eslint/ban-ts-comment": "off",
  "@typescript-eslint/no-unsafe-function-type": "off",
  "@typescript-eslint/unbound-method": "off",
  "@typescript-eslint/no-empty-object-type": "off",
  "@typescript-eslint/no-wrapper-object-types": "off",
  "@typescript-eslint/no-unsafe-declaration-merging": "off",
};

export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.stencil/**",
      "**/coverage/**",
      "**/*.css",
      "**/loader/**",
      "pnpm-lock.yaml",
      "**/*.snap",
      "**/tsup.config.ts",
    ],
  },
  {
    files: ["packages/webcomponents/**/*.{ts,tsx}"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: "./packages/webcomponents/tsconfig.json",
        tsconfigRootDir: repoRoot,
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    rules: {
      ...relaxTypeCheckedRules,
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: [
      "packages/webcomponents/src/**/*.spec.ts",
      "packages/webcomponents/src/**/*.spec.tsx",
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.jest,
      },
    },
  },
  {
    files: ["packages/types/**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: "./packages/types/tsconfig.json",
        tsconfigRootDir: repoRoot,
      },
      globals: {
        ...globals.es2021,
      },
    },
    rules: {
      ...relaxTypeCheckedRules,
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
);
