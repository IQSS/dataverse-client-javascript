import { ApiConfig, createDataset, linkDataset, WriteError } from '../../../src'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import {
  createCollectionViaApi,
  deleteCollectionViaApi
} from '../../testHelpers/collections/collectionHelper'
import { deleteUnpublishedDatasetViaApi } from '../../testHelpers/datasets/datasetHelper'
import { TestConstants } from '../../testHelpers/TestConstants'

describe('execute', () => {
  const testCollectionAlias = 'linkDatasetFunctionalTestCollection'
  beforeEach(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
  })

  it('should link a dataset to another collection', async () => {
    const createdDatasetIdentifiers = await createDataset.execute(
      TestConstants.TEST_NEW_DATASET_DTO
    )
    await createCollectionViaApi(testCollectionAlias)

    const result = await linkDataset.execute(
      createdDatasetIdentifiers.numericId,
      testCollectionAlias
    )

    expect(result).toBeUndefined()

    await deleteUnpublishedDatasetViaApi(createdDatasetIdentifiers.numericId)
    await deleteCollectionViaApi(testCollectionAlias)
  })

  it('should throw an error when trying to link a dataset to a non-existent collection', async () => {
    const createdDatasetIdentifiers = await createDataset.execute(
      TestConstants.TEST_NEW_DATASET_DTO
    )
    const nonExistentCollectionAlias = 'nonExistentCollection'

    await expect(
      linkDataset.execute(createdDatasetIdentifiers.numericId, nonExistentCollectionAlias)
    ).rejects.toBeInstanceOf(WriteError)

    await deleteUnpublishedDatasetViaApi(createdDatasetIdentifiers.numericId)
  })

  it('should throw an error when trying to link a dataset that does not exist', async () => {
    await createCollectionViaApi(testCollectionAlias)
    const nonExistentDatasetId = 'nonExistentDatasetId'
    await expect(
      linkDataset.execute(nonExistentDatasetId, testCollectionAlias)
    ).rejects.toBeInstanceOf(WriteError)

    await deleteCollectionViaApi(testCollectionAlias)
  })
})
