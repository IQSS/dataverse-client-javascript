import { DatasetsRepository } from '../../../src/datasets/infra/repositories/DatasetsRepository'
import axios from 'axios'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'
import {
  ApiConfig,
  DataverseApiAuthMechanism
} from '../../../src/core/infra/repositories/ApiConfig'
import {
  createDatasetModel,
  createDatasetVersionPayload,
  createDatasetLicenseModel
} from '../../testHelpers/datasets/datasetHelper'
import { TestConstants } from '../../testHelpers/TestConstants'
import { DatasetNotNumberedVersion, DatasetPreviewSubset } from '../../../src/datasets'
import { createDatasetUserPermissionsModel } from '../../testHelpers/datasets/datasetUserPermissionsHelper'
import {
  createDatasetLockModel,
  createDatasetLockPayload
} from '../../testHelpers/datasets/datasetLockHelper'
import {
  createDatasetPreviewModel,
  createDatasetPreviewPayload
} from '../../testHelpers/datasets/datasetPreviewHelper'
import {
  createNewDatasetDTO,
  createNewDatasetMetadataBlockModel,
  createNewDatasetRequestPayload
} from '../../testHelpers/datasets/newDatasetHelper'
import { WriteError } from '../../../src'
import { VersionUpdateType } from '../../../src/datasets/domain/models/Dataset'

