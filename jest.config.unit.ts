import config from './jest.config'

config.modulePathIgnorePatterns = [
  '<rootDir>/test/integration',
  '<rootDir>/test/functional',
  '<rootDir>/test/check-remaining-data'
]
delete config.globalSetup
delete config.testTimeout
console.log('RUNNING UNIT TESTS')

export default config
