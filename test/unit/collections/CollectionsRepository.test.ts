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
    const expectedRequestConfigSessionCookie = {
      params: {
        returnOwners: true
      },
      withCredentials:
        TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE.withCredentials,
      headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE.headers
    }

    describe('by numeric id', () => {
      test('should return Dataset when providing id, version id, and response is successful', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue(testCollectionSuccessfulResponse)
        const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/${testCollectionModel.id}`

        // API Key auth
        let actual = await sut.getCollection(testCollectionModel.id)

        expect(axios.get).toHaveBeenCalledWith(expectedApiEndpoint, expectedRequestConfigApiKey)
        expect(actual).toStrictEqual(testCollectionModel)

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)
        actual = await sut.getCollection(testCollectionModel.id)
        expect(axios.get).toHaveBeenCalledWith(
          expectedApiEndpoint,
          expectedRequestConfigSessionCookie
        )
        expect(actual).toStrictEqual(testCollectionModel)
      })

      // test('should return Dataset when providing id, version id, and response with license is successful', async () => {
      //   const testDatasetLicense = createDatasetLicenseModel()
      //   const testDatasetVersionWithLicenseSuccessfulResponse = {
      //     data: {
      //       status: 'OK',
      //       data: createDatasetVersionPayload(testDatasetLicense)
      //     }
      //   }
      //   jest.spyOn(axios, 'get').mockResolvedValue(testDatasetVersionWithLicenseSuccessfulResponse)

      //   const actual = await sut.getDataset(
      //     testDatasetModel.id,
      //     testVersionId,
      //     testIncludeDeaccessioned
      //   )

      //   expect(axios.get).toHaveBeenCalledWith(
      //     `${TestConstants.TEST_API_URL}/datasets/${testDatasetModel.id}/versions/${testVersionId}`,
      //     expectedRequestConfigApiKey
      //   )
      //   expect(actual).toStrictEqual(createDatasetModel(testDatasetLicense))
      // })

      // test('should return error on repository read error', async () => {
      //   jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

      //   let error: ReadError = undefined
      //   await sut
      //     .getDataset(testDatasetModel.id, testVersionId, testIncludeDeaccessioned)
      //     .catch((e) => (error = e))

      //   expect(axios.get).toHaveBeenCalledWith(
      //     `${TestConstants.TEST_API_URL}/datasets/${testDatasetModel.id}/versions/${testVersionId}`,
      //     expectedRequestConfigApiKey
      //   )
      //   expect(error).toBeInstanceOf(Error)
      // })
    })
  })
})
