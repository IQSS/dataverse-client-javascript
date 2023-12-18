import { GetCollectionDatasetPreviews } from '../../../src/datasets/domain/useCases/GetCollectionDatasetPreviews';
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
    const getCollectionDatasetPreviewsStub = sandbox.stub().returns(testDatasetPreviews);
    datasetsRepositoryStub.getCollectionDatasetPreviews = getCollectionDatasetPreviewsStub;
    const sut = new GetCollectionDatasetPreviews(datasetsRepositoryStub);

    const actual = await sut.execute(1);

    assert.match(actual, testDatasetPreviews);
    assert.calledWithExactly(getCollectionDatasetPreviewsStub, 1, undefined, undefined);
  });

  test('should return error result on repository error', async () => {
    const datasetsRepositoryStub = <IDatasetsRepository>{};
    const testReadError = new ReadError();
    datasetsRepositoryStub.getCollectionDatasetPreviews = sandbox.stub().throwsException(testReadError);
    const sut = new GetCollectionDatasetPreviews(datasetsRepositoryStub);

    let actualError: ReadError = undefined;
    await sut.execute(1).catch((e: ReadError) => (actualError = e));

    assert.match(actualError, testReadError);
  });
});
