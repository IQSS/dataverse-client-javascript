import { AuthRepository } from '../../../src/auth/infra/repositories/AuthRepository'
import { assert, createSandbox, SinonSandbox } from 'sinon'
import axios from 'axios'
import { expect } from 'chai'
import {
  ApiConfig,
  DataverseApiAuthMechanism
} from '../../../src/core/infra/repositories/ApiConfig'
import { WriteError } from '../../../src/core/domain/repositories/WriteError'
import { TestConstants } from '../../testHelpers/TestConstants'

describe('logout', () => {
  const sandbox: SinonSandbox = createSandbox()
  const sut: AuthRepository = new AuthRepository()

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

  test('should not return error on successful response', async () => {
    const testSuccessfulResponse = {
      data: {
        status: 'OK',
        data: {
          message: 'User logged out'
        }
      }
    }
    const axiosPostStub = sandbox.stub(axios, 'post').resolves(testSuccessfulResponse)
    const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/logout`

    // API Key auth
    await sut.logout()

    assert.calledWithExactly(
      axiosPostStub,
      expectedApiEndpoint,
      JSON.stringify(''),
      TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
    )

    // Session cookie auth
    ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE)

    await sut.logout()

    assert.calledWithExactly(
      axiosPostStub,
      expectedApiEndpoint,
      JSON.stringify(''),
      TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE
    )
  })

  test('should return error result on error response', async () => {
    const axiosPostStub = sandbox.stub(axios, 'post').rejects(TestConstants.TEST_ERROR_RESPONSE)

    let error: WriteError = undefined
    await sut.logout().catch((e) => (error = e))

    assert.calledWithExactly(
      axiosPostStub,
      `${TestConstants.TEST_API_URL}/logout`,
      JSON.stringify(''),
      TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
    )
    expect(error).to.be.instanceOf(Error)
  })
})
