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
  createDatasetLicenseModel,
  createUpdateDatasetRequestPayload
} from '../../testHelpers/datasets/datasetHelper'
import { TestConstants } from '../../testHelpers/TestConstants'
import {
  DatasetNotNumberedVersion,
  DatasetPreviewSubset,
  DatasetVersionSummarySubset
} from '../../../src/datasets'
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
  createDatasetReviewModel,
  createDatasetReviewPayload
} from '../../testHelpers/datasets/datasetReviewHelper'
import {
  createDatasetDTO,
  createDatasetDeaccessionDTO,
  createDatasetMetadataBlockModel,
  createNewDatasetRequestPayload
} from '../../testHelpers/datasets/datasetHelper'
import { WriteError } from '../../../src'
import { VersionUpdateType } from '../../../src/datasets/domain/models/Dataset'
import { DatasetDownloadCount } from '../../../src/datasets/domain/models/DatasetDownloadCount'
import { createDatasetVersionSummaryModel } from '../../testHelpers/datasets/datasetVersionsSummariesHelper'

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

      let error = undefined as unknown as ReadError
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
          testIncludeDeaccessioned,
          false
        )

        expect(axios.get).toHaveBeenCalledWith(expectedApiEndpoint, expectedRequestConfigApiKey)
        expect(actual).toStrictEqual(testDatasetModel)

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)
        actual = await sut.getDataset(
          testDatasetModel.id,
          testVersionId,
          testIncludeDeaccessioned,
          false
        )
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
          testIncludeDeaccessioned,
          false
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
          testIncludeDeaccessioned,
          false
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
          testIncludeDeaccessioned,
          false
        )

        expect(axios.get).toHaveBeenCalledWith(
          `${TestConstants.TEST_API_URL}/datasets/${testDatasetModel.id}/versions/${testVersionId}`,
          expectedRequestConfigApiKey
        )
        expect(actual).toStrictEqual(createDatasetModel(undefined, true))
      })
      test('should return Dataset with customTerms when license is undefined', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue(testDatasetVersionSuccessfulResponse)
        const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/datasets/${testDatasetModel.id}/versions/${testVersionId}`

        // API Key auth
        let actual = await sut.getDataset(
          testDatasetModel.id,
          testVersionId,
          testIncludeDeaccessioned,
          false
        )

        expect(axios.get).toHaveBeenCalledWith(expectedApiEndpoint, expectedRequestConfigApiKey)
        expect(actual).toStrictEqual(testDatasetModel)

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)
        actual = await sut.getDataset(
          testDatasetModel.id,
          testVersionId,
          testIncludeDeaccessioned,
          false
        )
        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          expectedRequestConfigSessionCookie
        )
        expect(actual).toStrictEqual(testDatasetModel)
      })
      test('should return Dataset without customTerms when license is defined', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue(testDatasetVersionSuccessfulResponse)
        const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/datasets/${testDatasetModel.id}/versions/${testVersionId}`

        // API Key auth
        let actual = await sut.getDataset(
          testDatasetModel.id,
          testVersionId,
          testIncludeDeaccessioned,
          false
        )

        expect(axios.get).toHaveBeenCalledWith(expectedApiEndpoint, expectedRequestConfigApiKey)
        expect(actual).toStrictEqual(testDatasetModel)

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)
        actual = await sut.getDataset(
          testDatasetModel.id,
          testVersionId,
          testIncludeDeaccessioned,
          false
        )
        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          expectedRequestConfigSessionCookie
        )
        expect(actual).toStrictEqual(testDatasetModel)
      })

      test('should return error on repository read error', async () => {
        jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

        let error = undefined as unknown as ReadError
        await sut
          .getDataset(testDatasetModel.id, testVersionId, testIncludeDeaccessioned, false)
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
          testIncludeDeaccessioned,
          false
        )

        expect(axios.get).toHaveBeenCalledWith(expectedApiEndpoint, expectedRequestConfigApiKey)
        expect(actual).toStrictEqual(testDatasetModel)

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)

        actual = await sut.getDataset(
          testDatasetModel.persistentId,
          testVersionId,
          testIncludeDeaccessioned,
          false
        )

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          expectedRequestConfigSessionCookie
        )
        expect(actual).toStrictEqual(testDatasetModel)
      })

      test('should return error on repository read error', async () => {
        jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

        let error = undefined as unknown as ReadError
        await sut
          .getDataset(testDatasetModel.persistentId, testVersionId, testIncludeDeaccessioned, false)
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

      const actual = await sut.getPrivateUrlDataset(testPrivateUrlToken, false)

      expect(axios.get).toHaveBeenCalledWith(
        `${TestConstants.TEST_API_URL}/datasets/privateUrlDatasetVersion/${testPrivateUrlToken}`,
        expectedRequestConfig
      )
      expect(actual).toStrictEqual(testDatasetModel)
    })

    test('should return error on repository read error', async () => {
      jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

      let error = undefined as unknown as ReadError
      await sut.getPrivateUrlDataset(testPrivateUrlToken, false).catch((e) => (error = e))

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

      let error = undefined as unknown as ReadError
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

      let error = undefined as unknown as ReadError
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

        let error = undefined as unknown as ReadError
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

        let error = undefined as unknown as ReadError
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

        let error = undefined as unknown as ReadError
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

        let error = undefined as unknown as ReadError
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

      let error = undefined as unknown as ReadError
      await sut.getAllDatasetPreviews().catch((e) => (error = e))

      expect(axios.get).toHaveBeenCalledWith(
        expectedApiEndpoint,
        TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
      )
      expect(error).toBeInstanceOf(Error)
    })
  })

  describe('getDatasetReviews', () => {
    const testDatasetReviews = [createDatasetReviewModel()]
    const testDatasetReviewsResponse = {
      data: {
        status: 'OK',
        data: {
          reviews: [createDatasetReviewPayload()]
        }
      }
    }

    describe('by numeric id', () => {
      const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/datasets/${testDatasetModel.id}/reviews`

      test('should return dataset reviews when providing id and response is successful', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue(testDatasetReviewsResponse)

        // API Key auth
        let actual = await sut.getDatasetReviews(testDatasetModel.id)

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
        )
        expect(actual).toStrictEqual(testDatasetReviews)

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)

        actual = await sut.getDatasetReviews(testDatasetModel.id)

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE
        )
        expect(actual).toStrictEqual(testDatasetReviews)
      })

      test('should return error result on error response', async () => {
        jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

        let error = undefined as unknown as ReadError
        await sut.getDatasetReviews(testDatasetModel.id).catch((e) => (error = e))

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
        )
        expect(error).toBeInstanceOf(Error)
      })
    })

    describe('by persistent id', () => {
      const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/datasets/:persistentId/reviews?persistentId=${TestConstants.TEST_DUMMY_PERSISTENT_ID}`

      test('should return dataset reviews when providing persistent id and response is successful', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue(testDatasetReviewsResponse)

        // API Key auth
        let actual = await sut.getDatasetReviews(TestConstants.TEST_DUMMY_PERSISTENT_ID)

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
        )
        expect(actual).toStrictEqual(testDatasetReviews)

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)

        actual = await sut.getDatasetReviews(TestConstants.TEST_DUMMY_PERSISTENT_ID)

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE
        )
        expect(actual).toStrictEqual(testDatasetReviews)
      })

      test('should return error result on error response', async () => {
        jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

        let error = undefined as unknown as ReadError
        await sut
          .getDatasetReviews(TestConstants.TEST_DUMMY_PERSISTENT_ID)
          .catch((e) => (error = e))

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
        )
        expect(error).toBeInstanceOf(Error)
      })
    })
  })

  describe('createDataset', () => {
    const testNewDataset = createDatasetDTO()
    const testMetadataBlocks = [createDatasetMetadataBlockModel()]
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

      let error = undefined as unknown as WriteError
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

      let error: WriteError | undefined = undefined
      await sut.publishDataset(testDatasetModel.id, testVersionUpdateType).catch((e) => (error = e))

      expect(axios.post).toHaveBeenCalledWith(
        expectedApiEndpoint,
        '{}',
        expectedApiKeyRequestConfig
      )
      expect(error).toBeInstanceOf(Error)
    })
  })

  describe('updateDataset', () => {
    const testNewDataset = createDatasetDTO()
    const testMetadataBlocks = [createDatasetMetadataBlockModel()]
    const expectedNewDatasetRequestPayloadJson = JSON.stringify(createUpdateDatasetRequestPayload())

    const expectedApiKeyRequestConfig = {
      ...TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY,
      params: { replace: true }
    }
    const expectedCookieRequestConfig = {
      ...TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE,
      params: { replace: true }
    }

    const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/datasets/${testDatasetModel.id}/editMetadata`

    test('should call the API with a correct request payload', async () => {
      jest.spyOn(axios, 'put').mockResolvedValue(undefined)

      // API Key auth
      let actual = await sut.updateDataset(testDatasetModel.id, testNewDataset, testMetadataBlocks)

      expect(axios.put).toHaveBeenCalledWith(
        expectedApiEndpoint,
        expectedNewDatasetRequestPayloadJson,
        expectedApiKeyRequestConfig
      )
      expect(actual).toBeUndefined()

      // Session cookie auth
      ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)

      actual = await sut.updateDataset(testDatasetModel.id, testNewDataset, testMetadataBlocks)

      expect(axios.put).toHaveBeenCalledWith(
        expectedApiEndpoint,
        expectedNewDatasetRequestPayloadJson,
        expectedCookieRequestConfig
      )
      expect(actual).toBeUndefined()
    })

    test('should return error result on error response', async () => {
      jest.spyOn(axios, 'put').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

      let error: WriteError | undefined = undefined
      await sut
        .updateDataset(testDatasetModel.id, testNewDataset, testMetadataBlocks)
        .catch((e) => (error = e))

      expect(axios.put).toHaveBeenCalledWith(
        expectedApiEndpoint,
        expectedNewDatasetRequestPayloadJson,
        expectedApiKeyRequestConfig
      )
      expect(error).toBeInstanceOf(Error)
    })
  })

  describe('deaccessionDataset', () => {
    const version = '1.0'
    const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/datasets/${testDatasetModel.id}/versions/${version}/deaccession`
    const expectedApiKeyRequestConfig = {
      ...TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
    }
    const testDeaccessionDatasetDTO = createDatasetDeaccessionDTO()
    const testDeaccessionDatasetJSON = JSON.stringify(testDeaccessionDatasetDTO)
    test('should return nothing when providing id, version update type and response is successful', async () => {
      jest.spyOn(axios, 'post').mockResolvedValue(undefined)

      let actual = await sut.deaccessionDataset(
        testDatasetModel.id,
        version,
        testDeaccessionDatasetDTO
      )

      expect(axios.post).toHaveBeenCalledWith(
        expectedApiEndpoint,
        testDeaccessionDatasetJSON,
        expectedApiKeyRequestConfig
      )
      expect(actual).toBeUndefined()

      ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)

      actual = await sut.deaccessionDataset(testDatasetModel.id, version, testDeaccessionDatasetDTO)

      expect(axios.post).toHaveBeenCalledWith(
        expectedApiEndpoint,
        testDeaccessionDatasetJSON,
        expectedApiKeyRequestConfig
      )
      expect(actual).toBeUndefined()
    })

    test('should return error result on error response', async () => {
      jest.spyOn(axios, 'post').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

      let error: WriteError | undefined = undefined
      await sut
        .deaccessionDataset(testDatasetModel.id, version, testDeaccessionDatasetDTO)
        .catch((e) => (error = e))

      expect(axios.post).toHaveBeenCalledWith(
        expectedApiEndpoint,
        testDeaccessionDatasetJSON,
        expectedApiKeyRequestConfig
      )
      expect(error).toBeInstanceOf(Error)
    })
  })

  describe('getDatasetDownloadCount', () => {
    const testDatasetDownloadCount: DatasetDownloadCount = {
      id: testDatasetModel.id,
      downloadCount: 1,
      MDCStartDate: '2021-01-01'
    }
    test('should return download count when response is successful', async () => {
      jest.spyOn(axios, 'get').mockResolvedValue({ data: testDatasetDownloadCount })

      const actual = await sut.getDatasetDownloadCount(testDatasetModel.id)

      expect(axios.get).toHaveBeenCalledWith(
        `${TestConstants.TEST_API_URL}/datasets/${testDatasetModel.id}/download/count`,
        TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
      )
      expect(actual).toStrictEqual(testDatasetDownloadCount)
    })

    test('should return error on repository read error', async () => {
      jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

      let error = undefined as unknown as ReadError
      await sut.getDatasetDownloadCount(testDatasetModel.id).catch((e) => (error = e))

      expect(axios.get).toHaveBeenCalledWith(
        `${TestConstants.TEST_API_URL}/datasets/${testDatasetModel.id}/download/count`,
        TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
      )
      expect(error).toBeInstanceOf(Error)
    })
  })

  describe('getDatasetVersionSummaries', () => {
    const testDatasetVersionSummariesSubset: DatasetVersionSummarySubset = {
      summaries: [createDatasetVersionSummaryModel()],
      totalCount: 1
    }

    const testDatasetVersionSummariesResponse = {
      data: {
        status: 'OK',
        data: testDatasetVersionSummariesSubset.summaries,
        totalCount: testDatasetVersionSummariesSubset.totalCount
      }
    }

    describe('by numeric id', () => {
      const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/datasets/${testDatasetModel.id}/versions/compareSummary`

      test('should return dataset version summaries when providing id and response is successful', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue(testDatasetVersionSummariesResponse)

        // API Key auth
        let actual = await sut.getDatasetVersionsSummaries(testDatasetModel.id)

        const expectedRequestParams = new URLSearchParams()

        const expectedRequestConfigApiKey = {
          params: expectedRequestParams,
          headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY.headers
        }

        expect(axios.get).toHaveBeenNthCalledWith(
          1,
          expectedApiEndpoint,
          expectedRequestConfigApiKey
        )
        expect(actual).toStrictEqual(testDatasetVersionSummariesSubset)

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)

        actual = await sut.getDatasetVersionsSummaries(testDatasetModel.id)

        const expectedRequestConfigSessionCookie = {
          params: expectedRequestParams,
          headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE.headers,
          withCredentials: true
        }

        expect(axios.get).toHaveBeenNthCalledWith(
          2,
          expectedApiEndpoint,
          expectedRequestConfigSessionCookie
        )
        expect(actual).toStrictEqual(testDatasetVersionSummariesSubset)
      })

      test('should return error result on error response', async () => {
        jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

        let error = undefined as unknown as ReadError
        await sut.getDatasetVersionsSummaries(testDatasetModel.id).catch((e) => (error = e))

        const expectedRequestParams = new URLSearchParams()

        const expectedRequestConfigApiKey = {
          params: expectedRequestParams,
          headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY.headers
        }

        expect(axios.get).toHaveBeenCalledWith(expectedApiEndpoint, expectedRequestConfigApiKey)
        expect(error).toBeInstanceOf(ReadError)
      })
    })

    describe('by persistent id', () => {
      const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/datasets/:persistentId/versions/compareSummary?persistentId=${TestConstants.TEST_DUMMY_PERSISTENT_ID}`

      test('should return dataset version summaries when providing persistent id and response is successful', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue(testDatasetVersionSummariesResponse)

        // API Key auth
        let actual = await sut.getDatasetVersionsSummaries(TestConstants.TEST_DUMMY_PERSISTENT_ID)

        const expectedRequestParams = new URLSearchParams()

        const expectedRequestConfigApiKey = {
          params: expectedRequestParams,
          headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY.headers
        }

        expect(axios.get).toHaveBeenNthCalledWith(
          1,
          expectedApiEndpoint,
          expectedRequestConfigApiKey
        )
        expect(actual).toStrictEqual(testDatasetVersionSummariesSubset)

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)

        actual = await sut.getDatasetVersionsSummaries(TestConstants.TEST_DUMMY_PERSISTENT_ID)

        const expectedRequestConfigSessionCookie = {
          params: expectedRequestParams,
          headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE.headers,
          withCredentials: true
        }

        expect(axios.get).toHaveBeenNthCalledWith(
          2,
          expectedApiEndpoint,
          expectedRequestConfigSessionCookie
        )
        expect(actual).toStrictEqual(testDatasetVersionSummariesSubset)
      })

      test('should return error result on error response', async () => {
        jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

        let error = undefined as unknown as ReadError
        await sut
          .getDatasetVersionsSummaries(TestConstants.TEST_DUMMY_PERSISTENT_ID)
          .catch((e) => (error = e))

        const expectedRequestParams = new URLSearchParams()

        const expectedRequestConfigApiKey = {
          params: expectedRequestParams,
          headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY.headers
        }

        expect(axios.get).toHaveBeenCalledWith(expectedApiEndpoint, expectedRequestConfigApiKey)
        expect(error).toBeInstanceOf(ReadError)
      })
    })
  })
})

