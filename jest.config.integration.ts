import config from './jest.config'

config.modulePathIgnorePatterns = ['<rootDir>/test/unit', '<rootDir>/test/functional']
console.log('RUNNING INTEGRATION TESTS')

export default config
