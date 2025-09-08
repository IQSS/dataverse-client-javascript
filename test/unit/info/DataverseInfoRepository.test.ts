import axios from 'axios'
import { DataverseInfoRepository } from '../../../src/info/infra/repositories/DataverseInfoRepository'
import { ApiConfig, DatasetMetadataExportFormats, ReadError } from '../../../src'
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

  describe('getApplicationTermsOfUse', () => {
    test('should return terms of use on successful response', async () => {
      const testTermsOfUse = 'Be excellent to each other.'
      const testSuccessfulResponse = {
        data: {
          status: 'OK',
          data: {
            message: testTermsOfUse
          }
        }
      }
      jest.spyOn(axios, 'get').mockResolvedValue(testSuccessfulResponse)

      const actual = await sut.getApplicationTermsOfUse()

      expect(axios.get).toHaveBeenCalledWith(
        `${TestConstants.TEST_API_URL}/info/applicationTermsOfUse`,
        TestConstants.TEST_EXPECTED_UNAUTHENTICATED_REQUEST_CONFIG
      )
      expect(actual).toMatch(testTermsOfUse)
    })

    test('should return terms of use on successful response with lang', async () => {
      const testLang = 'en'
      const testTermsOfUse = 'Be excellent to each other.'
      const testSuccessfulResponse = {
        data: {
          status: 'OK',
          data: {
            message: testTermsOfUse
          }
        }
      }
      jest.spyOn(axios, 'get').mockResolvedValue(testSuccessfulResponse)

      const actual = await sut.getApplicationTermsOfUse(testLang)

      expect(axios.get).toHaveBeenCalledWith(
        `${TestConstants.TEST_API_URL}/info/applicationTermsOfUse`,
        {
          params: {
            lang: testLang
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      expect(actual).toMatch(testTermsOfUse)
    })

    test('should return error result on error response', async () => {
      jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

      let error: ReadError | undefined
      await sut.getApplicationTermsOfUse().catch((e) => (error = e))

      expect(axios.get).toHaveBeenCalledWith(
        `${TestConstants.TEST_API_URL}/info/applicationTermsOfUse`,
        TestConstants.TEST_EXPECTED_UNAUTHENTICATED_REQUEST_CONFIG
      )
      expect(error).toBeInstanceOf(Error)
    })
  })

  describe('getAvailableDatasetMetadataExportFormats', () => {
    test('should return available dataset metadata export formats on successful response', async () => {
      const formats: DatasetMetadataExportFormats = {
        OAI_ORE: {
          displayName: 'OAI_ORE',
          mediaType: 'application/json',
          isHarvestable: false,
          isVisibleInUserInterface: true
        },
        Datacite: {
          displayName: 'DataCite',
          mediaType: 'application/xml',
          isHarvestable: true,
          isVisibleInUserInterface: true,
          XMLNameSpace: 'http://datacite.org/schema/kernel-4',
          XMLSchemaLocation:
            'http://datacite.org/schema/kernel-4 http://schema.datacite.org/meta/kernel-4.5/metadata.xsd',
          XMLSchemaVersion: '4.5'
        }
      }

      const testSuccessfulResponse = {
        data: {
          status: 'OK',
          data: formats
        }
      }
      jest.spyOn(axios, 'get').mockResolvedValue(testSuccessfulResponse)

      const actual = await sut.getAvailableDatasetMetadataExportFormats()

      expect(axios.get).toHaveBeenCalledWith(
        `${TestConstants.TEST_API_URL}/info/exportFormats`,
        TestConstants.TEST_EXPECTED_UNAUTHENTICATED_REQUEST_CONFIG
      )
      expect(actual).toEqual(formats)
    })

    test('should return error result on error response', async () => {
      jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

      let error: ReadError | undefined
      await sut.getAvailableDatasetMetadataExportFormats().catch((e) => (error = e))

      expect(axios.get).toHaveBeenCalledWith(
        `${TestConstants.TEST_API_URL}/info/exportFormats`,
        TestConstants.TEST_EXPECTED_UNAUTHENTICATED_REQUEST_CONFIG
      )
      expect(error).toBeInstanceOf(Error)
    })
  })
})
