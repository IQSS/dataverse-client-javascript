import config from './jest.config'

config.modulePathIgnorePatterns = ['<rootDir>/test/unit']
console.log('RUNNING INTEGRATION TESTS')

export default config
