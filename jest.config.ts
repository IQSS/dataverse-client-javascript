import type { Config } from 'jest'

const config: Config = {
  roots: ['<rootDir>/test'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts$',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  coveragePathIgnorePatterns: ['node_modules', 'testHelpers'],
  globalSetup: '<rootDir>/test/integration/environment/setup.ts',
  testTimeout: 25000
}

export default config;
