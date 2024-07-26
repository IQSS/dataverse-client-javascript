import { CollectionsRepository } from '../../../src/collections/infra/repositories/CollectionsRepository'
import axios from 'axios'
import {
  ApiConfig,
  DataverseApiAuthMechanism
} from '../../../src/core/infra/repositories/ApiConfig'
import {
  createCollectionDTO,
  createCollectionModel,
  createCollectionPayload,
  createNewCollectionRequestPayload
} from '../../testHelpers/collections/collectionHelper'
import { TestConstants } from '../../testHelpers/TestConstants'
import { ReadError, WriteError } from '../../../src'
import { ROOT_COLLECTION_ALIAS } from '../../../src/collections/domain/models/Collection'

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
        data: ['authorName', 'subject', 'keywordValue', 'dateOfDeposit']
      }
    }

    describe('by numeric id', () => {
      test('should return facets when providing a valid id', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue(testFacetsSuccessfulResponse)
        const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/dataverses/${testCollectionModel.id}/facets`

        // API Key auth
        let actual = await sut.getCollectionFacets(testCollectionModel.id)

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
        )
        expect(actual).toContain('authorName')
        expect(actual).toContain('subject')
        expect(actual).toContain('keywordValue')
        expect(actual).toContain('dateOfDeposit')

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)

        actual = await sut.getCollectionFacets(testCollectionModel.id)

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE
        )
        expect(actual).toContain('authorName')
        expect(actual).toContain('subject')
        expect(actual).toContain('keywordValue')
        expect(actual).toContain('dateOfDeposit')
      })

      test('should return error on repository read error', async () => {
        jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)
        const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/dataverses/${testCollectionModel.id}/facets`
        let error = undefined as unknown as ReadError

        await sut.getCollectionFacets(testCollectionModel.id).catch((e) => (error = e))

        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
        )
        expect(error).toBeInstanceOf(Error)
      })
    })
  })
})
