import { DatasetsRepository } from '../../../src/datasets/infra/repositories/DatasetsRepository';
import { assert, createSandbox, SinonSandbox } from 'sinon';
import axios from 'axios';
import { expect } from 'chai';
import { ReadError } from '../../../src/core/domain/repositories/ReadError';
import { ApiConfig } from '../../../src/core/infra/repositories/ApiConfig';
import { createDatasetModel, createDatasetVersionPayload } from '../../testHelpers/datasets/datasetHelper';

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
  const testErrorResponse = {
    response: {
      status: 'ERROR',
      message: 'test',
    },
  };
  const testPrivateUrlToken = 'testToken';
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

  describe('getDatasetById', () => {
    test('should return Dataset when providing id, no version, and response is successful', async () => {
      const axiosGetStub = sandbox.stub(axios, 'get').resolves(testDatasetVersionSuccessfulResponse);

      const actual = await sut.getDatasetById(testDatasetModel.id);

      assert.calledWithExactly(axiosGetStub, `${testApiUrl}/datasets/${testDatasetModel.id}/versions/:latest`, {
        withCredentials: true,
      });
      assert.match(actual, testDatasetModel);
    });

    test('should return Dataset when providing id, version, and response is successful', async () => {
      const axiosGetStub = sandbox.stub(axios, 'get').resolves(testDatasetVersionSuccessfulResponse);

      const actual = await sut.getDatasetById(testDatasetModel.id, String(testDatasetModel.versionId));

      assert.calledWithExactly(
        axiosGetStub,
        `${testApiUrl}/datasets/${testDatasetModel.id}/versions/${testDatasetModel.versionId}`,
        {
          withCredentials: true,
        },
      );
      assert.match(actual, testDatasetModel);
    });

    test('should return error on repository read error', async () => {
      const axiosGetStub = sandbox.stub(axios, 'get').rejects(testErrorResponse);

      let error: ReadError = undefined;
      await sut.getDatasetById(testDatasetModel.id).catch((e) => (error = e));

      assert.calledWithExactly(axiosGetStub, `${testApiUrl}/datasets/${testDatasetModel.id}/versions/:latest`, {
        withCredentials: true,
      });
      expect(error).to.be.instanceOf(Error);
    });
  });

  describe('getDatasetByPersistentId', () => {
    test('should return Dataset when providing persistent id, no version, and response is successful', async () => {
      const axiosGetStub = sandbox.stub(axios, 'get').resolves(testDatasetVersionSuccessfulResponse);

      const actual = await sut.getDatasetByPersistentId(testDatasetModel.persistentId);

      assert.calledWithExactly(
        axiosGetStub,
        `${testApiUrl}/datasets/:persistentId/versions/:latest?persistentId=${testDatasetModel.persistentId}`,
        {
          withCredentials: true,
        },
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
        `${testApiUrl}/datasets/:persistentId/versions/${testDatasetModel.versionId}?persistentId=${testDatasetModel.persistentId}`,
        {
          withCredentials: true,
        },
      );
      assert.match(actual, testDatasetModel);
    });

    test('should return error on repository read error', async () => {
      const axiosGetStub = sandbox.stub(axios, 'get').rejects(testErrorResponse);

      let error: ReadError = undefined;
      await sut.getDatasetByPersistentId(testDatasetModel.persistentId).catch((e) => (error = e));

      assert.calledWithExactly(
        axiosGetStub,
        `${testApiUrl}/datasets/:persistentId/versions/:latest?persistentId=${testDatasetModel.persistentId}`,
        {
          withCredentials: true,
        },
      );
      expect(error).to.be.instanceOf(Error);
    });
  });

  describe('getPrivateUrlDataset', () => {
    test('should return Dataset when response is successful', async () => {
      const axiosGetStub = sandbox.stub(axios, 'get').resolves(testDatasetVersionSuccessfulResponse);

      const actual = await sut.getPrivateUrlDataset(testPrivateUrlToken);

      assert.calledWithExactly(axiosGetStub, `${testApiUrl}/datasets/privateUrlDatasetVersion/${testPrivateUrlToken}`, {
        withCredentials: false,
      });
      assert.match(actual, testDatasetModel);
    });

    test('should return error on repository read error', async () => {
      const axiosGetStub = sandbox.stub(axios, 'get').rejects(testErrorResponse);

      let error: ReadError = undefined;
      await sut.getPrivateUrlDataset(testPrivateUrlToken).catch((e) => (error = e));

      assert.calledWithExactly(axiosGetStub, `${testApiUrl}/datasets/privateUrlDatasetVersion/${testPrivateUrlToken}`, {
        withCredentials: false,
      });
      expect(error).to.be.instanceOf(Error);
    });
  });

  describe('getDatasetCitation', () => {
    test('should return citation when response is successful', async () => {
      const axiosGetStub = sandbox.stub(axios, 'get').resolves(testCitationSuccessfulResponse);

      const actual = await sut.getDatasetCitation(testDatasetModel.id, undefined);

      assert.calledWithExactly(
        axiosGetStub,
        `${testApiUrl}/datasets/${testDatasetModel.id}/versions/:latest/citation`,
        {
          withCredentials: true,
        },
      );
      assert.match(actual, testCitation);
    });

    test('should return error on repository read error', async () => {
      const axiosGetStub = sandbox.stub(axios, 'get').rejects(testErrorResponse);

      let error: ReadError = undefined;
      await sut.getDatasetCitation(1, undefined).catch((e) => (error = e));

      assert.calledWithExactly(
        axiosGetStub,
        `${testApiUrl}/datasets/${testDatasetModel.id}/versions/:latest/citation`,
        {
          withCredentials: true,
        },
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
        `${testApiUrl}/datasets/privateUrlDatasetVersion/${testPrivateUrlToken}/citation`,
        {
          withCredentials: false,
        },
      );
      assert.match(actual, testCitation);
    });

    test('should return error on repository read error', async () => {
      const axiosGetStub = sandbox.stub(axios, 'get').rejects(testErrorResponse);

      let error: ReadError = undefined;
      await sut.getPrivateUrlDatasetCitation(testPrivateUrlToken).catch((e) => (error = e));

      assert.calledWithExactly(
        axiosGetStub,
        `${testApiUrl}/datasets/privateUrlDatasetVersion/${testPrivateUrlToken}/citation`,
        {
          withCredentials: false,
        },
      );
      expect(error).to.be.instanceOf(Error);
    });
  });
});
