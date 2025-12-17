export default {
  testEnvironment: "node",
  collectCoverage: false,
  preset: 'ts-jest/presets/default-esm',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      useESM: true
    }]
  },
  moduleNameMapper: {
    '^@evershop/postgres-query-builder$': '<rootDir>/packages/postgres-query-builder/dist/index.js',
    '^@evershop/postgres-query-builder/(.*)$': '<rootDir>/packages/postgres-query-builder/dist/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(@evershop)/)"
  ],
  testMatch: [
    "<rootDir>/packages/**/src/**/__tests__/**/*.test.[jt]s",
    "<rootDir>/packages/**/src/**/*.test.[jt]s"
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "services/login",
    "services/logout",
    "services/session"
  ],
  extensionsToTreatAsEsm: ['.ts', '.tsx']
};
