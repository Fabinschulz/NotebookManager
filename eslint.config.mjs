import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript', '@rocketseat/eslint-config/react'),
  ...compat.config(
    {
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-empty-function': 'off',  
        '@typescript-eslint/ban-ts-comment': 'off',
        'no-useless-escape': 'off',
        'no-unused-expressions': 'off',
        '@next/next/no-img-element': 'off',
        'react/no-children-prop': 'off',
        'react-hooks/exhaustive-deps': 'off',
        'react/no-unescaped-entities': 'off',
        '@typescript-eslint/no-unused-expressions': 'off',
        'no-unused-vars': 'off',
        'prettier/prettier': 'off',
        '@typescript-eslint/no-empty-object-type': 'off',
      }
    },
    {
      ignores: ['**/*.js', '**/*.cjs']
    }
  )
];

export default eslintConfig;