describe('DatasetsRepository curation methods', () => {
  const sut = new DatasetsRepository()
  const status = {
    label: 'Privacy Review',
    createTime: '2026-10-14 12:00:00',
    assigner: '@curator'
  }
  const label = 'Author contacted & approval + résumé / final?'
  const operations = [
    {
      name: 'getAllowedDatasetCurationLabels',
      verb: 'get' as const,
      path: 'allowedCurationLabels',
      params: {},
      data: { message: 'Privacy Review,Final Approval' },
      expected: ['Privacy Review', 'Final Approval'],
      execute: (id: number | string) => sut.getAllowedDatasetCurationLabels(id)
    },
    {
      name: 'getDatasetCurationStatus',
      verb: 'get' as const,
      path: 'curationStatus',
      params: {},
      data: status,
      expected: status,
      execute: (id: number | string) => sut.getDatasetCurationStatus(id)
    },
    {
      name: 'getDatasetCurationStatusHistory',
      verb: 'get' as const,
      path: 'curationStatus',
      params: { includeHistory: true },
      data: [status],
      expected: [status],
      execute: (id: number | string) => sut.getDatasetCurationStatusHistory(id)
    },
    {
      name: 'setDatasetCurationStatus',
      verb: 'put' as const,
      path: 'curationStatus',
      params: { label },
      data: { message: 'Updated' },
      expected: undefined,
      execute: (id: number | string) => sut.setDatasetCurationStatus(id, label)
    },
    {
      name: 'deleteDatasetCurationStatus',
      verb: 'delete' as const,
      path: 'curationStatus',
      params: {},
      data: { message: 'Deleted' },
      expected: undefined,
      execute: (id: number | string) => sut.deleteDatasetCurationStatus(id)
    },
    {
      name: 'submitDatasetForReview',
      verb: 'post' as const,
      path: 'submitForReview',
      params: {},
      data: { inReview: true, message: 'Submitted for review' },
      expected: { inReview: true, message: 'Submitted for review' },
      execute: (id: number | string) => sut.submitDatasetForReview(id)
    }
  ]

  beforeEach(() => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      TestConstants.TEST_DUMMY_API_KEY
    )
  })
  afterEach(() => jest.restoreAllMocks())

  describe.each(operations)('$name', ({ verb, path, params, data, expected, execute }) => {
    test.each([42, 'doi:10.5072/FK2/A+B&C?#résumé'])(
      'should send an authenticated request for %s',
      async (id) => {
        const request = jest.spyOn(axios, verb).mockResolvedValue({ data: { data } })
        const endpoint =
          typeof id === 'number'
            ? `/datasets/${id}/${path}`
            : `/datasets/:persistentId/${path}?persistentId=${encodeURIComponent(id)}`
        const config = {
          ...TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY,
          params
        }

        expect(await execute(id)).toEqual(expected)
        const url = `${TestConstants.TEST_API_URL}${endpoint}`
        const args = verb === 'post' || verb === 'put' ? [url, '', config] : [url, config]
        expect(request).toHaveBeenCalledWith(...args)
      }
    )

    test('should support session authentication', async () => {
      ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)
      const request = jest.spyOn(axios, verb).mockResolvedValue({ data: { data } })
      await execute(42)
      const config = {
        ...TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE,
        params
      }
      const url = `${TestConstants.TEST_API_URL}/datasets/42/${path}`
      const args = verb === 'post' || verb === 'put' ? [url, '', config] : [url, config]
      expect(request).toHaveBeenCalledWith(...args)
    })

    test('should preserve backend permission errors', async () => {
      jest
        .spyOn(axios, verb)
        .mockRejectedValue({ response: { status: 403, data: { message: 'Permission denied' } } })
      await expect(execute(42)).rejects.toEqual(
        verb === 'get'
          ? new ReadError('[403] Permission denied')
          : new WriteError('[403] Permission denied')
      )
    })
  })

  test.each([{ message: '' }, ''])('should normalize empty allowed labels %p', async (data) => {
    jest.spyOn(axios, 'get').mockResolvedValue({ data: { data } })
    expect(await sut.getAllowedDatasetCurationLabels(42)).toEqual([])
  })

  test('should preserve exact label whitespace', async () => {
    jest
      .spyOn(axios, 'get')
      .mockResolvedValue({ data: { data: ' Privacy Review ,Final Approval' } })
    expect(await sut.getAllowedDatasetCurationLabels(42)).toEqual([
      ' Privacy Review ',
      'Final Approval'
    ])
  })

  test('should normalize an absent current status to null', async () => {
    jest.spyOn(axios, 'get').mockResolvedValue({ data: { data: {} } })
    expect(await sut.getDatasetCurationStatus(42)).toBeNull()
  })

  test('should preserve removal records and omitted legacy fields', async () => {
    jest.spyOn(axios, 'get').mockResolvedValue({
      data: {
        data: [
          { createTime: status.createTime, assigner: status.assigner },
          { label: 'Legacy label' }
        ]
      }
    })
    expect(await sut.getDatasetCurationStatusHistory(42)).toStrictEqual([
      { createTime: status.createTime, assigner: status.assigner },
      { label: 'Legacy label' }
    ])
  })

  test('should preserve a current removal record with no label', async () => {
    const removal = { createTime: status.createTime, assigner: status.assigner }
    jest.spyOn(axios, 'get').mockResolvedValue({ data: { data: removal } })

    expect(await sut.getDatasetCurationStatus(42)).toStrictEqual(removal)
  })

  test('should return an empty history unchanged', async () => {
    jest.spyOn(axios, 'get').mockResolvedValue({ data: { data: [] } })
    expect(await sut.getDatasetCurationStatusHistory(42)).toEqual([])
  })
})
