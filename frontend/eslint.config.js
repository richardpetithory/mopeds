import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

const files = ["src/**/*.ts", "src/**/*.tsx"];

export default [
  {
    ...eslint.configs.recommended,
    ignores: ["terraform/*", "public/*", "src/legacy/*.js"],
    files,
  },
  ...tseslint.configs.recommended.map((c) => ({...c, files})),
  {
    name: "uptime-com",
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parserOptions: {
        projectService: true,
      },
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      "jsx-a11y": jsxA11y,
      "react-refresh": reactRefresh,
      "react-hooks": reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": ["error", {vars: "all", args: "after-used", ignoreRestSiblings: false}],
      "jsx-a11y/anchor-is-valid": "warn",
      "jsx-a11y/interactive-supports-focus": "warn",
      "jsx-a11y/no-static-element-interactions": "warn",
      "jsx-a11y/click-events-have-key-events": "warn",
      "jsx-a11y/no-noninteractive-element-interactions": "warn",
      "@typescript-eslint/no-empty-object-type": "off",
    },
    files: ["src/**/*.ts", "src/**/*.tsx"],
  },
  eslintConfigPrettier,
];
