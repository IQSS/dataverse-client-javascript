import { ApiConfig } from '../../../src'
import { getAvailableDatasetTypes } from '../../../src/datasetTypes'
import { DatasetType } from '../../../src/datasetTypes/domain/models/DatasetType'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import { TestConstants } from '../../testHelpers/TestConstants'

describe('getAvailableDatasetTypes', () => {
  describe('execute', () => {
    beforeAll(async () => {
      ApiConfig.init(
        TestConstants.TEST_API_URL,
        DataverseApiAuthMechanism.API_KEY,
        process.env.TEST_API_KEY
      )
    })

    test('should return available dataset types', async () => {
      const actualDatasetTypes: DatasetType[] = await getAvailableDatasetTypes.execute()
      const expectedDatasetTypes = [
        {
          id: 1,
          name: 'dataset',
          linkedMetadataBlocks: [],
          availableLicenses: []
        }
      ]

      expect(actualDatasetTypes).toEqual(expectedDatasetTypes)
    })
  })
})
