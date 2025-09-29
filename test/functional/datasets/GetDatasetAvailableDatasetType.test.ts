import { ApiConfig, DatasetType, getDatasetAvailableDatasetType } from '../../../src'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import { TestConstants } from '../../testHelpers/TestConstants'

describe('getDatasetAvailableDatasetType', () => {
  describe('execute', () => {
    beforeAll(async () => {
      ApiConfig.init(
        TestConstants.TEST_API_URL,
        DataverseApiAuthMechanism.API_KEY,
        process.env.TEST_API_KEY
      )
    })

    test('should return the default available dataset type', async () => {
      const defaultDatasetType = 'dataset'
      const actualDatasetType: DatasetType = await getDatasetAvailableDatasetType.execute(
        defaultDatasetType
      )
      const expectedDatasetType = {
        id: 1,
        name: 'dataset',
        linkedMetadataBlocks: [],
        availableLicenses: []
      }

      expect(actualDatasetType).toEqual(expectedDatasetType)
    })
  })
})
