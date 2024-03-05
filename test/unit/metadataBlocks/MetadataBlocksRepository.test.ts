import { MetadataBlocksRepository } from '../../../src/metadataBlocks/infra/repositories/MetadataBlocksRepository'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'
import {
  ApiConfig,
  DataverseApiAuthMechanism
} from '../../../src/core/infra/repositories/ApiConfig'
import {
  createMetadataBlockModel,
  createMetadataBlockPayload
} from '../../testHelpers/metadataBlocks/metadataBlockHelper'
import { TestConstants } from '../../testHelpers/TestConstants'
import axios from 'axios'

describe('getMetadataBlockByName', () => {
  const sut: MetadataBlocksRepository = new MetadataBlocksRepository()
  const testMetadataBlockName = 'test'

  beforeEach(() => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      TestConstants.TEST_DUMMY_API_KEY
    )
  })

  test('should return metadata block on successful response', async () => {
    const testSuccessfulResponse = {
      data: {
        status: 'OK',
        data: createMetadataBlockPayload()
      }
    }
    jest.spyOn(axios, 'get').mockResolvedValue(testSuccessfulResponse)

    const actual = await sut.getMetadataBlockByName(testMetadataBlockName)

    expect(axios.get).toHaveBeenCalledWith(
      `${TestConstants.TEST_API_URL}/metadatablocks/${testMetadataBlockName}`,
      TestConstants.TEST_EXPECTED_UNAUTHENTICATED_REQUEST_CONFIG
    )
    expect(actual).toMatchObject(createMetadataBlockModel())
  })

  test('should return error result on error response', async () => {
    const testErrorResponse = {
      response: {
        status: 'ERROR',
        message: 'test'
      }
    }
    jest.spyOn(axios, 'get').mockRejectedValue(testErrorResponse)

    let error: ReadError = undefined
    await sut.getMetadataBlockByName(testMetadataBlockName).catch((e) => (error = e))

    expect(axios.get).toHaveBeenCalledWith(
      `${TestConstants.TEST_API_URL}/metadatablocks/${testMetadataBlockName}`,
      TestConstants.TEST_EXPECTED_UNAUTHENTICATED_REQUEST_CONFIG
    )
    expect(error).toBeInstanceOf(Error)
  })
})
