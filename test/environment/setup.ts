import * as fs from 'fs'
import { DockerComposeEnvironment, Wait } from 'testcontainers'
import axios from 'axios'
import { TestConstants } from '../testHelpers/TestConstants'

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
  await axios
    .get(`${TestConstants.TEST_API_URL}${API_KEY_USER_ENDPOINT}?password=${API_KEY_USER_PASSWORD}`)
    .then((response) => {
      process.env.TEST_API_KEY = response.data.data.message
    })
    .catch(() => {
      console.error('Tests setup: Error while obtaining API key')
    })
  console.log('API key obtained')
}
