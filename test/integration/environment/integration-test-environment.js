const { DockerComposeEnvironment, Wait } = require('testcontainers');
const NodeEnvironment = require('jest-environment-node').TestEnvironment;

const composeFilePath = './test/integration/environment';
const composeFile = 'docker-compose.yml';

const containersBootstrappingEndMessage = 'Done, your instance has been configured for development. Have a nice day!';
const containersStartupTimeOut = 300000;

class IntegrationTestEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);
    this.testPath = context.testPath;
    this.docblockPragmas = context.docblockPragmas;
  }

  async setup() {
    await super.setup();
    console.log('Running test containers...');
    await new DockerComposeEnvironment(composeFilePath, composeFile)
      .withStartupTimeout(containersStartupTimeOut)
      .withWaitStrategy('test_dataverse_bootstrap', Wait.forLogMessage(containersBootstrappingEndMessage))
      .up();
    console.log('Test containers up and running...');
  }
}

module.exports = IntegrationTestEnvironment;
