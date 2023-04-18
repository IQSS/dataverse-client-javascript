import { DataverseInfoRepository } from '../../../src/info/infra/repositories/DataverseInfoRepository';
import { assert, createSandbox, SinonSandbox } from 'sinon';
import axios from 'axios';
import { expect } from 'chai';
import { ReadError } from '../../../src/core/domain/repositories/ReadError';

describe('getDataverseVersion', () => {
  const testApiUrl = 'https://test.dataverse.org/api/v1';
  const sandbox: SinonSandbox = createSandbox();
  const sut: DataverseInfoRepository = new DataverseInfoRepository(testApiUrl);

  afterEach(() => {
    sandbox.restore();
  });

  test('should return Dataverse version on successful response', async () => {
    const testVersionNumber = '5.13';
    const testVersionBuild = 'testBuild';
    const testSuccessfulResponse = {
      data: {
        status: 'OK',
        data: {
          version: testVersionNumber,
          build: testVersionBuild,
        },
      },
    };
    const axiosGetStub = sandbox.stub(axios, 'get').resolves(testSuccessfulResponse);

    const actual = await sut.getDataverseVersion();

    assert.calledWithExactly(axiosGetStub, `${testApiUrl}/info/version`, { withCredentials: true });
    assert.match(actual.number, testVersionNumber);
    assert.match(actual.build, testVersionBuild);
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
    await sut.getDataverseVersion().catch((e) => (error = e));

    assert.calledWithExactly(axiosGetStub, `${testApiUrl}/info/version`, { withCredentials: true });
    expect(error).to.be.instanceOf(Error);
  });
});
