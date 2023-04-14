import { UsersRepository } from '../../../src/users/infra/repositories/UsersRepository';
import { assert, createSandbox, SinonSandbox } from 'sinon';
import axios from 'axios';
import { expect } from 'chai';
import { ReadError } from '../../../src/core/domain/repositories/ReadError';
import { createAuthenticatedUser } from '../../testHelpers/users/authenticatedUserHelper';

describe('getCurrentAuthenticatedUser', () => {
  const testApiUrl = 'https://test.dataverse.org/api/v1';
  const sandbox: SinonSandbox = createSandbox();
  const sut: UsersRepository = new UsersRepository(testApiUrl);

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

    const actual = await sut.getCurrentAuthenticatedUser();

    assert.calledWithExactly(axiosGetStub, `${testApiUrl}/users/:me`);
    assert.match(actual, testAuthenticatedUser);
  });

  test('should return error result on error response', async () => {
    const testErrorResponse = {
      response: {
        status: 'ERROR',
        message: 'test',
      },
    };
    const axiosGetStub = sandbox.stub(axios, 'get').rejects(testErrorResponse);

    let error: ReadError = undefined;
    await sut.getCurrentAuthenticatedUser().catch((e) => (error = e));

    assert.calledWithExactly(axiosGetStub, `${testApiUrl}/users/:me`);
    expect(error).to.be.instanceOf(Error);
  });
});
