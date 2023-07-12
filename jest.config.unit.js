var config = require('./jest.config');
config.modulePathIgnorePatterns = ['<rootDir>/test/integration'];
delete config.globalSetup;
console.log('RUNNING UNIT TESTS');
module.exports = config;
