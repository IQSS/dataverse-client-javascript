import { ApiConfig, DatasetType, getDatasetAvailableDatasetTypes } from '../../../src'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import { TestConstants } from '../../testHelpers/TestConstants'

describe('getDatasetAvailableDatasetTypes', () => {
  describe('execute', () => {
    beforeAll(async () => {
      ApiConfig.init(
        TestConstants.TEST_API_URL,
        DataverseApiAuthMechanism.API_KEY,
        process.env.TEST_API_KEY
      )
    })

    test('should return available dataset types', async () => {
      const actualDatasetTypes: DatasetType[] = await getDatasetAvailableDatasetTypes.execute()
      const expectedDatasetTypes = {
        id: 1,
        name: 'dataset',
        linkedMetadataBlocks: [],
        availableLicenses: []
      }

      // check that the actual dataset types include the expected dataset types
      // (without requiring an exact match, since other dataset types may be created by concurrent tests)
      expect(actualDatasetTypes).toContainEqual(expectedDatasetTypes)
    })
  })
})
