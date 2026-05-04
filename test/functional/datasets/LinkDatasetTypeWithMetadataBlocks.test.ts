import { randomUUID } from 'node:crypto'
import {
  ApiConfig,
  DatasetType,
  addDatasetType,
  deleteDatasetType,
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
      const randomName = `datasetType-${randomUUID().slice(0, 6)}`
      const actual: DatasetType = await addDatasetType.execute({
        name: randomName,
        linkedMetadataBlocks: [],
        availableLicenses: [],
        displayName: randomName,
        description: 'A dataset type created for testing purposes'
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

      const deleted: void = await deleteDatasetType.execute(actual.id as number)
      expect(deleted).toEqual({ message: 'deleted' })
    })
  })
})
