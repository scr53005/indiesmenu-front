/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom', // Required for React components
  preset: 'ts-jest', // Handles TypeScript and TSX
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/app/$1', // For @/ imports
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy' // For Tailwind CSS
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      useESM: true
    }]
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx']
};

module.exports = config;