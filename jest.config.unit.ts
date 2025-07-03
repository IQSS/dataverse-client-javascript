import config from './jest.config'

config.modulePathIgnorePatterns = ['<rootDir>/test/integration', '<rootDir>/test/functional']
delete config.globalSetup
delete config.testTimeout
console.log('RUNNING UNIT TESTS')

export default config
