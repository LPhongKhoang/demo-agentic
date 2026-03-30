export default [
  {
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        Buffer: 'readonly',
        setImmediate: 'readonly',
        clearImmediate: 'readonly',
      },
    },
    rules: {
      'semi': ['warn', 'always'],
      'no-unused-vars': ['warn'],
      'no-undef': 'error',
      'eqeqeq': 'error',
      'curly': 'error',
      'no-console': 'off',
      'prefer-const': 'error',
      'no-var': 'error',
      'arrow-parens': ['warn', 'always'],
    },
  },
];
