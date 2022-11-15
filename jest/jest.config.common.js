module.exports = {
  preset: 'ts-jest',
  roots: ['<rootDir>/../src'],
  setupFiles: ['<rootDir>/jestSetup'],
  setupFilesAfterEnv: ['<rootDir>/nock.ts', '@relmify/jest-fp-ts', 'jest-extended/all'],
  testTimeout: 10000,
}
