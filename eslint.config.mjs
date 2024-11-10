import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.ts"],
    rules: {
      semi: ["error", "always"],
      'prefer-const': "warn",
      "indent-legacy": ["warn", 2],
      quotes: ["error", "single"],
      '@typescript-eslint/no-unused-vars': "warn",
    },
    languageOptions: { globals: globals.node }
  },
];