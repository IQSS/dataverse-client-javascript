var config = require('./jest.config');
// Temporarily ignore old tests
config.modulePathIgnorePatterns = ['<rootDir>/test/old', '<rootDir>/test/unit'];
console.log('RUNNING INTEGRATION TESTS');
module.exports = config;
