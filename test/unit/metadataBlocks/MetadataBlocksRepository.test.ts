import { MetadataBlocksRepository } from '../../../src/metadataBlocks/infra/repositories/MetadataBlocksRepository'
import { assert, createSandbox, SinonSandbox } from 'sinon'
import axios from 'axios'
import { expect } from 'chai'
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

describe('getMetadataBlockByName', () => {
  const sandbox: SinonSandbox = createSandbox()
  const sut: MetadataBlocksRepository = new MetadataBlocksRepository()
  const testMetadataBlockName = 'test'

  beforeEach(() => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      TestConstants.TEST_DUMMY_API_KEY
    )
  })

  afterEach(() => {
    sandbox.restore()
  })

  test('should return metadata block on successful response', async () => {
    const testSuccessfulResponse = {
      data: {
        status: 'OK',
        data: createMetadataBlockPayload()
      }
    }
    const axiosGetStub = sandbox.stub(axios, 'get').resolves(testSuccessfulResponse)

    const actual = await sut.getMetadataBlockByName(testMetadataBlockName)

    assert.calledWithExactly(
      axiosGetStub,
      `${TestConstants.TEST_API_URL}/metadatablocks/${testMetadataBlockName}`,
      TestConstants.TEST_EXPECTED_UNAUTHENTICATED_REQUEST_CONFIG
    )
    assert.match(actual, createMetadataBlockModel())
  })

  test('should return error result on error response', async () => {
    const testErrorResponse = {
      response: {
        status: 'ERROR',
        message: 'test'
      }
    }
    const axiosGetStub = sandbox.stub(axios, 'get').rejects(testErrorResponse)

    let error: ReadError = undefined
    await sut.getMetadataBlockByName(testMetadataBlockName).catch((e) => (error = e))

    assert.calledWithExactly(
      axiosGetStub,
      `${TestConstants.TEST_API_URL}/metadatablocks/${testMetadataBlockName}`,
      TestConstants.TEST_EXPECTED_UNAUTHENTICATED_REQUEST_CONFIG
    )
    expect(error).to.be.instanceOf(Error)
  })
})
