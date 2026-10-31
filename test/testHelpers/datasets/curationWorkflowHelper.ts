import axios from 'axios'
import { randomUUID } from 'node:crypto'
import {
  ApiConfig,
  createCollection,
  createDataset,
  deleteCollection,
  deleteDatasetDraft,
  getDataset,
  getDatasetLocks,
  DatasetNotNumberedVersion,
  DatasetVersionState,
  DatasetLockType,
  CreatedDatasetIdentifiers
} from '../../../src'
import { CollectionType } from '../../../src/collections/domain/models/CollectionType'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import { deletePublishedDatasetViaApi } from './datasetHelper'
import { TestConstants } from '../TestConstants'

export const useCurationAdmin = () => {
  ApiConfig.init(
    TestConstants.TEST_API_URL,
    DataverseApiAuthMechanism.API_KEY,
    process.env.TEST_API_KEY
  )
}

export interface CurationWorkflowFixture {
  dataset: CreatedDatasetIdentifiers
  alias: string
  labels: string[]
  cleanup: () => Promise<void>
}

export const createCurationWorkflowFixture = async (): Promise<CurationWorkflowFixture> => {
  useCurationAdmin()
  const suffix = randomUUID().replace(/-/g, '')
  const alias = `curation${suffix}`
  const labelSet = `Curation${suffix}`
  const labels = ['Privacy Review', 'Final Approval']
  const headers = {
    'X-Dataverse-Key': process.env.TEST_API_KEY,
    'Content-Type': 'application/json'
  }
  const settingsUrl = `${TestConstants.TEST_API_URL}/admin/settings/:AllowedCurationLabels`
  const existing = await axios.get(settingsUrl, {
    headers,
    validateStatus: (status) => status === 200 || status === 404
  })
  const original: string | undefined =
    existing.status === 404 ? undefined : existing.data.data.message
  let settingChanged = false
  let collectionCreated = false
  let dataset: CreatedDatasetIdentifiers | undefined

  const cleanup = async () => {
    useCurationAdmin()
    try {
      if (dataset) {
        const locks = await getDatasetLocks.execute(dataset.numericId)
        if (locks.some((lock) => lock.lockType === DatasetLockType.IN_REVIEW)) {
          await axios.post(
            `${TestConstants.TEST_API_URL}/datasets/${dataset.numericId}/returnToAuthor`,
            { reasonForReturn: 'Integration test cleanup' },
            { headers }
          )
        }
        const latest = await getDataset.execute(
          dataset.numericId,
          DatasetNotNumberedVersion.LATEST,
          true
        )
        if (latest.versionInfo.state === DatasetVersionState.DRAFT) {
          await deleteDatasetDraft.execute(dataset.numericId)
        } else {
          await deletePublishedDatasetViaApi(dataset.persistentId)
        }
      }
      if (collectionCreated) await deleteCollection.execute(alias)
    } finally {
      if (settingChanged) {
        if (original === undefined) await axios.delete(settingsUrl, { headers })
        else await axios.put(settingsUrl, original, { headers })
      }
    }
  }

  try {
    await axios.put(
      settingsUrl,
      { ...(original ? JSON.parse(original) : {}), [labelSet]: labels },
      { headers }
    )
    settingChanged = true
    await createCollection.execute({
      alias,
      name: 'Curation workflow test',
      contacts: ['curation@example.org'],
      type: CollectionType.LABORATORY,
      inheritMetadataBlocksFromParent: true,
      inheritFacetsFromParent: true
    })
    collectionCreated = true
    dataset = await createDataset.execute(TestConstants.TEST_NEW_DATASET_DTO, alias)
    await axios.put(
      `${TestConstants.TEST_API_URL}/datasets/${dataset.numericId}/curationLabelSet`,
      '',
      {
        headers,
        params: { name: labelSet }
      }
    )
    return { dataset, alias, labels, cleanup }
  } catch (error) {
    await cleanup()
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Curation fixture setup failed: ${error.config?.method} ${
          error.config?.url?.split('?')[0]
        } [${error.response?.status}] ${JSON.stringify(error.response?.data)}`
      )
    }
    throw error
  }
}
