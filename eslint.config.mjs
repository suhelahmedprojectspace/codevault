import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';
import js from '@eslint/js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  js.configs.recommended,
  ...compat.extends(
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ),
  {
    files: ['**/*.ts', '**/*.tsx'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: './tsconfig.json',
      tsconfigRootDir: __dirname,
    },
    rules: {
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-misused-promises': 'error',
      'react/no-unescaped-entities': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      'react/jsx-key': 'error',
      '@next/next/no-img-element': 'warn',
      'prefer-const': 'error',
    },
  },
  {
    ignores: ['.next/', 'node_modules/'],
  },
];