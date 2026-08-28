module.exports = {
  root: true,
  extends: ['eslint-config-expo'],
  ignorePatterns: ['/dist/*'],
  rules: {
    'no-console': ['error', { allow: ['warn', 'error'] }],
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/ban-ts-comment': 'error',
  },
  overrides: [
    {
      // CLI build tooling, not app runtime — console output is its purpose.
      files: ['scripts/**/*.ts'],
      rules: { 'no-console': 'off' },
    },
  ],
};
