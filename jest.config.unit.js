var config = require('./jest.config');
config.modulePathIgnorePatterns = ['<rootDir>/test/integration'];
console.log('RUNNING UNIT TESTS');
module.exports = config;
