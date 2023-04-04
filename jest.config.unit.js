var config = require('./jest.config');
// Temporarily ignore old tests
config.modulePathIgnorePatterns = ['<rootDir>/test/old', '<rootDir>/test/integration'];
console.log('RUNNING UNIT TESTS');
module.exports = config;
