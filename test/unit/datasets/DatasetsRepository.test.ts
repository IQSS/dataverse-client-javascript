import { DatasetsRepository } from '../../../src/datasets/infra/repositories/DatasetsRepository';
import { assert, createSandbox, SinonSandbox } from 'sinon';
import axios from 'axios';
import { expect } from 'chai';
import { ReadError } from '../../../src/core/domain/repositories/ReadError';
import { ApiConfig } from '../../../src/core/infra/repositories/ApiConfig';
import { createDatasetModel, createDatasetVersionPayload } from '../../testHelpers/datasets/datasetHelper';
import { MissingParameterError } from '../../../src/core/domain/repositories/MissingParameterError';

describe('DatasetsRepository', () => {
  const sandbox: SinonSandbox = createSandbox();
  const sut: DatasetsRepository = new DatasetsRepository();
  const testVersionSuccessfulResponse = {
    status: 'OK',
    data: createDatasetVersionPayload(),
  };
  const testDatasetModel = createDatasetModel();
  const testApiUrl = 'https://test.dataverse.org/api/v1';

  ApiConfig.init(testApiUrl);

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

      assert.calledWithExactly(axiosGetStub, `${testApiUrl}/datasets/summaryFieldNames`, { withCredentials: false });
      assert.match(actual, testFieldNames);
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
      await sut.getDatasetSummaryFieldNames().catch((e) => (error = e));

      assert.calledWithExactly(axiosGetStub, `${testApiUrl}/datasets/summaryFieldNames`, { withCredentials: false });
      expect(error).to.be.instanceOf(Error);
    });
  });

  describe('getDataset', () => {
    const testLatestVersionSuccessfulResponse = {
      status: 'OK',
      data: {
        latestVersion: createDatasetVersionPayload(),
      },
    };

    test('should return Dataset when providing id, no version, and response is successful', async () => {
      const axiosGetStub = sandbox.stub(axios, 'get').resolves(testLatestVersionSuccessfulResponse);

      const actual = await sut.getDataset(testDatasetModel.id, null, null);

      assert.calledWithExactly(axiosGetStub, `${testApiUrl}/datasets/${testDatasetModel.id}`, {
        withCredentials: true,
      });
      assert.match(actual, testDatasetModel);
    });

    test('should return Dataset when providing id, version, and response is successful', async () => {
      const axiosGetStub = sandbox.stub(axios, 'get').resolves(testVersionSuccessfulResponse);

      const actual = await sut.getDataset(testDatasetModel.id, null, testDatasetModel.versionId);

      assert.calledWithExactly(
        axiosGetStub,
        `${testApiUrl}/datasets/${testDatasetModel.id}/versions/${testDatasetModel.versionId}`,
        {
          withCredentials: true,
        },
      );
      assert.match(actual, testDatasetModel);
    });

    test('should return Dataset when providing persistent id, no version, and response is successful', async () => {
      const axiosGetStub = sandbox.stub(axios, 'get').resolves(testLatestVersionSuccessfulResponse);

      const actual = await sut.getDataset(null, testDatasetModel.persistentId, null);

      assert.calledWithExactly(
        axiosGetStub,
        `${testApiUrl}/datasets/:persistentId?persistentId=${testDatasetModel.persistentId}`,
        {
          withCredentials: true,
        },
      );
      assert.match(actual, testDatasetModel);
    });

    test('should return Dataset when providing id, version, and response is successful', async () => {
      const axiosGetStub = sandbox.stub(axios, 'get').resolves(testVersionSuccessfulResponse);

      const actual = await sut.getDataset(null, testDatasetModel.persistentId, testDatasetModel.versionId);

      assert.calledWithExactly(
        axiosGetStub,
        `${testApiUrl}/datasets/:persistentId/versions/${testDatasetModel.versionId}?persistentId=${testDatasetModel.persistentId}`,
        {
          withCredentials: true,
        },
      );
      assert.match(actual, testDatasetModel);
    });

    test('should return error on repository read error', async () => {
      const testErrorResponse = {
        response: {
          status: 'ERROR',
          message: 'test',
        },
      };
      const axiosGetStub = sandbox.stub(axios, 'get').rejects(testErrorResponse);

      let error: ReadError = undefined;
      await sut.getDataset(testDatasetModel.id, null, null).catch((e) => (error = e));

      assert.calledWithExactly(axiosGetStub, `${testApiUrl}/datasets/${testDatasetModel.id}`, {
        withCredentials: true,
      });
      expect(error).to.be.instanceOf(Error);
    });

    test('should return error when parameters are missing', async () => {
      let error: MissingParameterError = undefined;
      await sut.getDataset(null, null, null).catch((e) => (error = e));
      expect(error).to.be.instanceOf(Error);
    });
  });

  describe('getPrivateUrlDataset', () => {
    const testToken = 'testToken';

    test('should return Dataset when providing anonymized field value and response is successful', async () => {
      const axiosGetStub = sandbox.stub(axios, 'get').resolves(testVersionSuccessfulResponse);

      const testAnonymizedFieldValue = 'testValue';
      const actual = await sut.getPrivateUrlDataset(testToken, 'testValue');

      assert.calledWithExactly(
        axiosGetStub,
        `${testApiUrl}/datasets/privateUrlDatasetVersion/${testToken}?anonymizedFieldValue=${testAnonymizedFieldValue}`,
        {
          withCredentials: false,
        },
      );
      assert.match(actual, testDatasetModel);
    });

    test('should return Dataset when not providing anonymized field value and response is successful', async () => {
      const axiosGetStub = sandbox.stub(axios, 'get').resolves(testVersionSuccessfulResponse);

      const actual = await sut.getPrivateUrlDataset(testToken, null);

      assert.calledWithExactly(axiosGetStub, `${testApiUrl}/datasets/privateUrlDatasetVersion/${testToken}`, {
        withCredentials: false,
      });
      assert.match(actual, testDatasetModel);
    });

    test('should return error on repository read error', async () => {
      const testErrorResponse = {
        response: {
          status: 'ERROR',
          message: 'test',
        },
      };
      const axiosGetStub = sandbox.stub(axios, 'get').rejects(testErrorResponse);

      let error: ReadError = undefined;
      await sut.getPrivateUrlDataset(testToken, null).catch((e) => (error = e));

      assert.calledWithExactly(axiosGetStub, `${testApiUrl}/datasets/privateUrlDatasetVersion/${testToken}`, {
        withCredentials: false,
      });
      expect(error).to.be.instanceOf(Error);
    });
  });
});
