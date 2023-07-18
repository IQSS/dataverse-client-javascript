import { UsersRepository } from '../../../src/users/infra/repositories/UsersRepository';
import { assert, createSandbox, SinonSandbox } from 'sinon';
import axios from 'axios';
import { expect } from 'chai';
import { ReadError } from '../../../src/core/domain/repositories/ReadError';
import { createAuthenticatedUser } from '../../testHelpers/users/authenticatedUserHelper';
import { ApiConfig, DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig';
import { TestConstants } from '../../testHelpers/TestConstants';

describe('getCurrentAuthenticatedUser', () => {
  const sandbox: SinonSandbox = createSandbox();
  const sut: UsersRepository = new UsersRepository();

  beforeEach(() => {
    ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.API_KEY, TestConstants.TEST_DUMMY_API_KEY);
  });

  afterEach(() => {
    sandbox.restore();
  });

  test('should return authenticated user on successful response', async () => {
    const testAuthenticatedUser = createAuthenticatedUser();
    const testSuccessfulResponse = {
      data: {
        status: 'OK',
        data: {
          id: testAuthenticatedUser.id,
          persistentUserId: testAuthenticatedUser.persistentUserId,
          identifier: testAuthenticatedUser.identifier,
          displayName: testAuthenticatedUser.displayName,
          firstName: testAuthenticatedUser.firstName,
          lastName: testAuthenticatedUser.lastName,
          email: testAuthenticatedUser.email,
          superuser: testAuthenticatedUser.superuser,
          deactivated: testAuthenticatedUser.deactivated,
          createdTime: testAuthenticatedUser.createdTime,
          authenticationProviderId: testAuthenticatedUser.authenticationProviderId,
          lastLoginTime: testAuthenticatedUser.lastLoginTime,
          lastApiUseTime: testAuthenticatedUser.lastApiUseTime,
        },
      },
    };
    const axiosGetStub = sandbox.stub(axios, 'get').resolves(testSuccessfulResponse);
    const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/users/:me`;

    // API Key auth
    let actual = await sut.getCurrentAuthenticatedUser();

    assert.calledWithExactly(
      axiosGetStub,
      expectedApiEndpoint,
      TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY,
    );

    assert.match(actual, testAuthenticatedUser);

    // Session cookie auth
    ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE);
    actual = await sut.getCurrentAuthenticatedUser();

    assert.calledWithExactly(
      axiosGetStub,
      expectedApiEndpoint,
      TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE,
    );

    assert.match(actual, testAuthenticatedUser);
  });

  test('should return error result on error response', async () => {
    const axiosGetStub = sandbox.stub(axios, 'get').rejects(TestConstants.TEST_ERROR_RESPONSE);

    let error: ReadError = undefined;
    await sut.getCurrentAuthenticatedUser().catch((e) => (error = e));

    assert.calledWithExactly(
      axiosGetStub,
      `${TestConstants.TEST_API_URL}/users/:me`,
      TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY,
    );
    expect(error).to.be.instanceOf(Error);
  });
});
