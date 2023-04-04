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
    const testDataverseVersion = '5.13';
    const testSuccessfulResponse = {
      data: {
        status: 'OK',
        data: {
          version: testDataverseVersion,
          build: 'test',
        },
      },
    };
    const axiosGetStub = sandbox.stub(axios, 'get').resolves(testSuccessfulResponse);

    const actual = await sut.getDataverseVersion();

    assert.calledWithExactly(axiosGetStub, `${testApiUrl}/info/version`);
    assert.match(actual, testDataverseVersion);
  });

  test('should return error result on error response', async () => {
    const axiosGetStub = sandbox.stub(axios, 'get').rejects({ response: { status: 1, data: { message: 'test' } } });

    let error: ReadError = undefined;
    await sut.getDataverseVersion().catch((e) => (error = e));

    assert.calledWithExactly(axiosGetStub, `${testApiUrl}/info/version`);
    expect(error).to.be.instanceOf(Error);
  });
});