describe('DatasetsRepository', () => {
  const sut: DatasetsRepository = new DatasetsRepository()
  const testDatasetVersionSuccessfulResponse = {
    data: {
      status: 'OK',
      data: createDatasetVersionPayload()
    }
  }
  const testCitation = 'test citation'
  const testCitationSuccessfulResponse = {
    data: {
      status: 'OK',
      data: {
        message: testCitation
      }
    }
  }
  const testPrivateUrlToken = 'testToken'
  const testDatasetModel = createDatasetModel()
  const testVersionId = DatasetNotNumberedVersion.LATEST

  beforeEach(() => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      TestConstants.TEST_DUMMY_API_KEY
    )

    jest.clearAllMocks()
  })

  describe('getDatasetSummaryFieldNames', () => {
    test('should return fields on successful response', async () => {
      const testFieldNames = ['test1', 'test2']
      const testSuccessfulResponse = {
        data: {
          status: 'OK',
          data: testFieldNames
        }
      }
      jest.spyOn(axios, 'get').mockResolvedValue(testSuccessfulResponse)

      const actual = await sut.getDatasetSummaryFieldNames()

      expect(axios.get).toHaveBeenCalledWith(
        `${TestConstants.TEST_API_URL}/datasets/summaryFieldNames`,
        TestConstants.TEST_EXPECTED_UNAUTHENTICATED_REQUEST_CONFIG
      )
      expect(actual).toStrictEqual(testFieldNames)
    })

    test('should return error result on error response', async () => {
      jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

      let error: ReadError = undefined
      await sut.getDatasetSummaryFieldNames().catch((e) => (error = e))

      expect(axios.get).toHaveBeenCalledWith(
        `${TestConstants.TEST_API_URL}/datasets/summaryFieldNames`,
        TestConstants.TEST_EXPECTED_UNAUTHENTICATED_REQUEST_CONFIG
      )
      expect(error).toBeInstanceOf(Error)
    })
  })

  describe('getDataset', () => {
    const testIncludeDeaccessioned = false
    const expectedRequestConfigApiKey = {
      params: {
        includeDeaccessioned: testIncludeDeaccessioned,
        excludeFiles: true,
        returnOwners: true
      },
      headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY.headers
    }
    const expectedRequestConfigSessionCookie = {
      params: {
        includeDeaccessioned: testIncludeDeaccessioned,
        excludeFiles: true,
        returnOwners: true
      },
      withCredentials:
        TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE.withCredentials,
      headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE.headers
    }

    describe('by numeric id', () => {
      test('should return Dataset when providing id, version id, and response is successful', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue(testDatasetVersionSuccessfulResponse)
        const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/datasets/${testDatasetModel.id}/versions/${testVersionId}`

        // API Key auth
        let actual = await sut.getDataset(
          testDatasetModel.id,
          testVersionId,
          testIncludeDeaccessioned
        )

        expect(axios.get).toHaveBeenCalledWith(expectedApiEndpoint, expectedRequestConfigApiKey)
        expect(actual).toStrictEqual(testDatasetModel)

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)
        actual = await sut.getDataset(testDatasetModel.id, testVersionId, testIncludeDeaccessioned)
        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          expectedRequestConfigSessionCookie
        )
        expect(actual).toStrictEqual(testDatasetModel)
      })

      test('should return Dataset when providing id, version id, and response with license is successful', async () => {
        const testDatasetLicense = createDatasetLicenseModel()
        const testDatasetVersionWithLicenseSuccessfulResponse = {
          data: {
            status: 'OK',
            data: createDatasetVersionPayload(testDatasetLicense)
          }
        }
        jest.spyOn(axios, 'get').mockResolvedValue(testDatasetVersionWithLicenseSuccessfulResponse)

        const actual = await sut.getDataset(
          testDatasetModel.id,
          testVersionId,
          testIncludeDeaccessioned
        )

        expect(axios.get).toHaveBeenCalledWith(
          `${TestConstants.TEST_API_URL}/datasets/${testDatasetModel.id}/versions/${testVersionId}`,
          expectedRequestConfigApiKey
        )
        expect(actual).toStrictEqual(createDatasetModel(testDatasetLicense))
      })

      test('should return Dataset when providing id, version id, and response with license without icon URI is successful', async () => {
        const testDatasetLicenseWithoutIconUri = createDatasetLicenseModel(false)
        const testDatasetVersionWithLicenseSuccessfulResponse = {
          data: {
            status: 'OK',
            data: createDatasetVersionPayload(testDatasetLicenseWithoutIconUri)
          }
        }
        jest.spyOn(axios, 'get').mockResolvedValue(testDatasetVersionWithLicenseSuccessfulResponse)

        const actual = await sut.getDataset(
          testDatasetModel.id,
          testVersionId,
          testIncludeDeaccessioned
        )

        expect(axios.get).toHaveBeenCalledWith(
          `${TestConstants.TEST_API_URL}/datasets/${testDatasetModel.id}/versions/${testVersionId}`,
          expectedRequestConfigApiKey
        )
        expect(actual).toStrictEqual(createDatasetModel(testDatasetLicenseWithoutIconUri))
      })

      test('should return dataset with alternative persistent id, publication date and citation date when they are present in the response', async () => {
        const testDatasetVersionWithAlternativePersistentIdAndDatesSuccessfulResponse = {
          data: {
            status: 'OK',
            data: createDatasetVersionPayload(undefined, true)
          }
        }
        jest
          .spyOn(axios, 'get')
          .mockResolvedValue(
            testDatasetVersionWithAlternativePersistentIdAndDatesSuccessfulResponse
          )

        const actual = await sut.getDataset(
          testDatasetModel.id,
          testVersionId,
          testIncludeDeaccessioned
        )

        expect(axios.get).toHaveBeenCalledWith(
          `${TestConstants.TEST_API_URL}/datasets/${testDatasetModel.id}/versions/${testVersionId}`,
          expectedRequestConfigApiKey
        )
        expect(actual).toStrictEqual(createDatasetModel(undefined, true))
      })

      test('should return error on repository read error', async () => {
        jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

        let error: ReadError = undefined
        await sut
          .getDataset(testDatasetModel.id, testVersionId, testIncludeDeaccessioned)
          .catch((e) => (error = e))

        expect(axios.get).toHaveBeenCalledWith(
          `${TestConstants.TEST_API_URL}/datasets/${testDatasetModel.id}/versions/${testVersionId}`,
          expectedRequestConfigApiKey
        )
        expect(error).toBeInstanceOf(Error)
      })
    })
    describe('by persistent id', () => {
      test('should return Dataset when providing persistent id, version id, and response is successful', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue(testDatasetVersionSuccessfulResponse)
        const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/datasets/:persistentId/versions/${testVersionId}?persistentId=${testDatasetModel.persistentId}`

        // API Key auth
        let actual = await sut.getDataset(
          testDatasetModel.persistentId,
          testVersionId,
          testIncludeDeaccessioned
        )

        expect(axios.get).toHaveBeenCalledWith(expectedApiEndpoint, expectedRequestConfigApiKey)
        expect(actual).toStrictEqual(testDatasetModel)

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)

        actual = await sut.getDataset(
          testDatasetModel.persistentId,
          testVersionId,
          testIncludeDeaccessioned
        )

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          expectedRequestConfigSessionCookie
        )
        expect(actual).toStrictEqual(testDatasetModel)
      })

      test('should return error on repository read error', async () => {
        jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

        let error: ReadError = undefined
        await sut
          .getDataset(testDatasetModel.persistentId, testVersionId, testIncludeDeaccessioned)
          .catch((e) => (error = e))

        expect(axios.get).toHaveBeenCalledWith(
          `${TestConstants.TEST_API_URL}/datasets/:persistentId/versions/${testVersionId}?persistentId=${testDatasetModel.persistentId}`,
          expectedRequestConfigApiKey
        )
        expect(error).toBeInstanceOf(Error)
      })
    })
  })

  describe('getPrivateUrlDataset', () => {
    const expectedRequestConfig = {
      params: { returnOwners: true },
      headers: TestConstants.TEST_EXPECTED_UNAUTHENTICATED_REQUEST_CONFIG.headers
    }
    test('should return Dataset when response is successful', async () => {
      jest.spyOn(axios, 'get').mockResolvedValue(testDatasetVersionSuccessfulResponse)

      const actual = await sut.getPrivateUrlDataset(testPrivateUrlToken)

      expect(axios.get).toHaveBeenCalledWith(
        `${TestConstants.TEST_API_URL}/datasets/privateUrlDatasetVersion/${testPrivateUrlToken}`,
        expectedRequestConfig
      )
      expect(actual).toStrictEqual(testDatasetModel)
    })

    test('should return error on repository read error', async () => {
      jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

      let error: ReadError = undefined
      await sut.getPrivateUrlDataset(testPrivateUrlToken).catch((e) => (error = e))

      expect(axios.get).toHaveBeenCalledWith(
        `${TestConstants.TEST_API_URL}/datasets/privateUrlDatasetVersion/${testPrivateUrlToken}`,
        expectedRequestConfig
      )
      expect(error).toBeInstanceOf(Error)
    })
  })

  describe('getDatasetCitation', () => {
    const testIncludeDeaccessioned = true
    test('should return citation when response is successful', async () => {
      jest.spyOn(axios, 'get').mockResolvedValue(testCitationSuccessfulResponse)
      const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/datasets/${testDatasetModel.id}/versions/${testVersionId}/citation`

      // API Key auth
      let actual = await sut.getDatasetCitation(
        testDatasetModel.id,
        testVersionId,
        testIncludeDeaccessioned
      )

      expect(axios.get).toHaveBeenCalledWith(
        expectedApiEndpoint,
        TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY_INCLUDE_DEACCESSIONED
      )
      expect(actual).toStrictEqual(testCitation)

      // Session cookie auth
      ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)

      actual = await sut.getDatasetCitation(
        testDatasetModel.id,
        testVersionId,
        testIncludeDeaccessioned
      )

      expect(axios.get).toHaveBeenCalledWith(
        expectedApiEndpoint,
        TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE_INCLUDE_DEACCESSIONED
      )
      expect(actual).toStrictEqual(testCitation)
    })

    test('should return error on repository read error', async () => {
      jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

      let error: ReadError = undefined
      await sut
        .getDatasetCitation(1, testVersionId, testIncludeDeaccessioned)
        .catch((e) => (error = e))

      expect(axios.get).toHaveBeenCalledWith(
        `${TestConstants.TEST_API_URL}/datasets/${testDatasetModel.id}/versions/${testVersionId}/citation`,
        TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY_INCLUDE_DEACCESSIONED
      )
      expect(error).toBeInstanceOf(Error)
    })
  })

  describe('getPrivateUrlDatasetCitation', () => {
    test('should return citation when response is successful', async () => {
      jest.spyOn(axios, 'get').mockResolvedValue(testCitationSuccessfulResponse)

      const actual = await sut.getPrivateUrlDatasetCitation(testPrivateUrlToken)

      expect(axios.get).toHaveBeenCalledWith(
        `${TestConstants.TEST_API_URL}/datasets/privateUrlDatasetVersion/${testPrivateUrlToken}/citation`,
        TestConstants.TEST_EXPECTED_UNAUTHENTICATED_REQUEST_CONFIG
      )
      expect(actual).toStrictEqual(testCitation)
    })

    test('should return error on repository read error', async () => {
      jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

      let error: ReadError = undefined
      await sut.getPrivateUrlDatasetCitation(testPrivateUrlToken).catch((e) => (error = e))

      expect(axios.get).toHaveBeenCalledWith(
        `${TestConstants.TEST_API_URL}/datasets/privateUrlDatasetVersion/${testPrivateUrlToken}/citation`,
        TestConstants.TEST_EXPECTED_UNAUTHENTICATED_REQUEST_CONFIG
      )
      expect(error).toBeInstanceOf(Error)
    })
  })

  describe('getDatasetUserPermissions', () => {
    const testDatasetUserPermissions = createDatasetUserPermissionsModel()
    const testDatasetUserPermissionsResponse = {
      data: {
        status: 'OK',
        data: testDatasetUserPermissions
      }
    }

    describe('by numeric id', () => {
      const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/datasets/${testDatasetModel.id}/userPermissions`

      test('should return dataset user permissions when providing id and response is successful', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue(testDatasetUserPermissionsResponse)

        // API Key auth
        let actual = await sut.getDatasetUserPermissions(testDatasetModel.id)

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
        )
        expect(actual).toStrictEqual(testDatasetUserPermissions)

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)

        actual = await sut.getDatasetUserPermissions(testDatasetModel.id)

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE
        )
        expect(actual).toStrictEqual(testDatasetUserPermissions)
      })

      test('should return error result on error response', async () => {
        jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

        let error: ReadError = undefined
        await sut.getDatasetUserPermissions(testDatasetModel.id).catch((e) => (error = e))

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
        )
        expect(error).toBeInstanceOf(Error)
      })
    })

    describe('by persistent id', () => {
      const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/datasets/:persistentId/userPermissions?persistentId=${TestConstants.TEST_DUMMY_PERSISTENT_ID}`

      test('should return dataset user permissions when providing persistent id and response is successful', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue(testDatasetUserPermissionsResponse)
        // API Key auth
        let actual = await sut.getDatasetUserPermissions(TestConstants.TEST_DUMMY_PERSISTENT_ID)

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
        )
        expect(actual).toStrictEqual(testDatasetUserPermissions)

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)

        actual = await sut.getDatasetUserPermissions(TestConstants.TEST_DUMMY_PERSISTENT_ID)

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE
        )
        expect(actual).toStrictEqual(testDatasetUserPermissions)
      })

      test('should return error result on error response', async () => {
        jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

        let error: ReadError = undefined
        await sut
          .getDatasetUserPermissions(TestConstants.TEST_DUMMY_PERSISTENT_ID)
          .catch((e) => (error = e))

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
        )
        expect(error).toBeInstanceOf(Error)
      })
    })
  })

  describe('getDatasetLocks', () => {
    const testDatasetLocks = [createDatasetLockModel()]
    const testDatasetLocksResponse = {
      data: {
        status: 'OK',
        data: [createDatasetLockPayload()]
      }
    }

    describe('by numeric id', () => {
      const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/datasets/${testDatasetModel.id}/locks`

      test('should return dataset locks when providing id and response is successful', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue(testDatasetLocksResponse)

        // API Key auth
        let actual = await sut.getDatasetLocks(testDatasetModel.id)

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
        )
        expect(actual).toStrictEqual(testDatasetLocks)

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)

        actual = await sut.getDatasetLocks(testDatasetModel.id)

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE
        )
        expect(actual).toStrictEqual(testDatasetLocks)
      })

      test('should return error result on error response', async () => {
        jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

        let error: ReadError = undefined
        await sut.getDatasetLocks(testDatasetModel.id).catch((e) => (error = e))

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
        )
        expect(error).toBeInstanceOf(Error)
      })
    })

    describe('by persistent id', () => {
      const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/datasets/:persistentId/locks?persistentId=${TestConstants.TEST_DUMMY_PERSISTENT_ID}`

      test('should return dataset locks when providing persistent id and response is successful', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue(testDatasetLocksResponse)
        // API Key auth
        let actual = await sut.getDatasetLocks(TestConstants.TEST_DUMMY_PERSISTENT_ID)

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
        )
        expect(actual).toStrictEqual(testDatasetLocks)

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)

        actual = await sut.getDatasetLocks(TestConstants.TEST_DUMMY_PERSISTENT_ID)

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE
        )
        expect(actual).toStrictEqual(testDatasetLocks)
      })

      test('should return error result on error response', async () => {
        jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

        let error: ReadError = undefined
        await sut.getDatasetLocks(TestConstants.TEST_DUMMY_PERSISTENT_ID).catch((e) => (error = e))

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
        )
        expect(error).toBeInstanceOf(Error)
      })
    })
  })

  describe('getAllDatasetPreviews', () => {
    const testDatasetPreviews = [createDatasetPreviewModel()]
    const testTotalCount = 1

    const testDatasetPreviewSubset: DatasetPreviewSubset = {
      datasetPreviews: testDatasetPreviews,
      totalDatasetCount: testTotalCount
    }

    const testDatasetPreviewsResponse = {
      data: {
        status: 'OK',
        data: {
          total_count: testTotalCount,
          items: [createDatasetPreviewPayload()]
        }
      }
    }

    const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/search?q=*&type=dataset&sort=date&order=desc`

    test('should return dataset previews when response is successful', async () => {
      jest.spyOn(axios, 'get').mockResolvedValue(testDatasetPreviewsResponse)

      // API Key auth
      let actual = await sut.getAllDatasetPreviews()

      expect(axios.get).toHaveBeenCalledWith(
        expectedApiEndpoint,
        TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
      )
      expect(actual).toStrictEqual(testDatasetPreviewSubset)

      // Session cookie auth
      ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)

      actual = await sut.getAllDatasetPreviews()

      expect(axios.get).toHaveBeenCalledWith(
        expectedApiEndpoint,
        TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE
      )
      expect(actual).toStrictEqual(testDatasetPreviewSubset)
    })

    test('should return dataset previews when providing pagination params and response is successful', async () => {
      jest.spyOn(axios, 'get').mockResolvedValue(testDatasetPreviewsResponse)

      const testLimit = 10
      const testOffset = 20

      // API Key auth
      let actual = await sut.getAllDatasetPreviews(testLimit, testOffset)

      const expectedRequestParamsWithPagination = {
        per_page: testLimit,
        start: testOffset
      }

      const expectedRequestConfigApiKeyWithPagination = {
        params: expectedRequestParamsWithPagination,
        headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY.headers
      }

      expect(axios.get).toHaveBeenCalledWith(
        expectedApiEndpoint,
        expectedRequestConfigApiKeyWithPagination
      )
      expect(actual).toStrictEqual(testDatasetPreviewSubset)

      // Session cookie auth
      ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)

      actual = await sut.getAllDatasetPreviews(testLimit, testOffset)

      const expectedRequestConfigSessionCookieWithPagination = {
        params: expectedRequestParamsWithPagination,
        headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE.headers,
        withCredentials:
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE.withCredentials
      }

      expect(axios.get).toHaveBeenCalledWith(
        expectedApiEndpoint,
        expectedRequestConfigSessionCookieWithPagination
      )
      expect(actual).toStrictEqual(testDatasetPreviewSubset)
    })

    it('should return dataset previews when providing collection id and response is successful', async () => {
      jest.spyOn(axios, 'get').mockResolvedValue(testDatasetPreviewsResponse)

      const testCollectionId = 'testCollectionId'

      // API Key auth
      let actual = await sut.getAllDatasetPreviews(undefined, undefined, testCollectionId)

      const expectedRequestParamsWithCollectionId = {
        subtree: testCollectionId
      }

      const expectedRequestConfigApiKeyWithCollectionId = {
        params: expectedRequestParamsWithCollectionId,
        headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY.headers
      }

      expect(axios.get).toHaveBeenCalledWith(
        expectedApiEndpoint,
        expectedRequestConfigApiKeyWithCollectionId
      )
      expect(actual).toStrictEqual(testDatasetPreviewSubset)

      // Session cookie auth
      ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)

      actual = await sut.getAllDatasetPreviews(undefined, undefined, testCollectionId)

      const expectedRequestConfigSessionCookieWithCollectionId = {
        params: expectedRequestParamsWithCollectionId,
        headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE.headers,
        withCredentials:
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE.withCredentials
      }

      expect(axios.get).toHaveBeenCalledWith(
        expectedApiEndpoint,
        expectedRequestConfigSessionCookieWithCollectionId
      )
      expect(actual).toStrictEqual(testDatasetPreviewSubset)
    })

    test('should return error result on error response', async () => {
      jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

      let error: ReadError = undefined
      await sut.getAllDatasetPreviews().catch((e) => (error = e))

      expect(axios.get).toHaveBeenCalledWith(
        expectedApiEndpoint,
        TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
      )
      expect(error).toBeInstanceOf(Error)
    })
  })

  describe('createDataset', () => {
    const testNewDataset = createNewDatasetDTO()
    const testMetadataBlocks = [createNewDatasetMetadataBlockModel()]
    const testCollectionName = 'test'
    const expectedNewDatasetRequestPayloadJson = JSON.stringify(createNewDatasetRequestPayload())

    const testCreatedDatasetIdentifiers = {
      persistentId: 'test',
      numericId: 1
    }

    const testCreateDatasetResponse = {
      data: {
        status: 'OK',
        data: {
          id: testCreatedDatasetIdentifiers.numericId,
          persistentId: testCreatedDatasetIdentifiers.persistentId
        }
      }
    }

    const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/dataverses/${testCollectionName}/datasets`

    test('should call the API with a correct request payload', async () => {
      jest.spyOn(axios, 'post').mockResolvedValue(testCreateDatasetResponse)

      // API Key auth
      let actual = await sut.createDataset(testNewDataset, testMetadataBlocks, testCollectionName)

      expect(axios.post).toHaveBeenCalledWith(
        expectedApiEndpoint,
        expectedNewDatasetRequestPayloadJson,
        TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
      )
      expect(actual).toStrictEqual(testCreatedDatasetIdentifiers)

      // Session cookie auth
      ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)

      actual = await sut.createDataset(testNewDataset, testMetadataBlocks, testCollectionName)

      expect(axios.post).toHaveBeenCalledWith(
        expectedApiEndpoint,
        expectedNewDatasetRequestPayloadJson,
        TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE
      )
      expect(actual).toStrictEqual(testCreatedDatasetIdentifiers)
    })

    test('should return error result on error response', async () => {
      jest.spyOn(axios, 'post').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

      let error: WriteError = undefined
      await sut
        .createDataset(testNewDataset, testMetadataBlocks, testCollectionName)
        .catch((e) => (error = e))

      expect(axios.post).toHaveBeenCalledWith(
        expectedApiEndpoint,
        expectedNewDatasetRequestPayloadJson,
        TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
      )
      expect(error).toBeInstanceOf(Error)
    })
  })

  describe('publishDataset', () => {
    const testVersionUpdateType = VersionUpdateType.MAJOR
    const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/datasets/${testDatasetModel.id}/actions/:publish`
    const expectedApiKeyRequestConfig = {
      ...TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY,
      params: { type: VersionUpdateType.MAJOR }
    }
    const expectedCookieRequestConfig = {
      ...TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE,
      params: { type: VersionUpdateType.MAJOR }
    }

    test('should return nothing when providing id, version update type and response is successful', async () => {
      jest.spyOn(axios, 'post').mockResolvedValue(undefined)

      // API Key auth
      let actual = await sut.publishDataset(testDatasetModel.id, testVersionUpdateType)

      expect(axios.post).toHaveBeenCalledWith(
        expectedApiEndpoint,
        '{}',
        expectedApiKeyRequestConfig
      )
      expect(actual).toBeUndefined()

      // API Key auth
      ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)

      actual = await sut.publishDataset(testDatasetModel.id, testVersionUpdateType)

      expect(axios.post).toHaveBeenCalledWith(
        expectedApiEndpoint,
        '{}',
        expectedCookieRequestConfig
      )
      expect(actual).toBeUndefined()
    })

    test('should return error result on error response', async () => {
      jest.spyOn(axios, 'post').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

      let error: WriteError = undefined
      await sut.publishDataset(testDatasetModel.id, testVersionUpdateType).catch((e) => (error = e))

      expect(axios.post).toHaveBeenCalledWith(
        expectedApiEndpoint,
        '{}',
        expectedApiKeyRequestConfig
      )
      expect(error).toBeInstanceOf(Error)
    })
  })
})
