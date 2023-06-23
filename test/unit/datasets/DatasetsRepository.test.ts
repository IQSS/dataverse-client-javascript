import { DatasetsRepository } from '../../../src/datasets/infra/repositories/DatasetsRepository';
import { assert, createSandbox, SinonSandbox } from 'sinon';
import axios from 'axios';
import { expect } from 'chai';
import { ReadError } from '../../../src/core/domain/repositories/ReadError';
import { ApiConfig, DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig';
import {
  createDatasetModel,
  createDatasetVersionPayload,
  createDatasetLicenseModel,
} from '../../testHelpers/datasets/datasetHelper';
import { TestConstants } from '../../testHelpers/TestConstants';

describe('DatasetsRepository', () => {
  const sandbox: SinonSandbox = createSandbox();
  const sut: DatasetsRepository = new DatasetsRepository();
  const testDatasetVersionSuccessfulResponse = {
    data: {
      status: 'OK',
      data: createDatasetVersionPayload(),
    },
  };
  const testCitation = 'test citation';
  const testCitationSuccessfulResponse = {
    data: {
      status: 'OK',
      data: {
        message: testCitation,
      },
    },
  };
  const testPrivateUrlToken = 'testToken';
  const testDatasetModel = createDatasetModel();

  ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.API_KEY, TestConstants.TEST_DUMMY_API_KEY);

  afterEach(() => {
    sandbox.restore();
  });

  describe('getDatasetSummaryFieldNames', () => {
    test('should return fields on successful response', async () => {
      const testFieldNames = ['test1', 'test2'];
      const testSuccessfulResponse = {
        data: {
          status: 'OK',
          data: testFieldNames,
        },
      };
      const axiosGetStub = sandbox.stub(axios, 'get').resolves(testSuccessfulResponse);

      const actual = await sut.getDatasetSummaryFieldNames();

      assert.calledWithExactly(
        axiosGetStub,
        `${TestConstants.TEST_API_URL}/datasets/summaryFieldNames`,
        TestConstants.TEST_EXPECTED_SUCCESSFUL_UNAUTHENTICATED_REQUEST_CONFIG,
      );
      assert.match(actual, testFieldNames);
    });

    test('should return error result on error response', async () => {
      const axiosGetStub = sandbox.stub(axios, 'get').rejects(TestConstants.TEST_ERROR_RESPONSE);

      let error: ReadError = undefined;
      await sut.getDatasetSummaryFieldNames().catch((e) => (error = e));

      assert.calledWithExactly(
        axiosGetStub,
        `${TestConstants.TEST_API_URL}/datasets/summaryFieldNames`,
        TestConstants.TEST_EXPECTED_SUCCESSFUL_UNAUTHENTICATED_REQUEST_CONFIG,
      );
      expect(error).to.be.instanceOf(Error);
    });
  });

  describe('getDatasetById', () => {
    test('should return Dataset when providing id, no version, and response is successful', async () => {
      const axiosGetStub = sandbox.stub(axios, 'get').resolves(testDatasetVersionSuccessfulResponse);

      const actual = await sut.getDatasetById(testDatasetModel.id);

      assert.calledWithExactly(
        axiosGetStub,
        `${TestConstants.TEST_API_URL}/datasets/${testDatasetModel.id}/versions/:latest`,
        TestConstants.TEST_EXPECTED_SUCCESSFUL_AUTHENTICATED_REQUEST_CONFIG,
      );
      assert.match(actual, testDatasetModel);
    });

    test('should return Dataset when providing id, version, and response is successful', async () => {
      const axiosGetStub = sandbox.stub(axios, 'get').resolves(testDatasetVersionSuccessfulResponse);

      const actual = await sut.getDatasetById(testDatasetModel.id, String(testDatasetModel.versionId));

      assert.calledWithExactly(
        axiosGetStub,
        `${TestConstants.TEST_API_URL}/datasets/${testDatasetModel.id}/versions/${testDatasetModel.versionId}`,
        TestConstants.TEST_EXPECTED_SUCCESSFUL_AUTHENTICATED_REQUEST_CONFIG,
      );
      assert.match(actual, testDatasetModel);
    });

    test('should return Dataset when providing id, version, and response with license is successful', async () => {
      const testDatasetLicense = createDatasetLicenseModel();
      const testDatasetVersionWithLicenseSuccessfulResponse = {
        data: {
          status: 'OK',
          data: createDatasetVersionPayload(testDatasetLicense),
        },
      };
      const axiosGetStub = sandbox.stub(axios, 'get').resolves(testDatasetVersionWithLicenseSuccessfulResponse);

      const actual = await sut.getDatasetById(testDatasetModel.id, String(testDatasetModel.versionId));

      assert.calledWithExactly(
        axiosGetStub,
        `${TestConstants.TEST_API_URL}/datasets/${testDatasetModel.id}/versions/${testDatasetModel.versionId}`,
        TestConstants.TEST_EXPECTED_SUCCESSFUL_AUTHENTICATED_REQUEST_CONFIG,
      );
      assert.match(actual, createDatasetModel(testDatasetLicense));
    });

    test('should return Dataset when providing id, version, and response with license without icon URI is successful', async () => {
      const testDatasetLicenseWithoutIconUri = createDatasetLicenseModel(false);
      const testDatasetVersionWithLicenseSuccessfulResponse = {
        data: {
          status: 'OK',
          data: createDatasetVersionPayload(testDatasetLicenseWithoutIconUri),
        },
      };
      const axiosGetStub = sandbox.stub(axios, 'get').resolves(testDatasetVersionWithLicenseSuccessfulResponse);

      const actual = await sut.getDatasetById(testDatasetModel.id, String(testDatasetModel.versionId));

      assert.calledWithExactly(
        axiosGetStub,
        `${TestConstants.TEST_API_URL}/datasets/${testDatasetModel.id}/versions/${testDatasetModel.versionId}`,
        TestConstants.TEST_EXPECTED_SUCCESSFUL_AUTHENTICATED_REQUEST_CONFIG,
      );
      assert.match(actual, createDatasetModel(testDatasetLicenseWithoutIconUri));
    });

    test('should return error on repository read error', async () => {
      const axiosGetStub = sandbox.stub(axios, 'get').rejects(TestConstants.TEST_ERROR_RESPONSE);

      let error: ReadError = undefined;
      await sut.getDatasetById(testDatasetModel.id).catch((e) => (error = e));

      assert.calledWithExactly(
        axiosGetStub,
        `${TestConstants.TEST_API_URL}/datasets/${testDatasetModel.id}/versions/:latest`,
        TestConstants.TEST_EXPECTED_SUCCESSFUL_AUTHENTICATED_REQUEST_CONFIG,
      );
      expect(error).to.be.instanceOf(Error);
    });
  });

  describe('getDatasetByPersistentId', () => {
    test('should return Dataset when providing persistent id, no version, and response is successful', async () => {
      const axiosGetStub = sandbox.stub(axios, 'get').resolves(testDatasetVersionSuccessfulResponse);

      const actual = await sut.getDatasetByPersistentId(testDatasetModel.persistentId);

      assert.calledWithExactly(
        axiosGetStub,
        `${TestConstants.TEST_API_URL}/datasets/:persistentId/versions/:latest?persistentId=${testDatasetModel.persistentId}`,
        TestConstants.TEST_EXPECTED_SUCCESSFUL_AUTHENTICATED_REQUEST_CONFIG,
      );
      assert.match(actual, testDatasetModel);
    });

    test('should return Dataset when providing persistent id, version, and response is successful', async () => {
      const axiosGetStub = sandbox.stub(axios, 'get').resolves(testDatasetVersionSuccessfulResponse);

      const actual = await sut.getDatasetByPersistentId(
        testDatasetModel.persistentId,
        String(testDatasetModel.versionId),
      );

      assert.calledWithExactly(
        axiosGetStub,
        `${TestConstants.TEST_API_URL}/datasets/:persistentId/versions/${testDatasetModel.versionId}?persistentId=${testDatasetModel.persistentId}`,
        TestConstants.TEST_EXPECTED_SUCCESSFUL_AUTHENTICATED_REQUEST_CONFIG,
      );
      assert.match(actual, testDatasetModel);
    });

    test('should return error on repository read error', async () => {
      const axiosGetStub = sandbox.stub(axios, 'get').rejects(TestConstants.TEST_ERROR_RESPONSE);

      let error: ReadError = undefined;
      await sut.getDatasetByPersistentId(testDatasetModel.persistentId).catch((e) => (error = e));

      assert.calledWithExactly(
        axiosGetStub,
        `${TestConstants.TEST_API_URL}/datasets/:persistentId/versions/:latest?persistentId=${testDatasetModel.persistentId}`,
        TestConstants.TEST_EXPECTED_SUCCESSFUL_AUTHENTICATED_REQUEST_CONFIG,
      );
      expect(error).to.be.instanceOf(Error);
    });
  });

  describe('getPrivateUrlDataset', () => {
    test('should return Dataset when response is successful', async () => {
      const axiosGetStub = sandbox.stub(axios, 'get').resolves(testDatasetVersionSuccessfulResponse);

      const actual = await sut.getPrivateUrlDataset(testPrivateUrlToken);

      assert.calledWithExactly(
        axiosGetStub,
        `${TestConstants.TEST_API_URL}/datasets/privateUrlDatasetVersion/${testPrivateUrlToken}`,
        TestConstants.TEST_EXPECTED_SUCCESSFUL_UNAUTHENTICATED_REQUEST_CONFIG,
      );
      assert.match(actual, testDatasetModel);
    });

    test('should return error on repository read error', async () => {
      const axiosGetStub = sandbox.stub(axios, 'get').rejects(TestConstants.TEST_ERROR_RESPONSE);

      let error: ReadError = undefined;
      await sut.getPrivateUrlDataset(testPrivateUrlToken).catch((e) => (error = e));

      assert.calledWithExactly(
        axiosGetStub,
        `${TestConstants.TEST_API_URL}/datasets/privateUrlDatasetVersion/${testPrivateUrlToken}`,
        TestConstants.TEST_EXPECTED_SUCCESSFUL_UNAUTHENTICATED_REQUEST_CONFIG,
      );
      expect(error).to.be.instanceOf(Error);
    });
  });

  describe('getDatasetCitation', () => {
    test('should return citation when response is successful', async () => {
      const axiosGetStub = sandbox.stub(axios, 'get').resolves(testCitationSuccessfulResponse);

      const actual = await sut.getDatasetCitation(testDatasetModel.id, undefined);

      assert.calledWithExactly(
        axiosGetStub,
        `${TestConstants.TEST_API_URL}/datasets/${testDatasetModel.id}/versions/:latest/citation`,
        TestConstants.TEST_EXPECTED_SUCCESSFUL_AUTHENTICATED_REQUEST_CONFIG,
      );
      assert.match(actual, testCitation);
    });

    test('should return error on repository read error', async () => {
      const axiosGetStub = sandbox.stub(axios, 'get').rejects(TestConstants.TEST_ERROR_RESPONSE);

      let error: ReadError = undefined;
      await sut.getDatasetCitation(1, undefined).catch((e) => (error = e));

      assert.calledWithExactly(
        axiosGetStub,
        `${TestConstants.TEST_API_URL}/datasets/${testDatasetModel.id}/versions/:latest/citation`,
        TestConstants.TEST_EXPECTED_SUCCESSFUL_AUTHENTICATED_REQUEST_CONFIG,
      );
      expect(error).to.be.instanceOf(Error);
    });
  });

  describe('getPrivateUrlDatasetCitation', () => {
    test('should return citation when response is successful', async () => {
      const axiosGetStub = sandbox.stub(axios, 'get').resolves(testCitationSuccessfulResponse);

      const actual = await sut.getPrivateUrlDatasetCitation(testPrivateUrlToken);

      assert.calledWithExactly(
        axiosGetStub,
        `${TestConstants.TEST_API_URL}/datasets/privateUrlDatasetVersion/${testPrivateUrlToken}/citation`,
        TestConstants.TEST_EXPECTED_SUCCESSFUL_UNAUTHENTICATED_REQUEST_CONFIG,
      );
      assert.match(actual, testCitation);
    });

    test('should return error on repository read error', async () => {
      const axiosGetStub = sandbox.stub(axios, 'get').rejects(TestConstants.TEST_ERROR_RESPONSE);

      let error: ReadError = undefined;
      await sut.getPrivateUrlDatasetCitation(testPrivateUrlToken).catch((e) => (error = e));

      assert.calledWithExactly(
        axiosGetStub,
        `${TestConstants.TEST_API_URL}/datasets/privateUrlDatasetVersion/${testPrivateUrlToken}/citation`,
        TestConstants.TEST_EXPECTED_SUCCESSFUL_UNAUTHENTICATED_REQUEST_CONFIG,
      );
      expect(error).to.be.instanceOf(Error);
    });
  });
});
