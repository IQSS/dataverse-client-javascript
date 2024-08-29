import { CollectionsRepository } from '../../../src/collections/infra/repositories/CollectionsRepository'
import axios from 'axios'
import {
  ApiConfig,
  DataverseApiAuthMechanism
} from '../../../src/core/infra/repositories/ApiConfig'
import {
  createCollectionDTO,
  createCollectionFacetRequestPayload,
  createCollectionModel,
  createCollectionPayload,
  createNewCollectionRequestPayload
} from '../../testHelpers/collections/collectionHelper'
import { TestConstants } from '../../testHelpers/TestConstants'
import { ReadError, WriteError } from '../../../src'
import { ROOT_COLLECTION_ALIAS } from '../../../src/collections/domain/models/Collection'
import {
  createCollectionUserPermissionsModel,
  createCollectionUserPermissionsPayload
} from '../../testHelpers/collections/collectionUserPermissionsHelper'
import {
  createDatasetPreviewModel,
  createDatasetPreviewPayload
} from '../../testHelpers/datasets/datasetPreviewHelper'
import {
  createFilePreviewModel,
  createFilePreviewPayload
} from '../../testHelpers/files/filePreviewHelper'
import { CollectionItemSubset } from '../../../src/collections/domain/models/CollectionItemSubset'

