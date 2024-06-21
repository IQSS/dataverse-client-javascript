import { FilesRepository } from '../../../src/files/infra/repositories/FilesRepository'
import axios from 'axios'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'
import {
  ApiConfig,
  DataverseApiAuthMechanism
} from '../../../src/core/infra/repositories/ApiConfig'
import { TestConstants } from '../../testHelpers/TestConstants'
import {
  createFileModel,
  createManyFilesPayload,
  createFilesSubsetModel,
  createFilePayload,
  createSinglepartFileBlob,
  createMultipartFileBlob
} from '../../testHelpers/files/filesHelper'
import {
  createFileDataTablePayload,
  createFileDataTableModel
} from '../../testHelpers/files/fileDataTablesHelper'
import { createFileUserPermissionsModel } from '../../testHelpers/files/fileUserPermissionsHelper'
import {
  FileSearchCriteria,
  FileAccessStatus,
  FileOrderCriteria
} from '../../../src/files/domain/models/FileCriteria'
import { DatasetNotNumberedVersion } from '../../../src/datasets'
import {
  createFileCountsModel,
  createFileCountsPayload
} from '../../testHelpers/files/fileCountsHelper'
import { createFilesTotalDownloadSizePayload } from '../../testHelpers/files/filesTotalDownloadSizeHelper'
import { FileDownloadSizeMode } from '../../../src'
import {
  createMultipartFileUploadDestinationModel,
  createMultipartFileUploadDestinationPayload,
  createSingleFileUploadDestinationModel,
  createSingleFileUploadDestinationPayload
} from '../../testHelpers/files/fileUploadDestinationHelper'
import fs from 'fs'

