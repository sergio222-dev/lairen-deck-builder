import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { globalIgnores } from "eslint/config";
import { qwikEslint9Plugin } from "eslint-plugin-qwik";

const ignores = [
  "**/*.log",
  "**/.DS_Store",
  // "**/*.",
  ".vscode/settings.json",
  "**/.history/**",
  "**/.yarn/**",
  // "**/bazel-*",
  // "**/bazel-bin",
  // "**/bazel-out",
  // "**/bazel-qwik",
  "**/bazel-testlogs",
  "**/dist/**",
  "**/dist-dev/**",
  // "**/lib",
  // "**/lib-types",
  // "**/etc",
  // "**/external",
  "**/node_modules/**",
  // "**/temp",
  // "**/tsc-out",
  // "**/tsdoc-metadata.json",
  // "**/target",
  "**/output/**",
  "**/rollup.config.js",
  // "**/build",
  "**/.cache/**",
  "**/.vscode/**",
  // "**/.rollup.cache",
  "**/dist/**",
  "**/tsconfig.tsbuildinfo",
  "**/vite.config.ts",
  "**/*.spec.tsx",
  "**/*.spec.ts",
  "**/.netlify",
  "**/pnpm-lock.yaml",
  "**/package-lock.json",
  "**/yarn.lock",
  "**/server/**",
  "eslint.config.js",
];

export default tseslint.config(
  globalIgnores(ignores),
  js.configs.recommended,
  tseslint.configs.recommendedTypeChecked, // Bug with no unussed var
  qwikEslint9Plugin.configs.recommended,
  {
    // plugins: {
    //   "@typescript-eslint": tseslint.plugin,
    // },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        ...globals.serviceworker,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      '@typescript-eslint/ban-ts-comment': 'error',
      'no-array-constructor': 'off',
      '@typescript-eslint/no-array-constructor': 'error',
      '@typescript-eslint/no-duplicate-enum-values': 'error',
      '@typescript-eslint/no-empty-object-type': 'error',
      '@typescript-eslint/no-extra-non-null-assertion': 'error',
      '@typescript-eslint/no-misused-new': 'error',
      '@typescript-eslint/no-namespace': 'error',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/no-this-alias': 'error',
      '@typescript-eslint/no-unnecessary-type-constraint': 'error',
      '@typescript-eslint/no-unsafe-declaration-merging': 'error',
      '@typescript-eslint/no-unsafe-function-type': 'error',
      'no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-expressions': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-wrapper-object-types': 'error',
      '@typescript-eslint/prefer-as-const': 'error',
      '@typescript-eslint/prefer-namespace-keyword': 'error',
      '@typescript-eslint/triple-slash-reference': 'error',
    },
  },
);

