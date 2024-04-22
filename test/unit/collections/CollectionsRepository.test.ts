import { CollectionsRepository } from '../../../src/collections/infra/repositories/CollectionsRepository'
import axios from 'axios'
import {
  ApiConfig,
  DataverseApiAuthMechanism
} from '../../../src/core/infra/repositories/ApiConfig'
import {
  createCollectionModel,
  createCollectionPayload
} from '../../testHelpers/collections/collectionHelper'
import { TestConstants } from '../../testHelpers/TestConstants'
import { ReadError } from '../../../src'
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
})
