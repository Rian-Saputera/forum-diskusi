import js from '@eslint/js';
import globals from 'globals';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';

const baseRules = {
  'react-hooks/rules-of-hooks': 'error',
  'react-hooks/exhaustive-deps': 'warn',
  'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  'no-console': ['warn', { allow: ['warn', 'error'] }],
  'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
  'no-var': 'error',
  'prefer-const': 'error',
  'prefer-arrow-callback': 'error',
  'arrow-body-style': ['error', 'as-needed'],
  'object-shorthand': 'error',
  'no-param-reassign': ['error', { props: false }],
  'no-use-before-define': ['error', { functions: false, classes: true, variables: true }],
  'eqeqeq': ['error', 'always'],
  'curly': ['error', 'all'],
  'no-duplicate-imports': 'error',
  'no-shadow': 'warn',
};

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'build/**', '.storybook/**'],
  },
  js.configs.recommended,
  // App source files
  {
    files: ['src/**/*.{js,jsx}'],
    plugins: {
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: baseRules,
  },
  // Test files (vitest globals)
  {
    files: ['src/**/*.test.{js,jsx}', 'src/**/__tests__/**/*.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        vi: 'readonly',
      },
    },
    rules: {
      ...baseRules,
      'no-shadow': 'off',
    },
  },
  // Cypress E2E files
  {
    files: ['cypress/**/*.{js,jsx,cy.js,cy.jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        cy: 'readonly',
        Cypress: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        before: 'readonly',
        after: 'readonly',
        context: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'off',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
  // Config files
  {
    files: ['*.config.{js,cjs,mjs}', 'cypress.config.js', 'vitest.config.js'],
    languageOptions: {
      globals: { ...globals.node },
    },
    rules: {
      'no-unused-vars': 'warn',
    },
  },
];
