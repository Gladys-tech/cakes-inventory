/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testTimeout: 120000,
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    testMatch: ['<rootDir>/tests/**/*.test.ts'],
    // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
