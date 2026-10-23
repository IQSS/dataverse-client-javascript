import axios from 'axios'
import { randomUUID } from 'node:crypto'
import { Blob } from '@web-std/file'
import { TestConstants } from '../TestConstants'

export const DATASET_TREE_ENDPOINT_AVAILABLE_ENV_VAR = 'TEST_DATASET_TREE_ENDPOINT_AVAILABLE'

const MISSING_ENDPOINT_MESSAGE_FRAGMENT = 'API endpoint does not exist'

const DATAVERSE_API_REQUEST_HEADERS = {
  headers: { 'Content-Type': 'application/json', 'X-Dataverse-Key': process.env.TEST_API_KEY }
}

export const isDatasetTreeEndpointAvailableViaApi = async (): Promise<boolean> => {
  const response = await axios.get(
    `${TestConstants.TEST_API_URL}/datasets/0/versions/:latest/tree`,
    {
      ...DATAVERSE_API_REQUEST_HEADERS,
      validateStatus: () => true
    }
  )
  const message = typeof response.data?.message === 'string' ? response.data.message : ''
  return !message.includes(MISSING_ENDPOINT_MESSAGE_FRAGMENT)
}

export const datasetTreeEndpointIsAvailable = (): boolean =>
  process.env[DATASET_TREE_ENDPOINT_AVAILABLE_ENV_VAR] === 'true'

export const uploadTreeFixtureFileViaApi = async (
  datasetId: number,
  label: string,
  directoryLabel?: string
): Promise<void> => {
  const formData = new FormData()
  const content = `tree fixture ${directoryLabel ?? ''}/${label} ${randomUUID()}`
  formData.append('file', new Blob([content]), label)
  formData.append(
    'jsonData',
    JSON.stringify(directoryLabel === undefined ? { label } : { label, directoryLabel })
  )

  await axios.post(`${TestConstants.TEST_API_URL}/datasets/${datasetId}/add`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'X-Dataverse-Key': process.env.TEST_API_KEY
    }
  })
}

export const createDatasetTreeFixtureViaApi = async (datasetId: number): Promise<void> => {
  await uploadTreeFixtureFileViaApi(datasetId, 'root.txt')
  await uploadTreeFixtureFileViaApi(datasetId, 'a.txt', 'data')
  await uploadTreeFixtureFileViaApi(datasetId, 'b.txt', 'data')
  await uploadTreeFixtureFileViaApi(datasetId, 'c.txt', 'data/sub')
  await uploadTreeFixtureFileViaApi(datasetId, 'readme.md', 'docs')
}
