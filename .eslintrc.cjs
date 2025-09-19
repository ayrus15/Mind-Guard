module.exports = {
  root: true,
  env: {
    node: true,
    es2020: true,
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'prettier'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'node_modules'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
  overrides: [
    {
      files: ['frontend/src/**/*.{ts,tsx}'],
      env: {
        browser: true,
      },
      extends: [
        'eslint:recommended',
        '@typescript-eslint/recommended',
        'prettier'
      ],
      plugins: ['@typescript-eslint', 'prettier'],
    }
  ]
};