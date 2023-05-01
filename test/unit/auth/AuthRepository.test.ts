import { AuthRepository } from '../../../src/auth/infra/repositories/AuthRepository';
import { assert, createSandbox, SinonSandbox } from 'sinon';
import axios from 'axios';
import { expect } from 'chai';
import { ApiConfig } from '../../../src/core/infra/repositories/ApiConfig';
import { WriteError } from '../../../src/core/domain/repositories/WriteError';

describe('logout', () => {
  const sandbox: SinonSandbox = createSandbox();
  const sut: AuthRepository = new AuthRepository();
  const testApiUrl = 'https://test.dataverse.org/api/v1';

  ApiConfig.init(testApiUrl);

  afterEach(() => {
    sandbox.restore();
  });

  test('should not return error on successful response', async () => {
    const testSuccessfulResponse = {
      data: {
        status: 'OK',
        data: {
          message: 'User logged out',
        },
      },
    };
    const axiosPostStub = sandbox.stub(axios, 'post').resolves(testSuccessfulResponse);

    await sut.logout();

    assert.calledWithExactly(axiosPostStub, `${testApiUrl}/logout`, JSON.stringify(''), {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    });
  });

  test('should return error result on error response', async () => {
    const testErrorResponse = {
      response: {
        status: 'ERROR',
        message: 'test',
      },
    };
    const axiosPostStub = sandbox.stub(axios, 'post').rejects(testErrorResponse);

    let error: WriteError = undefined;
    await sut.logout().catch((e) => (error = e));

    assert.calledWithExactly(axiosPostStub, `${testApiUrl}/logout`, JSON.stringify(''), {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    });
    expect(error).to.be.instanceOf(Error);
  });
});