describe('FilesRepository', () => {
  const sut: FilesRepository = new FilesRepository()

  const testFile = createFileModel()
  const testDatasetVersionId = DatasetNotNumberedVersion.LATEST
  const testDatasetId = 1
  const testIncludeDeaccessioned = false
  const testCategory = 'testCategory'
  const testTabularTagName = 'testTabularTagName'
  const testContentType = 'testContentType'
  const testFileCriteria = new FileSearchCriteria()
    .withCategoryName(testCategory)
    .withContentType(testContentType)
    .withAccessStatus(FileAccessStatus.PUBLIC)
    .withTabularTagName(testTabularTagName)

  beforeEach(() => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      TestConstants.TEST_DUMMY_API_KEY
    )
  })

  describe('getFileUploadDestination', () => {
    const testFileSize = 1000

    const expectedRequestConfigApiKey = {
      params: {
        size: testFileSize
      },
      headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY.headers
    }
    const expectedRequestConfigSessionCookie = {
      params: {
        size: testFileSize
      },
      withCredentials:
        TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE.withCredentials,
      headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE.headers
    }

    const testSingleSuccessfulResponse = {
      data: {
        status: 'OK',
        data: createSingleFileUploadDestinationPayload()
      }
    }
    const testSingleFileUploadDestination = createSingleFileUploadDestinationModel()

    const testMultipartSuccessfulResponse = {
      data: {
        status: 'OK',
        data: createMultipartFileUploadDestinationPayload()
      }
    }
    const testMultipleFileUploadDestination = createMultipartFileUploadDestinationModel()

    let singlepartFile: File
    let multipartFile: File

    beforeAll(async () => {
      singlepartFile = await createSinglepartFileBlob()
      multipartFile = await createMultipartFileBlob()
    })

    describe('by numeric id', () => {
      test('should return destination when single response is successful', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue(testSingleSuccessfulResponse)
        jest.spyOn(fs, 'statSync').mockReturnValue({ size: testFileSize } as fs.Stats)

        const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/datasets/${testDatasetId}/uploadurls`

        // API Key auth
        let actual = await sut.getFileUploadDestination(testDatasetId, singlepartFile)
        expect(axios.get).toHaveBeenCalledWith(expectedApiEndpoint, expectedRequestConfigApiKey)
        expect(actual).toEqual(testSingleFileUploadDestination)

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)
        actual = await sut.getFileUploadDestination(testDatasetId, singlepartFile)
        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          expectedRequestConfigSessionCookie
        )
        expect(actual).toEqual(testSingleFileUploadDestination)
      })

      test('should return destination when multipart response is successful', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue(testMultipartSuccessfulResponse)
        jest.spyOn(fs, 'statSync').mockReturnValue({ size: testFileSize } as fs.Stats)

        const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/datasets/${testDatasetId}/uploadurls`

        // API Key auth
        let actual = await sut.getFileUploadDestination(testDatasetId, multipartFile)
        expect(axios.get).toHaveBeenCalledWith(expectedApiEndpoint, expectedRequestConfigApiKey)
        expect(actual).toEqual(testMultipleFileUploadDestination)

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)
        actual = await sut.getFileUploadDestination(testDatasetId, multipartFile)
        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          expectedRequestConfigSessionCookie
        )
        expect(actual).toEqual(testMultipleFileUploadDestination)
      })

      test('should return error on repository read error', async () => {
        jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)
        jest.spyOn(fs, 'statSync').mockReturnValue({ size: testFileSize } as fs.Stats)

        await expect(sut.getFileUploadDestination(testDatasetId, singlepartFile)).rejects.toThrow(
          ReadError
        )
      })
    })

    describe('by persistent id', () => {
      test('should return destination when single response is successful', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue(testSingleSuccessfulResponse)
        jest.spyOn(fs, 'statSync').mockReturnValue({ size: testFileSize } as fs.Stats)

        const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/datasets/:persistentId/uploadurls?persistentId=${TestConstants.TEST_DUMMY_PERSISTENT_ID}`

        // API Key auth
        let actual = await sut.getFileUploadDestination(
          TestConstants.TEST_DUMMY_PERSISTENT_ID,
          singlepartFile
        )
        expect(axios.get).toHaveBeenCalledWith(expectedApiEndpoint, expectedRequestConfigApiKey)
        expect(actual).toEqual(testSingleFileUploadDestination)

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)
        actual = await sut.getFileUploadDestination(
          TestConstants.TEST_DUMMY_PERSISTENT_ID,
          singlepartFile
        )
        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          expectedRequestConfigSessionCookie
        )
        expect(actual).toEqual(testSingleFileUploadDestination)
      })

      test('should return destination when multipart response is successful', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue(testMultipartSuccessfulResponse)
        jest.spyOn(fs, 'statSync').mockReturnValue({ size: testFileSize } as fs.Stats)

        const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/datasets/:persistentId/uploadurls?persistentId=${TestConstants.TEST_DUMMY_PERSISTENT_ID}`

        // API Key auth
        let actual = await sut.getFileUploadDestination(
          TestConstants.TEST_DUMMY_PERSISTENT_ID,
          multipartFile
        )
        expect(axios.get).toHaveBeenCalledWith(expectedApiEndpoint, expectedRequestConfigApiKey)
        expect(actual).toEqual(testMultipleFileUploadDestination)

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)
        actual = await sut.getFileUploadDestination(
          TestConstants.TEST_DUMMY_PERSISTENT_ID,
          multipartFile
        )
        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          expectedRequestConfigSessionCookie
        )
        expect(actual).toEqual(testMultipleFileUploadDestination)
      })

      test('should return error on repository read error', async () => {
        jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)
        jest.spyOn(fs, 'statSync').mockReturnValue({ size: testFileSize } as fs.Stats)

        await expect(
          sut.getFileUploadDestination(TestConstants.TEST_DUMMY_PERSISTENT_ID, singlepartFile)
        ).rejects.toThrow(ReadError)
      })
    })
  })

  describe('getDatasetFiles', () => {
    const testTotalCount = 4
    const testFilesSuccessfulResponse = {
      data: {
        status: 'OK',
        data: createManyFilesPayload(testTotalCount),
        totalCount: testTotalCount
      }
    }

    const testLimit = 10
    const testOffset = 20
    const testFileOrderCriteria = FileOrderCriteria.NAME_ZA

    const expectedRequestConfigApiKey = {
      params: {
        includeDeaccessioned: testIncludeDeaccessioned,
        orderCriteria: testFileOrderCriteria
      },
      headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY.headers
    }
    const expectedRequestConfigSessionCookie = {
      params: {
        includeDeaccessioned: testIncludeDeaccessioned,
        orderCriteria: testFileOrderCriteria
      },
      withCredentials:
        TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE.withCredentials,
      headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE.headers
    }

    const expectedRequestParamsWithOptional = {
      includeDeaccessioned: testIncludeDeaccessioned,
      limit: testLimit,
      offset: testOffset,
      orderCriteria: testFileOrderCriteria,
      contentType: testFileCriteria.contentType,
      accessStatus: testFileCriteria.accessStatus.toString(),
      categoryName: testFileCriteria.categoryName,
      tabularTagName: testFileCriteria.tabularTagName
    }

    const expectedRequestConfigApiKeyWithOptional = {
      params: expectedRequestParamsWithOptional,
      headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY.headers
    }

    const expectedFiles = createFilesSubsetModel(testTotalCount)

    describe('by numeric id and version id', () => {
      const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/datasets/${testDatasetId}/versions/${testDatasetVersionId}/files`

      test('should return files when providing id, version id, and response is successful', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue(testFilesSuccessfulResponse)

        // API Key auth
        let actual = await sut.getDatasetFiles(
          testDatasetId,
          testDatasetVersionId,
          testIncludeDeaccessioned,
          testFileOrderCriteria
        )

        expect(axios.get).toHaveBeenCalledWith(expectedApiEndpoint, expectedRequestConfigApiKey)
        expect(actual).toStrictEqual(expectedFiles)

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)

        actual = await sut.getDatasetFiles(
          testDatasetId,
          testDatasetVersionId,
          testIncludeDeaccessioned,
          testFileOrderCriteria
        )

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          expectedRequestConfigSessionCookie
        )
        expect(actual).toStrictEqual(expectedFiles)
      })

      test('should return files when providing id, version id, optional params, and response is successful', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue(testFilesSuccessfulResponse)

        const actual = await sut.getDatasetFiles(
          testDatasetId,
          testDatasetVersionId,
          testIncludeDeaccessioned,
          testFileOrderCriteria,
          testLimit,
          testOffset,
          testFileCriteria
        )

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          expectedRequestConfigApiKeyWithOptional
        )
        expect(actual).toStrictEqual(expectedFiles)
      })

      test('should return error result on error response', async () => {
        jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

        let error: ReadError = undefined
        await sut
          .getDatasetFiles(
            testDatasetId,
            testDatasetVersionId,
            testIncludeDeaccessioned,
            testFileOrderCriteria
          )
          .catch((e) => (error = e))

        expect(axios.get).toHaveBeenCalledWith(expectedApiEndpoint, expectedRequestConfigApiKey)
        expect(error).toBeInstanceOf(Error)
      })
    })

    describe('by persistent id', () => {
      const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/datasets/:persistentId/versions/${testDatasetVersionId}/files?persistentId=${TestConstants.TEST_DUMMY_PERSISTENT_ID}`

      test('should return files when providing persistent id, version id, and response is successful', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue(testFilesSuccessfulResponse)

        // API Key auth
        let actual = await sut.getDatasetFiles(
          TestConstants.TEST_DUMMY_PERSISTENT_ID,
          testDatasetVersionId,
          testIncludeDeaccessioned,
          testFileOrderCriteria
        )

        expect(axios.get).toHaveBeenCalledWith(expectedApiEndpoint, expectedRequestConfigApiKey)
        expect(actual).toStrictEqual(expectedFiles)

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)

        actual = await sut.getDatasetFiles(
          TestConstants.TEST_DUMMY_PERSISTENT_ID,
          testDatasetVersionId,
          testIncludeDeaccessioned,
          testFileOrderCriteria
        )

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          expectedRequestConfigSessionCookie
        )
        expect(actual).toStrictEqual(expectedFiles)
      })

      test('should return files when providing persistent id, optional params, and response is successful', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue(testFilesSuccessfulResponse)

        const actual = await sut.getDatasetFiles(
          TestConstants.TEST_DUMMY_PERSISTENT_ID,
          testDatasetVersionId,
          testIncludeDeaccessioned,
          testFileOrderCriteria,
          testLimit,
          testOffset,
          testFileCriteria
        )

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          expectedRequestConfigApiKeyWithOptional
        )
        expect(actual).toStrictEqual(expectedFiles)
      })

      test('should return error result on error response', async () => {
        jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

        let error: ReadError = undefined
        await sut
          .getDatasetFiles(
            TestConstants.TEST_DUMMY_PERSISTENT_ID,
            testDatasetVersionId,
            testIncludeDeaccessioned,
            testFileOrderCriteria
          )
          .catch((e) => (error = e))

        expect(axios.get).toHaveBeenCalledWith(expectedApiEndpoint, expectedRequestConfigApiKey)
        expect(error).toBeInstanceOf(Error)
      })
    })
  })

  describe('getDatasetFileCounts', () => {
    const testFileCountsSuccessfulResponse = {
      data: {
        status: 'OK',
        data: createFileCountsPayload()
      }
    }

    const expectedRequestConfigApiKey = {
      params: { includeDeaccessioned: testIncludeDeaccessioned },
      headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY.headers
    }
    const expectedRequestConfigSessionCookie = {
      params: { includeDeaccessioned: testIncludeDeaccessioned },
      withCredentials:
        TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE.withCredentials,
      headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE.headers
    }

    const expectedRequestParamsWithOptional = {
      includeDeaccessioned: testIncludeDeaccessioned,
      contentType: testFileCriteria.contentType,
      accessStatus: testFileCriteria.accessStatus.toString(),
      categoryName: testFileCriteria.categoryName,
      tabularTagName: testFileCriteria.tabularTagName
    }

    const expectedRequestConfigApiKeyWithOptional = {
      params: expectedRequestParamsWithOptional,
      headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY.headers
    }

    const expectedCount = createFileCountsModel()

    describe('by numeric id and version id', () => {
      const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/datasets/${testDatasetId}/versions/${testDatasetVersionId}/files/counts`

      test('should return file counts when providing id, version id, and response is successful', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue(testFileCountsSuccessfulResponse)

        // API Key auth
        let actual = await sut.getDatasetFileCounts(
          testDatasetId,
          testDatasetVersionId,
          testIncludeDeaccessioned
        )

        expect(axios.get).toHaveBeenCalledWith(expectedApiEndpoint, expectedRequestConfigApiKey)
        expect(actual).toStrictEqual(expectedCount)

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)

        actual = await sut.getDatasetFileCounts(
          testDatasetId,
          testDatasetVersionId,
          testIncludeDeaccessioned
        )

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          expectedRequestConfigSessionCookie
        )
        expect(actual).toStrictEqual(expectedCount)
      })

      test('should return file counts when providing id, version id, optional params, and response is successful', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue(testFileCountsSuccessfulResponse)

        const actual = await sut.getDatasetFileCounts(
          testDatasetId,
          testDatasetVersionId,
          testIncludeDeaccessioned,
          testFileCriteria
        )

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          expectedRequestConfigApiKeyWithOptional
        )
        expect(actual).toStrictEqual(expectedCount)
      })

      test('should return error result on error response', async () => {
        jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

        let error: ReadError = undefined
        await sut
          .getDatasetFileCounts(testDatasetId, testDatasetVersionId, testIncludeDeaccessioned)
          .catch((e) => (error = e))

        expect(axios.get).toHaveBeenCalledWith(expectedApiEndpoint, expectedRequestConfigApiKey)
        expect(error).toBeInstanceOf(Error)
      })
    })

    describe('by persistent id', () => {
      const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/datasets/:persistentId/versions/${testDatasetVersionId}/files/counts?persistentId=${TestConstants.TEST_DUMMY_PERSISTENT_ID}`

      test('should return files when providing persistent id, version id, and response is successful', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue(testFileCountsSuccessfulResponse)

        // API Key auth
        let actual = await sut.getDatasetFileCounts(
          TestConstants.TEST_DUMMY_PERSISTENT_ID,
          testDatasetVersionId,
          testIncludeDeaccessioned
        )

        expect(axios.get).toHaveBeenCalledWith(expectedApiEndpoint, expectedRequestConfigApiKey)
        expect(actual).toStrictEqual(expectedCount)

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)

        actual = await sut.getDatasetFileCounts(
          TestConstants.TEST_DUMMY_PERSISTENT_ID,
          testDatasetVersionId,
          testIncludeDeaccessioned
        )

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          expectedRequestConfigSessionCookie
        )
        expect(actual).toStrictEqual(expectedCount)
      })

      test('should return error result on error response', async () => {
        jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

        let error: ReadError = undefined
        await sut
          .getDatasetFileCounts(
            TestConstants.TEST_DUMMY_PERSISTENT_ID,
            testDatasetVersionId,
            testIncludeDeaccessioned
          )
          .catch((e) => (error = e))

        expect(axios.get).toHaveBeenCalledWith(expectedApiEndpoint, expectedRequestConfigApiKey)
        expect(error).toBeInstanceOf(Error)
      })
    })
  })

  describe('getDatasetFilesTotalDownloadSize', () => {
    const testFilesTotalDownloadSizeSuccessfulResponse = {
      data: {
        status: 'OK',
        data: createFilesTotalDownloadSizePayload()
      }
    }
    const testFileDownloadSizeMode = FileDownloadSizeMode.ARCHIVAL
    const testIncludeDeaccessioned = false
    const expectedSize = 173
    const expectedRequestConfigApiKey = {
      params: {
        mode: FileDownloadSizeMode.ARCHIVAL.toString(),
        includeDeaccessioned: testIncludeDeaccessioned
      },
      headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY.headers
    }
    const expectedRequestConfigSessionCookie = {
      params: {
        mode: FileDownloadSizeMode.ARCHIVAL.toString(),
        includeDeaccessioned: testIncludeDeaccessioned
      },
      withCredentials:
        TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE.withCredentials,
      headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE.headers
    }
    const expectedRequestConfigApiKeyWithOptional = {
      params: {
        mode: FileDownloadSizeMode.ARCHIVAL.toString(),
        includeDeaccessioned: testIncludeDeaccessioned,
        contentType: testFileCriteria.contentType,
        accessStatus: testFileCriteria.accessStatus.toString(),
        categoryName: testFileCriteria.categoryName,
        tabularTagName: testFileCriteria.tabularTagName
      },
      headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY.headers
    }
    const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/datasets/${testDatasetId}/versions/${testDatasetVersionId}/downloadsize`

    describe('by numeric id and version id', () => {
      test('should return files total download size when providing id, version id, mode, and response is successful', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue(testFilesTotalDownloadSizeSuccessfulResponse)

        // API Key auth
        let actual = await sut.getDatasetFilesTotalDownloadSize(
          testDatasetId,
          testDatasetVersionId,
          testIncludeDeaccessioned,
          testFileDownloadSizeMode
        )

        expect(axios.get).toHaveBeenCalledWith(expectedApiEndpoint, expectedRequestConfigApiKey)
        expect(actual).toStrictEqual(expectedSize)

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)

        actual = await sut.getDatasetFilesTotalDownloadSize(
          testDatasetId,
          testDatasetVersionId,
          testIncludeDeaccessioned,
          testFileDownloadSizeMode
        )

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          expectedRequestConfigSessionCookie
        )
        expect(actual).toStrictEqual(expectedSize)
      })

      test('should return files total download size when providing id, version id, mode, optional params, and response is successful', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue(testFilesTotalDownloadSizeSuccessfulResponse)

        const actual = await sut.getDatasetFilesTotalDownloadSize(
          testDatasetId,
          testDatasetVersionId,
          testIncludeDeaccessioned,
          testFileDownloadSizeMode,
          testFileCriteria
        )

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          expectedRequestConfigApiKeyWithOptional
        )
        expect(actual).toStrictEqual(expectedSize)
      })

      test('should return error result on error response', async () => {
        jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

        let error: ReadError = undefined
        await sut
          .getDatasetFilesTotalDownloadSize(
            testDatasetId,
            testDatasetVersionId,
            testIncludeDeaccessioned,
            testFileDownloadSizeMode
          )
          .catch((e) => (error = e))

        expect(axios.get).toHaveBeenCalledWith(expectedApiEndpoint, expectedRequestConfigApiKey)
        expect(error).toBeInstanceOf(Error)
      })
    })

    describe('by persistent id', () => {
      const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/datasets/:persistentId/versions/${testDatasetVersionId}/downloadsize?persistentId=${TestConstants.TEST_DUMMY_PERSISTENT_ID}`

      test('should return files total download size when providing persistent id, version id, and response is successful', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue(testFilesTotalDownloadSizeSuccessfulResponse)

        // API Key auth
        let actual = await sut.getDatasetFilesTotalDownloadSize(
          TestConstants.TEST_DUMMY_PERSISTENT_ID,
          testDatasetVersionId,
          testIncludeDeaccessioned,
          testFileDownloadSizeMode
        )

        expect(axios.get).toHaveBeenCalledWith(expectedApiEndpoint, expectedRequestConfigApiKey)
        expect(actual).toStrictEqual(expectedSize)

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)

        actual = await sut.getDatasetFilesTotalDownloadSize(
          TestConstants.TEST_DUMMY_PERSISTENT_ID,
          testDatasetVersionId,
          testIncludeDeaccessioned,
          testFileDownloadSizeMode
        )

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          expectedRequestConfigSessionCookie
        )
        expect(actual).toStrictEqual(expectedSize)
      })

      test('should return error result on error response', async () => {
        jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

        let error: ReadError = undefined
        await sut
          .getDatasetFilesTotalDownloadSize(
            TestConstants.TEST_DUMMY_PERSISTENT_ID,
            testDatasetVersionId,
            testIncludeDeaccessioned,
            testFileDownloadSizeMode
          )
          .catch((e) => (error = e))

        expect(axios.get).toHaveBeenCalledWith(expectedApiEndpoint, expectedRequestConfigApiKey)
        expect(error).toBeInstanceOf(Error)
      })
    })
  })

  describe('getFileDownloadCount', () => {
    const testCount = 1
    const testFileDownloadCountResponse = {
      data: {
        status: 'OK',
        data: {
          message: `${testCount}`
        }
      }
    }

    describe('by numeric id', () => {
      const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/files/${testFile.id}/downloadCount`

      test('should return count when providing id and response is successful', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue(testFileDownloadCountResponse)

        // API Key auth
        let actual = await sut.getFileDownloadCount(testFile.id)

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
        )
        expect(actual).toStrictEqual(testCount)

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)

        actual = await sut.getFileDownloadCount(testFile.id)

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE
        )
        expect(actual).toStrictEqual(testCount)
      })

      test('should return error result on error response', async () => {
        jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

        let error: ReadError = undefined
        await sut.getFileDownloadCount(testFile.id).catch((e) => (error = e))

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
        )
        expect(error).toBeInstanceOf(Error)
      })
    })

    describe('by persistent id', () => {
      const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/files/:persistentId/downloadCount?persistentId=${TestConstants.TEST_DUMMY_PERSISTENT_ID}`

      test('should return count when providing persistent id and response is successful', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue(testFileDownloadCountResponse)

        // API Key auth
        let actual = await sut.getFileDownloadCount(TestConstants.TEST_DUMMY_PERSISTENT_ID)

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
        )
        expect(actual).toStrictEqual(testCount)

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)

        actual = await sut.getFileDownloadCount(TestConstants.TEST_DUMMY_PERSISTENT_ID)

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE
        )
        expect(actual).toStrictEqual(testCount)
      })

      test('should return error result on error response', async () => {
        jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

        let error: ReadError = undefined
        await sut
          .getFileDownloadCount(TestConstants.TEST_DUMMY_PERSISTENT_ID)
          .catch((e) => (error = e))

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
        )
        expect(error).toBeInstanceOf(Error)
      })
    })
  })

  describe('getFileUserPermissions', () => {
    const testFileUserPermissions = createFileUserPermissionsModel()
    const testFileUserPermissionsResponse = {
      data: {
        status: 'OK',
        data: testFileUserPermissions
      }
    }

    describe('by numeric id', () => {
      const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/access/datafile/${testFile.id}/userPermissions`

      test('should return file user permissions when providing id and response is successful', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue(testFileUserPermissionsResponse)

        // API Key auth
        let actual = await sut.getFileUserPermissions(testFile.id)

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
        )
        expect(actual).toStrictEqual(testFileUserPermissions)

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)

        actual = await sut.getFileUserPermissions(testFile.id)

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE
        )
        expect(actual).toStrictEqual(testFileUserPermissions)
      })

      test('should return error result on error response', async () => {
        jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

        let error: ReadError = undefined
        await sut.getFileUserPermissions(testFile.id).catch((e) => (error = e))

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
        )
        expect(error).toBeInstanceOf(Error)
      })
    })

    describe('by persistent id', () => {
      const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/access/datafile/:persistentId/userPermissions?persistentId=${TestConstants.TEST_DUMMY_PERSISTENT_ID}`

      test('should return file user permissions when providing persistent id and response is successful', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue(testFileUserPermissionsResponse)
        // API Key auth
        let actual = await sut.getFileUserPermissions(TestConstants.TEST_DUMMY_PERSISTENT_ID)

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
        )
        expect(actual).toStrictEqual(testFileUserPermissions)

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)

        actual = await sut.getFileUserPermissions(TestConstants.TEST_DUMMY_PERSISTENT_ID)

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE
        )
        expect(actual).toStrictEqual(testFileUserPermissions)
      })

      test('should return error result on error response', async () => {
        jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

        let error: ReadError = undefined
        await sut
          .getFileUserPermissions(TestConstants.TEST_DUMMY_PERSISTENT_ID)
          .catch((e) => (error = e))

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
        )
        expect(error).toBeInstanceOf(Error)
      })
    })
  })

  describe('getFileDataTables', () => {
    const expectedDataTables = [createFileDataTableModel()]
    const testGetFileDataTablesResponse = {
      data: {
        status: 'OK',
        data: [createFileDataTablePayload()]
      }
    }

    describe('by numeric id', () => {
      const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/files/${testFile.id}/dataTables`

      test('should return data tables when providing id and response is successful', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue(testGetFileDataTablesResponse)

        // API Key auth
        let actual = await sut.getFileDataTables(testFile.id)

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
        )
        expect(actual).toStrictEqual(expectedDataTables)

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)

        actual = await sut.getFileDataTables(testFile.id)

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE
        )
        expect(actual).toStrictEqual(expectedDataTables)
      })

      test('should return error result on error response', async () => {
        jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

        let error: ReadError = undefined
        await sut.getFileDataTables(testFile.id).catch((e) => (error = e))

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
        )
        expect(error).toBeInstanceOf(Error)
      })
    })

    describe('by persistent id', () => {
      const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/files/:persistentId/dataTables?persistentId=${TestConstants.TEST_DUMMY_PERSISTENT_ID}`

      test('should return data tables when providing persistent id and response is successful', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue(testGetFileDataTablesResponse)

        // API Key auth
        let actual = await sut.getFileDataTables(TestConstants.TEST_DUMMY_PERSISTENT_ID)

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
        )
        expect(actual).toStrictEqual(expectedDataTables)

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)

        actual = await sut.getFileDataTables(TestConstants.TEST_DUMMY_PERSISTENT_ID)

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE
        )
        expect(actual).toStrictEqual(expectedDataTables)
      })

      test('should return error result on error response', async () => {
        jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

        let error: ReadError = undefined
        await sut
          .getFileDataTables(TestConstants.TEST_DUMMY_PERSISTENT_ID)
          .catch((e) => (error = e))

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
        )
        expect(error).toBeInstanceOf(Error)
      })
    })
  })

  describe('getFile', () => {
    const testGetFileResponse = {
      data: {
        status: 'OK',
        data: createFilePayload()
      }
    }

    const expectedRequestParams = {
      returnDatasetVersion: false,
      returnOwners: true
    }

    const expectedRequestConfigApiKey = {
      params: expectedRequestParams,
      headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY.headers
    }

    const expectedRequestConfigSessionCookie = {
      params: expectedRequestParams,
      headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE.headers,
      withCredentials:
        TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE.withCredentials
    }

    describe('by numeric id', () => {
      beforeEach(() => {
        jest.clearAllMocks()
      })

      const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/files/${testFile.id}/versions/${DatasetNotNumberedVersion.LATEST}`

      test('should return file when providing id and response is successful', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue(testGetFileResponse)

        // API Key auth
        let actual = await sut.getFile(testFile.id, DatasetNotNumberedVersion.LATEST, false)
        expect(axios.get).toHaveBeenCalledWith(expectedApiEndpoint, expectedRequestConfigApiKey)
        expect(actual).toEqual(createFileModel())

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)
        actual = await sut.getFile(testFile.id, DatasetNotNumberedVersion.LATEST, false)
        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          expectedRequestConfigSessionCookie
        )
        expect(actual).toEqual(createFileModel())
      })

      test('should return error result on error response', async () => {
        jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

        await expect(
          sut.getFile(testFile.id, DatasetNotNumberedVersion.LATEST, false)
        ).rejects.toThrow(ReadError)
      })
    })

    describe('by persistent id', () => {
      const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/files/:persistentId/versions/${DatasetNotNumberedVersion.LATEST}?persistentId=${TestConstants.TEST_DUMMY_PERSISTENT_ID}`

      test('should return file when providing persistent id and response is successful', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue(testGetFileResponse)

        // API Key auth
        let actual = await sut.getFile(
          TestConstants.TEST_DUMMY_PERSISTENT_ID,
          DatasetNotNumberedVersion.LATEST,
          false
        )
        expect(axios.get).toHaveBeenCalledWith(expectedApiEndpoint, expectedRequestConfigApiKey)
        expect(actual).toEqual(createFileModel())

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)
        actual = await sut.getFile(
          TestConstants.TEST_DUMMY_PERSISTENT_ID,
          DatasetNotNumberedVersion.LATEST,
          false
        )
        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          expectedRequestConfigSessionCookie
        )
        expect(actual).toEqual(createFileModel())
      })

      test('should return error result on error response', async () => {
        jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

        await expect(
          sut.getFile(
            TestConstants.TEST_DUMMY_PERSISTENT_ID,
            DatasetNotNumberedVersion.LATEST,
            false
          )
        ).rejects.toThrow(ReadError)
      })
    })
  })

  describe('getFileCitation', () => {
    const testIncludeDeaccessioned = true
    const testCitation = 'test citation'
    const testCitationSuccessfulResponse = {
      data: {
        status: 'OK',
        data: {
          message: testCitation
        }
      }
    }

    test('should return citation when response is successful', async () => {
      jest.spyOn(axios, 'get').mockResolvedValue(testCitationSuccessfulResponse)
      const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/files/${testFile.id}/versions/${DatasetNotNumberedVersion.LATEST}/citation`

      // API Key auth
      let actual = await sut.getFileCitation(
        testFile.id,
        DatasetNotNumberedVersion.LATEST,
        testIncludeDeaccessioned
      )
      expect(axios.get).toHaveBeenCalledWith(
        expectedApiEndpoint,
        TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY_INCLUDE_DEACCESSIONED
      )
      expect(actual).toEqual(testCitation)

      // Session cookie auth
      ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)
      actual = await sut.getFileCitation(
        testFile.id,
        DatasetNotNumberedVersion.LATEST,
        testIncludeDeaccessioned
      )
      expect(axios.get).toHaveBeenCalledWith(
        expectedApiEndpoint,
        TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE_INCLUDE_DEACCESSIONED
      )
      expect(actual).toEqual(testCitation)
    })

    test('should return error on repository read error', async () => {
      jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

      await expect(
        sut.getFileCitation(testFile.id, DatasetNotNumberedVersion.LATEST, testIncludeDeaccessioned)
      ).rejects.toThrow(ReadError)
    })
  })
})
