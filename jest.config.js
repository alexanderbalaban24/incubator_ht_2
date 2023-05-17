/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 100000,
  testRegex: '.e2e.test.ts$',
  rootDir: './__tests__',
  collectCoverage: true,
  collectCoverageFrom: [
    "**/*.{ts,tsx,js,jsx}",
    "!**/*/*.d.ts",
    "!**/coverage/**",
    "!**/node_modules/**"
  ]
};