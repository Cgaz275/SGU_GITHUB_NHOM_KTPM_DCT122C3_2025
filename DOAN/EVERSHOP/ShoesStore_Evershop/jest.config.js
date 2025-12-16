export default {
  testEnvironment: "node",
  collectCoverage: true,
  collectCoverageFrom: [
    "packages/evershop/dist/**/*.js",
    "packages/postgres-query-builder/dist/**/*.js",
    "!**/*.test.js",
    "!**/node_modules/**",
    "!**/dist/**/*.test.js"
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/dist/.*\\.test\\.js$"
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  moduleNameMapper: {
    '^@evershop/postgres-query-builder$': '<rootDir>/packages/postgres-query-builder/dist/index.js',
    '^@evershop/postgres-query-builder/(.*)$': '<rootDir>/packages/postgres-query-builder/dist/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(@evershop)/)"
  ],
  testMatch: ["**/dist/**/tests/**/unit/**/*.test.[jt]s"],
  modulePathIgnorePatterns: ["<rootDir>/packages/evershop/src/"]
};
