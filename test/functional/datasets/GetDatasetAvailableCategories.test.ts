import { ApiConfig, createDataset, getDatasetAvailableCategories, ReadError } from '../../../src'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import { deleteUnpublishedDatasetViaApi } from '../../testHelpers/datasets/datasetHelper'
import { CreatedDatasetIdentifiers } from '../../../src/datasets/domain/models/CreatedDatasetIdentifiers'
import { TestConstants } from '../../testHelpers/TestConstants'

describe('execute', () => {
  let createdDatasetIdentifiers: CreatedDatasetIdentifiers
  beforeEach(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
    createdDatasetIdentifiers = await createDataset.execute(TestConstants.TEST_NEW_DATASET_DTO)
  })

  afterEach(async () => {
    deleteUnpublishedDatasetViaApi(createdDatasetIdentifiers.numericId)
  })

  it('should return categories array when a dataset has files categories', async () => {
    const defaultCategories = ['Code', 'Data', 'Documentation']
    const categoriesList = await getDatasetAvailableCategories.execute(
      createdDatasetIdentifiers.numericId
    )
    expect(categoriesList.sort()).toEqual(defaultCategories.sort())
  })

  it('should return error when dataset does not exist', async () => {
    const nonExistentDatasetId = 99999

    await expect(
      getDatasetAvailableCategories.execute(nonExistentDatasetId)
    ).rejects.toBeInstanceOf(ReadError)
  })
})
