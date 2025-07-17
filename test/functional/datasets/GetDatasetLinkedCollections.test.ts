import {
  ApiConfig,
  createDataset,
  getDatasetLinkedCollections,
  linkDataset,
  WriteError
} from '../../../src'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import {
  createCollectionViaApi,
  deleteCollectionViaApi
} from '../../testHelpers/collections/collectionHelper'
import { deleteUnpublishedDatasetViaApi } from '../../testHelpers/datasets/datasetHelper'
import { TestConstants } from '../../testHelpers/TestConstants'

describe('execute', () => {
  const testCollectionAlias = 'getDatasetLinkedCollectionsFunctionalTestCollection'
  beforeEach(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
  })

  it('should return empty array when no collections are linked', async () => {
    const createdDatasetIdentifiers = await createDataset.execute(
      TestConstants.TEST_NEW_DATASET_DTO
    )
    const linkedCollections = await getDatasetLinkedCollections.execute(
      createdDatasetIdentifiers.numericId
    )
    expect(linkedCollections.length).toBe(0)
    await deleteUnpublishedDatasetViaApi(createdDatasetIdentifiers.numericId)
  })

  it('should return linked collections for a dataset', async () => {
    const createdDatasetIdentifiers = await createDataset.execute(
      TestConstants.TEST_NEW_DATASET_DTO
    )
    await createCollectionViaApi(testCollectionAlias)

    await linkDataset.execute(createdDatasetIdentifiers.numericId, testCollectionAlias)

    const linkedCollections = await getDatasetLinkedCollections.execute(
      createdDatasetIdentifiers.numericId
    )
    expect(linkedCollections.length).toBe(1)
    expect(linkedCollections[0].alias).toBe(testCollectionAlias)

    await deleteUnpublishedDatasetViaApi(createdDatasetIdentifiers.numericId)
    await deleteCollectionViaApi(testCollectionAlias)
  })

  it('should return error when dataset does not exist', async () => {
    const nonExistentDatasetId = 99999

    await expect(getDatasetLinkedCollections.execute(nonExistentDatasetId)).rejects.toBeInstanceOf(
      WriteError
    )
  })
})
