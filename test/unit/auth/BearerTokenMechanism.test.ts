/**
 * @jest-environment jsdom
 */

import axios from 'axios'
import { ApiConfig } from '../../../src'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import { TestConstants } from '../../testHelpers/TestConstants'
import { CollectionsRepository } from '../../../src/collections/infra/repositories/CollectionsRepository'
import {
  createCollectionModel,
  createCollectionPayload
} from '../../testHelpers/collections/collectionHelper'

describe('BearerTokenMechanism', () => {
  const collectionRepo: CollectionsRepository = new CollectionsRepository()
  const testCollectionSuccessfulResponse = {
    data: {
      status: 'OK',
      data: createCollectionPayload()
    }
  }

  const testCollectionModel = createCollectionModel()

  beforeEach(() => {
    window.localStorage.setItem(
      TestConstants.TEST_BEARER_TOKEN_LOCAL_STORAGE_KEY,
      JSON.stringify(TestConstants.TEST_DUMMY_BEARER_TOKEN)
    )
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.BEARER_TOKEN,
      undefined,
      TestConstants.TEST_BEARER_TOKEN_LOCAL_STORAGE_KEY
    )

    jest.clearAllMocks()
  })

  afterEach(() => {
    window.localStorage.clear()
  })

  it('Sends request with bearer token', async () => {
    const expectedRequestConfigBearerToken = {
      headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_BEARER_TOKEN.headers,
      params: {
        returnOwners: true
      },
      withCredentials:
        TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_BEARER_TOKEN.withCredentials
    }

    jest.spyOn(axios, 'get').mockResolvedValue(testCollectionSuccessfulResponse)
    const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/dataverses/${testCollectionModel.id}`

    const actual = await collectionRepo.getCollection(testCollectionModel.id)

    expect(axios.get).toHaveBeenCalledWith(expectedApiEndpoint, expectedRequestConfigBearerToken)
    expect(actual).toStrictEqual(createCollectionModel())
  })
})
