import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import unicornPlugin from "eslint-plugin-unicorn";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import sonarjsPlugin from "eslint-plugin-sonarjs";

export default [
  { ignores: ["dist", "node_modules"] },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "jsx-a11y": jsxA11yPlugin,
      unicorn: unicornPlugin,
      sonarjs: sonarjsPlugin,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11yPlugin.configs.recommended.rules,
      ...unicornPlugin.configs.recommended.rules,
      ...sonarjsPlugin.configs.recommended.rules,

      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],

      // React
      "react/prop-types": "off",
      "react/jsx-no-target-blank": "off",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // Unicorn Plugin Rules
      "unicorn/filename-case": "off",
      "unicorn/prevent-abbreviations": "warn",

      // SonarJS Plugin Rules
      "sonarjs/pseudo-random": "off",
    },
  },
];
