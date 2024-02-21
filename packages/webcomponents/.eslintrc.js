const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/*
 * This is a custom ESLint configuration for use a library
 * that utilizes React.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 *
 */

module.exports = {
  extends: [
    "@vercel/style-guide/eslint/browser",
    "@vercel/style-guide/eslint/typescript",
    "@vercel/style-guide/eslint/react",
  ].map(require.resolve),
  overrides: [
    {
      files: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
      extends: [require.resolve("@vercel/style-guide/eslint/jest")],
    },
  ],
  env: {
    node: true,
  },
  parserOptions: {
    project,
    tsconfigRootDir: __dirname,
  },
  plugins: ["only-warn"],
  globals: {
    JSX: true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: ["node_modules/", "dist/", "**/*.css"],
  // add rules configurations here
  rules: {
    "import/no-default-export": "off",
  },
};

// module.exports = {
//   extends: ["@repo/eslint-config/react.js"],
//   parserOptions: {
//     project: "tsconfig.json",
//     sourceType: "module",
//     tsconfigRootDir: __dirname,
//   },
// };
