/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // Transpile TypeScript files
  },
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  testMatch: ['**/*.test.ts'], // or use `**/__tests__/**/*.ts`

   moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // 👈 This line tells Jest how to resolve @/
  },
}
