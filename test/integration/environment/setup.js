const fs = require('fs');
const { DockerComposeEnvironment, Wait } = require('testcontainers');
const axios = require('axios');
const { TestConstants } = require('../../testHelpers/TestConstants');
const datasetJson1 = require('../../testHelpers/datasets/test-dataset-1.json');
const datasetJson2 = require('../../testHelpers/datasets/test-dataset-2.json');

const COMPOSE_FILE = 'docker-compose.yml';

const CONTAINER_DATAVERSE_BOOTSTRAP_NAME = 'test_dataverse_bootstrap';
const CONTAINER_DATAVERSE_BOOTSTRAP_END_MESSAGE =
  'Done, your instance has been configured for development. Have a nice day!';
const CONTAINERS_STARTUP_TIMEOUT = 300000;

const API_ALLOW_TOKEN_LOOKUP_ENDPOINT = '/admin/settings/:AllowApiTokenLookupViaApi';
const API_KEY_USER_ENDPOINT = '/builtin-users/dataverseAdmin/api-token';
const API_KEY_USER_PASSWORD = 'admin1';

module.exports = async () => {
  await setupContainers();
  await setupApiKey();
  await setupTestFixtures();
};

async function setupContainers() {
  console.log('Cleaning up old container volumes...');
  fs.rmSync(`${__dirname}/docker-dev-volumes`, { recursive: true, force: true });
  console.log('Running test containers...');
  await new DockerComposeEnvironment(__dirname, COMPOSE_FILE)
    .withStartupTimeout(CONTAINERS_STARTUP_TIMEOUT)
    .withWaitStrategy(CONTAINER_DATAVERSE_BOOTSTRAP_NAME, Wait.forLogMessage(CONTAINER_DATAVERSE_BOOTSTRAP_END_MESSAGE))
    .up();
  console.log('Test containers up and running');
}

async function setupApiKey() {
  console.log('Obtaining test API key...');
  await axios.put(`${TestConstants.TEST_API_URL}${API_ALLOW_TOKEN_LOOKUP_ENDPOINT}`, 'true');
  await axios
    .get(`${TestConstants.TEST_API_URL}${API_KEY_USER_ENDPOINT}?password=${API_KEY_USER_PASSWORD}`)
    .then((response) => {
      process.env.TEST_API_KEY = response.data.data.message;
    })
    .catch(() => {
      console.error('Tests setup: Error while obtaining API key');
    });
  console.log('API key obtained');
}

async function setupTestFixtures() {
  console.log('Creating test datasets...');
  await createDatasetViaApi(datasetJson1)
    .then()
    .catch((error) => {
      console.error('Tests setup: Error while creating test Dataset 1');
    });
  await createDatasetViaApi(datasetJson2)
    .then()
    .catch((error) => {
      console.error('Tests setup: Error while creating test Dataset 2');
    });
  console.log('Test datasets created');
  await waitForDatasetsIndexingInSolr();
}

async function createDatasetViaApi(datasetJson) {
  return await axios.post(`${TestConstants.TEST_API_URL}/dataverses/root/datasets`, datasetJson, buildRequestHeaders());
}

async function waitForDatasetsIndexingInSolr() {
  console.log('Waiting for datasets indexing in Solr...');
  let datasetsIndexed = false;
  let retry = 0;
  while (!datasetsIndexed && retry < 10) {
    await axios
      .get(`${TestConstants.TEST_API_URL}/search?q=*&type=dataset`, buildRequestHeaders())
      .then((response) => {
        const nDatasets = response.data.data.items.length;
        if (nDatasets == 2) {
          datasetsIndexed = true;
        }
      })
      .catch((error) => {
        console.error(
          `Tests setup: Error while waiting for datasets indexing in Solr: [${error.response.status}]${
            error.response.data ? ` ${error.response.data.message}` : ''
          }`,
        );
      });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    retry++;
  }
  if (!datasetsIndexed) {
    throw new Error('Tests setup: Timeout reached while waiting for datasets indexing in Solr');
  }
  console.log('Datasets indexed in Solr');
}

function buildRequestHeaders() {
  return {
    headers: { 'Content-Type': 'application/json', 'X-Dataverse-Key': process.env.TEST_API_KEY },
  };
}
