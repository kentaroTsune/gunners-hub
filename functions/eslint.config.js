
import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        // Node.js グローバル変数
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        exports: 'writable',
        global: 'readonly',
        module: 'writable',
        require: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        setImmediate: 'readonly',
        clearImmediate: 'readonly',
        
        // Web APIs（Node.js 18+で利用可能）
        fetch: 'readonly',
        Response: 'readonly',
        Request: 'readonly',
        Headers: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'error',
      'quotes': 'off',
      'indent': 'off',
      'max-len': 'off',
      'no-console': 'off',
      'semi': 'off',
      'comma-dangle': 'off',
      'object-curly-spacing': 'off',
      'space-before-function-paren': 'off',
      'prefer-const': 'warn',
    },
  },
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        // Node.js グローバル変数
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        exports: 'writable',
        global: 'readonly',
        module: 'writable',
        require: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        setImmediate: 'readonly',
        clearImmediate: 'readonly',
        
        // Web APIs
        fetch: 'readonly',
        Response: 'readonly',
        Request: 'readonly',
        Headers: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      // TypeScript用の緩いルール
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'no-unused-vars': 'off', // TypeScript版を使用
      'no-undef': 'off', // TypeScriptが型チェック
      'quotes': 'off',
      'indent': 'off',
      'max-len': 'off',
      'no-console': 'off',
      'semi': 'off',
      'comma-dangle': 'off',
      'object-curly-spacing': 'off',
      'space-before-function-paren': 'off',
      'prefer-const': 'warn',
    },
  },
  {
    ignores: [
      'lib/**/*',
      'generated/**/*',
      '*.config.js',
      'node_modules/**/*',
      'coverage/**/*',
    ],
  },
];