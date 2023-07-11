import { FilesRepository } from '../../../src/files/infra/repositories/FilesRepository';
import { assert, createSandbox, SinonSandbox } from 'sinon';
import axios from 'axios';
import { expect } from 'chai';
import { ReadError } from '../../../src/core/domain/repositories/ReadError';
import { ApiConfig, DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig';
import { TestConstants } from '../../testHelpers/TestConstants';
import { FileOrderCriteria } from '../../../src/files/domain/models/FileOrderCriteria';

describe('FilesRepository', () => {
  const sandbox: SinonSandbox = createSandbox();
  const sut: FilesRepository = new FilesRepository();
  // TODO: Add actual file payload
  const testFilesSuccessfulResponse = {
    data: {
      status: 'OK',
      data: [{}],
    },
  };
  const testDatasetId = 1;

  beforeEach(() => {
    ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.API_KEY, TestConstants.TEST_DUMMY_API_KEY);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getFilesByDatasetId', () => {
    test('should return files on successful response', async () => {
      const axiosGetStub = sandbox.stub(axios, 'get').resolves(testFilesSuccessfulResponse);

      const actual = await sut.getFilesByDatasetId(testDatasetId);

      assert.calledWithExactly(
        axiosGetStub,
        `${TestConstants.TEST_API_URL}/datasets/${testDatasetId}/versions/:latest/files`,
        TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY,
      );
      assert.match(actual, []);
    });

    test('should return files when providing id, optional params, and response is successful', async () => {
      const axiosGetStub = sandbox.stub(axios, 'get').resolves(testFilesSuccessfulResponse);

      const testVersionId = ':draft';
      const testLimit = 10;
      const testOffset = 20;
      const testFileOrderCriteria = FileOrderCriteria.NEWEST;
      
      const actual = await sut.getFilesByDatasetId(
        testDatasetId,
        testVersionId,
        testLimit,
        testOffset,
        testFileOrderCriteria,
      );

      const expectedRequestConfig = {
        params: {
          limit: testLimit,
          offset: testOffset,
          orderCriteria: testFileOrderCriteria.toString(),
        },
        headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY.headers,
      };

      assert.calledWithExactly(
        axiosGetStub,
        `${TestConstants.TEST_API_URL}/datasets/${testDatasetId}/versions/${testVersionId}/files`,
        expectedRequestConfig,
      );
      assert.match(actual, []);
    });

    test('should return error result on error response', async () => {
      const axiosGetStub = sandbox.stub(axios, 'get').rejects(TestConstants.TEST_ERROR_RESPONSE);

      let error: ReadError = undefined;
      await sut.getFilesByDatasetId(testDatasetId).catch((e) => (error = e));

      assert.calledWithExactly(
        axiosGetStub,
        `${TestConstants.TEST_API_URL}/datasets/${testDatasetId}/versions/:latest/files`,
        TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY,
      );
      expect(error).to.be.instanceOf(Error);
    });
  });
});
