const { DockerComposeEnvironment, Wait } = require('testcontainers');

const composeFilePath = './test/integration/environment';
const composeFile = 'docker-compose.yml';

const containersBootstrappingEndMessage = 'Done, your instance has been configured for development. Have a nice day!';
const containersStartupTimeOut = 300000;

module.exports = async () => {
  console.log('Running test containers...');
  await new DockerComposeEnvironment(composeFilePath, composeFile)
    .withStartupTimeout(containersStartupTimeOut)
    .withWaitStrategy('test_dataverse_bootstrap', Wait.forLogMessage(containersBootstrappingEndMessage))
    .up();
  console.log('Test containers up and running...');
};
