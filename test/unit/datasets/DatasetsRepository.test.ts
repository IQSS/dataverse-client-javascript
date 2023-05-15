import { DatasetsRepository } from '../../../src/datasets/infra/repositories/DatasetsRepository';
import { assert, createSandbox, SinonSandbox } from 'sinon';
import axios from 'axios';
import { expect } from 'chai';
import { ReadError } from '../../../src/core/domain/repositories/ReadError';
import { ApiConfig } from '../../../src/core/infra/repositories/ApiConfig';

describe('getDatasetSummaryFieldNames', () => {
  const sandbox: SinonSandbox = createSandbox();
  const sut: DatasetsRepository = new DatasetsRepository();
  const testApiUrl = 'https://test.dataverse.org/api/v1';

  ApiConfig.init(testApiUrl);

  afterEach(() => {
    sandbox.restore();
  });

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
