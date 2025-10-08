import path from 'node:path';
import { fileURLToPath } from 'node:url';

import eslint from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';
import { FlatCompat } from '@eslint/eslintrc';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // игноры
  {
    ignores: [
      '**/dist',
      '**/build',
      '**/out',
      '**/.next',
      '**/public',
      '**/*.cjs',
      '**/node_modules',
      'next-env.d.ts',
    ],
  },

  // базовый ESLint
  eslint.configs.recommended,

  // TypeScript строгий + стилистика
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,

  // Next.js (через FlatCompat)
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // TypeScript файлы
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.eslint.json'],
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/no-useless-empty-export': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'warn',
      '@typescript-eslint/no-unnecessary-condition': 'warn',
    },
  },

  // React + React Hooks
  {
    plugins: {
      react,
      'react-hooks': reactHooks,
      import: importPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'no-console': 'warn',
      'eol-last': ['error', 'always'],
      'linebreak-style': ['error', 'unix'],

      // react
      'react/prop-types': 'off',
      'react/display-name': 'off',
      'react/no-unknown-property': 'error',
      'react/self-closing-comp': 'error',

      // react-hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // import order
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling'],
            'index',
            'object',
            'type',
          ],
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: '*.scss',
              group: 'index',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          'newlines-between': 'always',
          warnOnUnassignedImports: true,
        },
      ],
    },
  },
];
