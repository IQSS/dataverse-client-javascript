import axios from 'axios'
import { DataverseInfoRepository } from '../../../src/info/infra/repositories/DataverseInfoRepository'
import { ApiConfig, ReadError } from '../../../src'
import { TestConstants } from '../../testHelpers/TestConstants'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'

let sut: DataverseInfoRepository
describe('DataverseInfoRepository', () => {
  beforeEach(() => {
    sut = new DataverseInfoRepository()
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      TestConstants.TEST_DUMMY_API_KEY
    )
  })

  describe('getDataverseVersion', () => {
    test('should return Dataverse version on successful response', async () => {
      const testVersionNumber = '5.13'
      const testVersionBuild = 'testBuild'
      const testSuccessfulResponse = {
        data: {
          status: 'OK',
          data: {
            version: testVersionNumber,
            build: testVersionBuild
          }
        }
      }
      jest.spyOn(axios, 'get').mockResolvedValue(testSuccessfulResponse)

      const actual = await sut.getDataverseVersion()

      expect(axios.get).toHaveBeenCalledWith(
        `${TestConstants.TEST_API_URL}/info/version`,
        TestConstants.TEST_EXPECTED_UNAUTHENTICATED_REQUEST_CONFIG
      )
      expect(actual.number).toMatch(testVersionNumber)
      expect(actual.build).toMatch(testVersionBuild)
    })

    test('should return error result on error response', async () => {
      jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

      let error: ReadError | undefined
      await sut.getDataverseVersion().catch((e) => (error = e))

      expect(axios.get).toHaveBeenCalledWith(
        `${TestConstants.TEST_API_URL}/info/version`,
        TestConstants.TEST_EXPECTED_UNAUTHENTICATED_REQUEST_CONFIG
      )
      expect(error).toBeInstanceOf(Error)
    })
  })

  describe('getZipDownloadLimit', () => {
    test('should return zip download limit on successful response', async () => {
      const testZipDownloadLimit = 100
      const testSuccessfulResponse = {
        data: {
          status: 'OK',
          data: testZipDownloadLimit.toString()
        }
      }
      jest.spyOn(axios, 'get').mockResolvedValue(testSuccessfulResponse)

      const actual = await sut.getZipDownloadLimit()

      expect(axios.get).toHaveBeenCalledWith(
        `${TestConstants.TEST_API_URL}/info/zipDownloadLimit`,
        TestConstants.TEST_EXPECTED_UNAUTHENTICATED_REQUEST_CONFIG
      )
      expect(actual).toBe(testZipDownloadLimit)
    })

    test('should return error result on error response', async () => {
      jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

      let error: ReadError | undefined
      await sut.getZipDownloadLimit().catch((e) => (error = e))

      expect(axios.get).toHaveBeenCalledWith(
        `${TestConstants.TEST_API_URL}/info/zipDownloadLimit`,
        TestConstants.TEST_EXPECTED_UNAUTHENTICATED_REQUEST_CONFIG
      )
      expect(error).toBeInstanceOf(Error)
    })
  })

  describe('getMaxEmbargoDurationInMonths', () => {
    test('should return duration on successful response', async () => {
      const testDuration = 12
      const testSuccessfulResponse = {
        data: {
          status: 'OK',
          data: {
            message: testDuration.toString()
          }
        }
      }
      jest.spyOn(axios, 'get').mockResolvedValue(testSuccessfulResponse)

      const actual = await sut.getMaxEmbargoDurationInMonths()

      expect(axios.get).toHaveBeenCalledWith(
        `${TestConstants.TEST_API_URL}/info/settings/:MaxEmbargoDurationInMonths`,
        TestConstants.TEST_EXPECTED_UNAUTHENTICATED_REQUEST_CONFIG
      )
      expect(actual).toBe(testDuration)
    })

    test('should return error result on error response', async () => {
      jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

      let error: ReadError | undefined
      await sut.getMaxEmbargoDurationInMonths().catch((e) => (error = e))

      expect(axios.get).toHaveBeenCalledWith(
        `${TestConstants.TEST_API_URL}/info/settings/:MaxEmbargoDurationInMonths`,
        TestConstants.TEST_EXPECTED_UNAUTHENTICATED_REQUEST_CONFIG
      )
      expect(error).toBeInstanceOf(Error)
    })
  })
})
