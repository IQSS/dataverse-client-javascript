import {
  ApiConfig,
  DatasetType,
  addDatasetType,
  linkDatasetTypeWithMetadataBlocks
} from '../../../src'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import { TestConstants } from '../../testHelpers/TestConstants'

describe('LinkDatasetTypeWithMetadataBlocks', () => {
  describe('execute', () => {
    beforeAll(async () => {
      ApiConfig.init(
        TestConstants.TEST_API_URL,
        DataverseApiAuthMechanism.API_KEY,
        process.env.TEST_API_KEY
      )
    })

    test('should allow for linking a dataset type to metadata blocks', async () => {
      const randomName = `datasetType-${crypto.randomUUID().slice(0, 6)}`
      const actual: DatasetType = await addDatasetType.execute({
        name: randomName,
        linkedMetadataBlocks: [],
        availableLicenses: []
      })
      expect(actual.name).toEqual(randomName)

      const linked: void = await linkDatasetTypeWithMetadataBlocks.execute(actual.id as number, [
        'geospatial'
      ])
      expect(linked).toEqual({
        linkedMetadataBlocks: {
          before: [],
          after: ['geospatial']
        }
      })
    })
  })
})
