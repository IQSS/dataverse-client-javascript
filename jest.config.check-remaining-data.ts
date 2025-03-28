import config from './jest.config'

config.modulePathIgnorePatterns = [
  '<rootDir>/test/unit',
  '<rootDir>/test/functional',
  '<rootDir>/test/integration'
]
console.log('RUNNING TESTS TO GET FILE COUNTS')

export default config
