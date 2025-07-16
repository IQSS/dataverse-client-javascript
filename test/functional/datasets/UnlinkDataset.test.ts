import { ApiConfig, createDataset, linkDataset, unlinkDataset, WriteError } from '../../../src'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import {
  createCollectionViaApi,
  deleteCollectionViaApi
} from '../../testHelpers/collections/collectionHelper'
import { deleteUnpublishedDatasetViaApi } from '../../testHelpers/datasets/datasetHelper'
import { TestConstants } from '../../testHelpers/TestConstants'

describe('execute', () => {
  const testCollectionAlias = 'unlinkDatasetFunctionalTestCollection'
  beforeEach(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
  })

  it('should unlink a dataset from a collection', async () => {
    const createdDatasetIdentifiers = await createDataset.execute(
      TestConstants.TEST_NEW_DATASET_DTO
    )
    await createCollectionViaApi(testCollectionAlias)

    await linkDataset.execute(createdDatasetIdentifiers.numericId, testCollectionAlias)

    const result = await unlinkDataset.execute(
      createdDatasetIdentifiers.numericId,
      testCollectionAlias
    )

    expect(result).toBeUndefined()

    await deleteUnpublishedDatasetViaApi(createdDatasetIdentifiers.numericId)
    await deleteCollectionViaApi(testCollectionAlias)
  })

  it('should throw error when dataset is not linked to the collection', async () => {
    const createdDatasetIdentifiers = await createDataset.execute(
      TestConstants.TEST_NEW_DATASET_DTO
    )
    await createCollectionViaApi(testCollectionAlias)

    await expect(
      unlinkDataset.execute(createdDatasetIdentifiers.numericId, testCollectionAlias)
    ).rejects.toBeInstanceOf(WriteError)

    await deleteCollectionViaApi(testCollectionAlias)
  })
})
