import * as fs from 'fs'
import { DockerComposeEnvironment, Wait } from 'testcontainers'
import axios from 'axios'
import { TestConstants } from '../../testHelpers/TestConstants'
import datasetJson1 from '../../testHelpers/datasets/test-dataset-1.json'
import datasetJson2 from '../../testHelpers/datasets/test-dataset-2.json'

const COMPOSE_FILE = 'docker-compose.yml'

const CONTAINER_DATAVERSE_BOOTSTRAP_NAME = 'test_dataverse_bootstrap'
const CONTAINER_DATAVERSE_BOOTSTRAP_END_MESSAGE =
  'Done, your instance has been configured for development. Have a nice day!'
const CONTAINERS_STARTUP_TIMEOUT = 300000

const API_ALLOW_TOKEN_LOOKUP_ENDPOINT = '/admin/settings/:AllowApiTokenLookupViaApi'
const API_KEY_USER_ENDPOINT = '/builtin-users/dataverseAdmin/api-token'
const API_KEY_USER_PASSWORD = 'admin1'

export default async function setupTestEnvironment(): Promise<void> {
  await setupContainers()
  await setupApiKey()
  await setupTestFixtures()
}

async function setupContainers(): Promise<void> {
  console.log('Cleaning up old container volumes...')
  fs.rmSync(`${__dirname}/docker-dev-volumes`, { recursive: true, force: true })
  console.log('Running test containers...')
  await new DockerComposeEnvironment(__dirname, COMPOSE_FILE)
    .withStartupTimeout(CONTAINERS_STARTUP_TIMEOUT)
    .withWaitStrategy(
      CONTAINER_DATAVERSE_BOOTSTRAP_NAME,
      Wait.forLogMessage(CONTAINER_DATAVERSE_BOOTSTRAP_END_MESSAGE)
    )
    .up()
  console.log('Test containers up and running')
}

async function setupApiKey(): Promise<void> {
  console.log('Obtaining test API key...')
  await axios.put(`${TestConstants.TEST_API_URL}${API_ALLOW_TOKEN_LOOKUP_ENDPOINT}`, 'true')
  const response = await axios.get(
    `${TestConstants.TEST_API_URL}${API_KEY_USER_ENDPOINT}?password=${API_KEY_USER_PASSWORD}`
  )
  process.env.TEST_API_KEY = response.data.data.message
  console.log('API key obtained')
}

async function setupTestFixtures(): Promise<void> {
  console.log('Creating test datasets...')
  await createDatasetViaApi(datasetJson1)
  await createDatasetViaApi(datasetJson2)
  console.log('Test datasets created')
  await waitForDatasetsIndexingInSolr()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function createDatasetViaApi(datasetJson: any): Promise<void> {
  await axios.post(
    `${TestConstants.TEST_API_URL}/dataverses/root/datasets`,
    datasetJson,
    buildRequestHeaders()
  )
}

async function waitForDatasetsIndexingInSolr(): Promise<void> {
  console.log('Waiting for datasets indexing in Solr...')
  let datasetsIndexed = false
  let retry = 0
  while (!datasetsIndexed && retry < 10) {
    try {
      const response = await axios.get(
        `${TestConstants.TEST_API_URL}/search?q=*&type=dataset`,
        buildRequestHeaders()
      )
      const nDatasets = response.data.data.items.length
      if (nDatasets === 2) {
        datasetsIndexed = true
      }
    } catch (error) {
      console.error(
        `Tests setup: Error while waiting for datasets indexing in Solr: [${
          error.response.status
        }]${error.response.data ? ` ${error.response.data.message}` : ''}`
      )
    }
    await new Promise((resolve) => setTimeout(resolve, 1000))
    retry++
  }
  if (!datasetsIndexed) {
    throw new Error('Tests setup: Timeout reached while waiting for datasets indexing in Solr')
  }
  console.log('Datasets indexed in Solr')
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildRequestHeaders(): any {
  return {
    headers: { 'Content-Type': 'application/json', 'X-Dataverse-Key': process.env.TEST_API_KEY }
  }
}
