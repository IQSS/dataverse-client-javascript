import config from './jest.config'

config.modulePathIgnorePatterns = [
  '<rootDir>/test/unit',
  '<rootDir>/test/functional',
  '<rootDir>/test/check-remaining-data'
]
console.log('RUNNING INTEGRATION TESTS')

export default config
