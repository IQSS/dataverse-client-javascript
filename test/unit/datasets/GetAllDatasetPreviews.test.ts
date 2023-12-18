import { GetAllDatasetPreviews } from '../../../src/datasets/domain/useCases/GetAllDatasetPreviews';
import { assert, createSandbox, SinonSandbox } from 'sinon';
import { ReadError } from '../../../src/core/domain/repositories/ReadError';
import { DatasetPreview } from '../../../src/datasets/domain/models/DatasetPreview';
import { createDatasetPreviewModel } from '../../testHelpers/datasets/datasetPreviewHelper';
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository';

describe('execute', () => {
  const sandbox: SinonSandbox = createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  test('should return dataset previews on repository success', async () => {
    const testDatasetPreviews: DatasetPreview[] = [createDatasetPreviewModel()];
    const datasetsRepositoryStub = <IDatasetsRepository>{};
    const getAllDatasetPreviewsStub = sandbox.stub().returns(testDatasetPreviews);
    datasetsRepositoryStub.getAllDatasetPreviews = getAllDatasetPreviewsStub;
    const sut = new GetAllDatasetPreviews(datasetsRepositoryStub);

    const actual = await sut.execute();

    assert.match(actual, testDatasetPreviews);
    assert.calledWithExactly(getAllDatasetPreviewsStub, undefined, undefined);
  });

  test('should return error result on repository error', async () => {
    const datasetsRepositoryStub = <IDatasetsRepository>{};
    const testReadError = new ReadError();
    datasetsRepositoryStub.getAllDatasetPreviews = sandbox.stub().throwsException(testReadError);
    const sut = new GetAllDatasetPreviews(datasetsRepositoryStub);

    let actualError: ReadError = undefined;
    await sut.execute().catch((e: ReadError) => (actualError = e));

    assert.match(actualError, testReadError);
  });
});
