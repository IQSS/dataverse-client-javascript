import config from './jest.config'

config.modulePathIgnorePatterns = ['<rootDir>/test/integration']
delete config.globalSetup
delete config.testTimeout
console.log('RUNNING UNIT TESTS')

export default config
