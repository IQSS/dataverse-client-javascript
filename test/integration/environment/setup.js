const fs = require('fs');
const { DockerComposeEnvironment, Wait } = require('testcontainers');
const axios = require('axios');
const { TestConstants } = require('../../testHelpers/TestConstants');

const COMPOSE_FILE_PATH = './test/integration/environment';
const COMPOSE_FILE = 'docker-compose.yml';

const CONTAINER_DATAVERSE_BOOTSTRAP_NAME = 'test_dataverse_bootstrap';
const CONTAINER_DATAVERSE_BOOTSTRAP_END_MESSAGE =
  'Done, your instance has been configured for development. Have a nice day!';
const CONTAINERS_STARTUP_TIMEOUT = 300000;

const ALLOW_API_TOKEN_LOOKUP_ENDPOINT = '/admin/settings/:AllowApiTokenLookupViaApi';
const API_KEY_USER_ENDPOINT = '/builtin-users/dataverseAdmin/api-token';
const API_KEY_USER_PASSWORD = 'admin1';

module.exports = async () => {
  console.log('Cleaning up old container volumes...');
  fs.rmSync(`${__dirname}/docker-dev-volumes`, { recursive: true, force: true });
  console.log('Running test containers...');
  await new DockerComposeEnvironment(COMPOSE_FILE_PATH, COMPOSE_FILE)
    .withStartupTimeout(CONTAINERS_STARTUP_TIMEOUT)
    .withWaitStrategy(CONTAINER_DATAVERSE_BOOTSTRAP_NAME, Wait.forLogMessage(CONTAINER_DATAVERSE_BOOTSTRAP_END_MESSAGE))
    .up();
  console.log('Test containers up and running');
  console.log('Obtaining test API key...');
  await axios.put(`${TestConstants.TEST_API_URL}${ALLOW_API_TOKEN_LOOKUP_ENDPOINT}`, 'true');
  await axios
    .get(`${TestConstants.TEST_API_URL}${API_KEY_USER_ENDPOINT}?password=${API_KEY_USER_PASSWORD}`)
    .then((response) => (process.env.TEST_API_KEY = response.data.data.message));
  console.log('Test API key obtained');
};
