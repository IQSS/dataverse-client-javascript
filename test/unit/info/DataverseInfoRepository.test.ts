import { DataverseInfoRepository } from '../../../src/info/infra/repositories/DataverseInfoRepository';
import { assert, createSandbox, SinonSandbox } from 'sinon';
import axios from 'axios';
import { expect } from 'chai';
import { ReadError } from '../../../src/core/domain/repositories/ReadError';
import { ApiConfig, DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig';
import { TestConstants } from '../../testHelpers/TestConstants';

describe('getDataverseVersion', () => {
  const sandbox: SinonSandbox = createSandbox();
  const sut: DataverseInfoRepository = new DataverseInfoRepository();

  ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.API_KEY, TestConstants.TEST_DUMMY_API_KEY);

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

    assert.calledWithExactly(
      axiosGetStub,
      `${TestConstants.TEST_API_URL}/info/version`,
      TestConstants.TEST_EXPECTED_UNAUTHENTICATED_REQUEST_CONFIG,
    );
    assert.match(actual.number, testVersionNumber);
    assert.match(actual.build, testVersionBuild);
  });

  test('should return error result on error response', async () => {
    const axiosGetStub = sandbox.stub(axios, 'get').rejects(TestConstants.TEST_ERROR_RESPONSE);

    let error: ReadError = undefined;
    await sut.getDataverseVersion().catch((e) => (error = e));

    assert.calledWithExactly(
      axiosGetStub,
      `${TestConstants.TEST_API_URL}/info/version`,
      TestConstants.TEST_EXPECTED_UNAUTHENTICATED_REQUEST_CONFIG,
    );
    expect(error).to.be.instanceOf(Error);
  });
});