describe('CollectionsRepository', () => {
  const sut: CollectionsRepository = new CollectionsRepository()
  const testCollectionSuccessfulResponse = {
    data: {
      status: 'OK',
      data: createCollectionPayload()
    }
  }
  const testCollectionModel = createCollectionModel()

  beforeEach(() => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      TestConstants.TEST_DUMMY_API_KEY
    )

    jest.clearAllMocks()
  })

  describe('getCollection', () => {
    const expectedRequestConfigApiKey = {
      params: {
        returnOwners: true
      },
      headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY.headers
    }

    describe('by numeric id', () => {
      test('should return Collection when providing a numeric id', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue(testCollectionSuccessfulResponse)
        const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/dataverses/${testCollectionModel.id}`

        // API Key auth
        const actual = await sut.getCollection(testCollectionModel.id)

        expect(axios.get).toHaveBeenCalledWith(expectedApiEndpoint, expectedRequestConfigApiKey)
        expect(actual).toStrictEqual(createCollectionModel())
      })

      test('should return error on repository read error', async () => {
        jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)
        const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/dataverses/${testCollectionModel.id}`
        let error = undefined as unknown as ReadError

        await sut.getCollection(testCollectionModel.id).catch((e) => (error = e))

        expect(axios.get).toHaveBeenCalledWith(expectedApiEndpoint, expectedRequestConfigApiKey)
        expect(error).toBeInstanceOf(Error)
      })
    })
    describe('by alias id', () => {
      test('should return a Collection when providing the Collection alias is successful', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue(testCollectionSuccessfulResponse)
        const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/dataverses/${testCollectionModel.alias}`

        // API Key auth
        const actual = await sut.getCollection(testCollectionModel.alias)

        expect(axios.get).toHaveBeenCalledWith(expectedApiEndpoint, expectedRequestConfigApiKey)
        expect(actual).toStrictEqual(createCollectionModel())
      })

      test('should return error on repository read error', async () => {
        jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)
        const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/dataverses/${testCollectionModel.alias}`
        let error = undefined as unknown as ReadError

        await sut.getCollection(testCollectionModel.alias).catch((e) => (error = e))

        expect(axios.get).toHaveBeenCalledWith(expectedApiEndpoint, expectedRequestConfigApiKey)
        expect(error).toBeInstanceOf(Error)
      })
    })
    describe('by default root id', () => {
      test('should return a Collection when no collection id, using ROOT instead is successful', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue(testCollectionSuccessfulResponse)
        const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/dataverses/${ROOT_COLLECTION_ALIAS}`

        // API Key auth
        const actual = await sut.getCollection()

        expect(axios.get).toHaveBeenCalledWith(expectedApiEndpoint, expectedRequestConfigApiKey)
        expect(actual).toStrictEqual(createCollectionModel())
      })

      test('should return error on repository read error', async () => {
        jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)
        const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/dataverses/${ROOT_COLLECTION_ALIAS}`

        let error = undefined as unknown as ReadError

        await sut.getCollection().catch((e) => (error = e))

        expect(axios.get).toHaveBeenCalledWith(expectedApiEndpoint, expectedRequestConfigApiKey)
        expect(error).toBeInstanceOf(Error)
      })
    })
  })

  describe('createCollection', () => {
    const testNewCollection = createCollectionDTO()

    const testCreatedCollectionId = 1
    const testCreateCollectionResponse = {
      data: {
        status: 'OK',
        data: {
          id: testCreatedCollectionId
        }
      }
    }

    const expectedNewCollectionRequestPayloadJson = JSON.stringify(
      createNewCollectionRequestPayload()
    )
    const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/dataverses/root`

    test('should call the API with a correct request payload', async () => {
      jest.spyOn(axios, 'post').mockResolvedValue(testCreateCollectionResponse)

      // API Key auth
      let actual = await sut.createCollection(testNewCollection)

      expect(axios.post).toHaveBeenCalledWith(
        expectedApiEndpoint,
        expectedNewCollectionRequestPayloadJson,
        TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
      )
      expect(actual).toStrictEqual(testCreatedCollectionId)

      // Session cookie auth
      ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)

      actual = await sut.createCollection(testNewCollection)

      expect(axios.post).toHaveBeenCalledWith(
        expectedApiEndpoint,
        expectedNewCollectionRequestPayloadJson,
        TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE
      )
      expect(actual).toStrictEqual(testCreatedCollectionId)
    })

    test('should return error result on error response', async () => {
      jest.spyOn(axios, 'post').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

      let error = undefined as unknown as WriteError
      await sut.createCollection(testNewCollection).catch((e) => (error = e))

      expect(axios.post).toHaveBeenCalledWith(
        expectedApiEndpoint,
        expectedNewCollectionRequestPayloadJson,
        TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
      )
      expect(error).toBeInstanceOf(Error)
    })
  })

  describe('getCollectionFacets', () => {
    const testFacetsSuccessfulResponse = {
      data: {
        status: 'OK',
        data: [createCollectionFacetRequestPayload()]
      }
    }

    describe('by numeric id', () => {
      const expectedRequestConfigApiKey = {
        params: {
          returnDetails: true
        },
        headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY.headers
      }

      test('should return facets when providing a valid id', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue(testFacetsSuccessfulResponse)
        const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/dataverses/${testCollectionModel.id}/facets`

        // API Key auth
        let actual = await sut.getCollectionFacets(testCollectionModel.id)

        expect(axios.get).toHaveBeenCalledWith(expectedApiEndpoint, expectedRequestConfigApiKey)
        expect(actual.length).toBe(1)
        expect(actual[0].name).toBe('testName')
        expect(actual[0].displayName).toBe('testDisplayName')
        expect(actual[0].id).toBe(1)

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)

        actual = await sut.getCollectionFacets(testCollectionModel.id)

        expect(axios.get).toHaveBeenCalledWith(expectedApiEndpoint, expectedRequestConfigApiKey)
        expect(actual.length).toBe(1)
        expect(actual[0].name).toBe('testName')
        expect(actual[0].displayName).toBe('testDisplayName')
        expect(actual[0].id).toBe(1)
      })

      test('should return error on repository read error', async () => {
        jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)
        const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/dataverses/${testCollectionModel.id}/facets`
        let error = undefined as unknown as ReadError

        await sut.getCollectionFacets(testCollectionModel.id).catch((e) => (error = e))

        expect(axios.get).toHaveBeenCalledWith(expectedApiEndpoint, expectedRequestConfigApiKey)
        expect(error).toBeInstanceOf(Error)
      })
    })
  })

  describe('getCollectionUserPermissions', () => {
    const testCollectionUserPermissions = createCollectionUserPermissionsModel()
    const testCollectionUserPermissionsResponse = {
      data: {
        status: 'OK',
        data: createCollectionUserPermissionsPayload()
      }
    }

    describe('by numeric id', () => {
      const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/dataverses/${testCollectionModel.id}/userPermissions`

      test('should return dataset user permissions when providing id and response is successful', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue(testCollectionUserPermissionsResponse)

        // API Key auth
        let actual = await sut.getCollectionUserPermissions(testCollectionModel.id)

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
        )
        expect(actual).toStrictEqual(testCollectionUserPermissions)

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)

        actual = await sut.getCollectionUserPermissions(testCollectionModel.id)

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE
        )
        expect(actual).toStrictEqual(testCollectionUserPermissions)
      })

      test('should return error result on error response', async () => {
        jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

        let error = undefined as unknown as ReadError
        await sut.getCollectionUserPermissions(testCollectionModel.id).catch((e) => (error = e))

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
        )
        expect(error).toBeInstanceOf(Error)
      })
    })
  })

  describe('getCollectionItems', () => {
    const testItems = [createDatasetPreviewModel(), createFilePreviewModel()]
    const testTotalCount = 2

    const testItemSubset: CollectionItemSubset = {
      items: testItems,
      totalItemCount: testTotalCount
    }

    const testItemPreviewsResponse = {
      data: {
        status: 'OK',
        data: {
          total_count: testTotalCount,
          items: [createDatasetPreviewPayload(), createFilePreviewPayload()]
        }
      }
    }

    const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/search?q=*&sort=date&order=desc`

    test('should return item previews when response is successful', async () => {
      jest.spyOn(axios, 'get').mockResolvedValue(testItemPreviewsResponse)

      // API Key auth
      let actual = await sut.getCollectionItems()

      expect(axios.get).toHaveBeenCalledWith(
        expectedApiEndpoint,
        TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
      )

      expect(actual).toStrictEqual(testItemSubset)

      // Session cookie auth
      ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)

      actual = await sut.getCollectionItems()

      expect(axios.get).toHaveBeenCalledWith(
        expectedApiEndpoint,
        TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE
      )
      expect(actual).toStrictEqual(testItemSubset)
    })

    test('should return item previews when providing pagination params and response is successful', async () => {
      jest.spyOn(axios, 'get').mockResolvedValue(testItemPreviewsResponse)

      const testLimit = 10
      const testOffset = 20

      // API Key auth
      let actual = await sut.getCollectionItems(undefined, testLimit, testOffset)

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
      expect(actual).toStrictEqual(testItemSubset)

      // Session cookie auth
      ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)

      actual = await sut.getCollectionItems(undefined, testLimit, testOffset)

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
      expect(actual).toStrictEqual(testItemSubset)
    })

    it('should return item previews when providing collection id and response is successful', async () => {
      jest.spyOn(axios, 'get').mockResolvedValue(testItemPreviewsResponse)

      const testCollectionId = 'testCollectionId'

      // API Key auth
      let actual = await sut.getCollectionItems(testCollectionId, undefined, undefined)

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
      expect(actual).toStrictEqual(testItemSubset)

      // Session cookie auth
      ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)

      actual = await sut.getCollectionItems(testCollectionId, undefined, undefined)

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
      expect(actual).toStrictEqual(testItemSubset)
    })

    test('should return error result on error response', async () => {
      jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

      let error = undefined as unknown as ReadError
      await sut.getCollectionItems().catch((e) => (error = e))

      expect(axios.get).toHaveBeenCalledWith(
        expectedApiEndpoint,
        TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
      )
      expect(error).toBeInstanceOf(Error)
    })
  })
})
