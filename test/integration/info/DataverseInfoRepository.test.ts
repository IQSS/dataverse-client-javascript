import { DataverseInfoRepository } from '../../../src/info/infra/repositories/DataverseInfoRepository'
import {
  ApiConfig,
  DataverseApiAuthMechanism
} from '../../../src/core/infra/repositories/ApiConfig'
import { TestConstants } from '../../testHelpers/TestConstants'
import { setMaxEmbargoDurationInMonthsViaApi } from '../../testHelpers/info/infoHelper'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'

describe('DataverseInfoRepository', () => {
  const sut: DataverseInfoRepository = new DataverseInfoRepository()

  beforeAll(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
  })

  describe('getDataverseVersion', () => {
    test('should return Dataverse version', async () => {
      const actual = await sut.getDataverseVersion()
      expect(typeof actual.number).toBe('string')
    })
  })

  describe('getZipDownloadLimit', () => {
    test('should return zip download limit', async () => {
      const actual = await sut.getZipDownloadLimit()
      expect(typeof actual).toBe('number')
    })
  })

  describe('getMaxEmbargoDurationInMonths', () => {
    test('should return error when the setting does not exist', async () => {
      const errorExpected: ReadError = new ReadError(
        '[404] Setting :MaxEmbargoDurationInMonths not found'
      )

      await expect(sut.getMaxEmbargoDurationInMonths()).rejects.toThrow(errorExpected)
    })

    test('should return duration when the setting exists', async () => {
      const testMaxEmbargoDurationInMonths = 12
      await setMaxEmbargoDurationInMonthsViaApi(testMaxEmbargoDurationInMonths)
      const actual = await sut.getMaxEmbargoDurationInMonths()

      expect(actual).toBe(testMaxEmbargoDurationInMonths)
    })
  })
})
