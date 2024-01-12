import { NewDatasetValidator } from '../../../src/datasets/domain/useCases/validators/NewDatasetValidator';
import { createSandbox, SinonSandbox } from 'sinon';
import { createNewDatasetModel, createNewDatasetMetadataBlockModel } from '../../testHelpers/datasets/newDatasetHelper';
import { fail } from 'assert';
import { IMetadataBlocksRepository } from '../../../src/metadataBlocks/domain/repositories/IMetadataBlocksRepository';

describe('execute', () => {
  const sandbox: SinonSandbox = createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  test('should not raise exception when new dataset is valid', async () => {
    const testNewDataset = createNewDatasetModel();
    const testMetadataBlock = createNewDatasetMetadataBlockModel();
    const metadataBlocksRepositoryStub = <IMetadataBlocksRepository>{};
    const getMetadataBlockByNameStub = sandbox.stub().resolves(testMetadataBlock);
    metadataBlocksRepositoryStub.getMetadataBlockByName = getMetadataBlockByNameStub;
    const sut = new NewDatasetValidator(metadataBlocksRepositoryStub);

    await sut.validate(testNewDataset).catch((e) => fail(e));
  });
});
