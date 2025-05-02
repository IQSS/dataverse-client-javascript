import config from './jest.config'

config.modulePathIgnorePatterns = ['<rootDir>/test/unit', '<rootDir>/test/integration']
console.log('RUNNING FUNCTIONAL TESTS')

export default config
