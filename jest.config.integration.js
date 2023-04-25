var config = require('./jest.config');
config.modulePathIgnorePatterns = ['<rootDir>/test/unit'];
console.log('RUNNING INTEGRATION TESTS');
module.exports = config;
