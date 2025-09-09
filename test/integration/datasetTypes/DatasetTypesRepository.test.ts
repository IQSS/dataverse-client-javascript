import {
  ApiConfig,
  DataverseApiAuthMechanism
} from '../../../src/core/infra/repositories/ApiConfig'
import { TestConstants } from '../../testHelpers/TestConstants'
import { DatasetTypesRepository } from '../../../src/datasetTypes/infra/repositories/DatasetTypesRepository'
// import { LicensesRepository } from '../../../src/licenses/infra/repositories/LicensesRepository'

describe('DatasetTypesRepository', () => {
  const sut: DatasetTypesRepository = new DatasetTypesRepository()

  describe('getAvailableDatasetTypes', () => {
    beforeAll(async () => {
      ApiConfig.init(
        TestConstants.TEST_API_URL,
        DataverseApiAuthMechanism.API_KEY,
        process.env.TEST_API_KEY
      )
    })

    test('should return list of available dataset types', async () => {
      const actual = await sut.getAvailableDatasetTypes()

      const datasetTypes = [
        {
          id: 1,
          name: 'dataset',
          linkedMetadataBlocks: [],
          availableLicenses: []
        }
      ]

      expect(actual).toEqual(datasetTypes)
    })
  })
})
