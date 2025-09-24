import { ApiConfig, DatasetType, addDatasetType, deleteDatasetType } from '../../../src'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import { TestConstants } from '../../testHelpers/TestConstants'

describe('AddDatasetType', () => {
  describe('execute', () => {
    beforeAll(async () => {
      ApiConfig.init(
        TestConstants.TEST_API_URL,
        DataverseApiAuthMechanism.API_KEY,
        process.env.TEST_API_KEY
      )
    })

    test('should allow for adding and deleting a dataset type', async () => {
      const randomName = `datasetType-${crypto.randomUUID().slice(0, 6)}`
      const actual: DatasetType = await addDatasetType.execute({
        name: randomName,
        linkedMetadataBlocks: [],
        availableLicenses: []
      })
      expect(actual.name).toEqual(randomName)

      const deleted: void = await deleteDatasetType.execute(actual.id as number)
      expect(deleted).toEqual({ message: 'deleted' })
    })
  })
})
