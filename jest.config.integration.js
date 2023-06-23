var config = require('./jest.config');
config.modulePathIgnorePatterns = ['<rootDir>/test/unit'];
config.globalSetup = '<rootDir>/test/integration/environment/setup.js';
console.log('RUNNING INTEGRATION TESTS');
module.exports = config;
