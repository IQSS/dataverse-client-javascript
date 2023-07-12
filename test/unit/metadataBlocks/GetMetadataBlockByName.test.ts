import { GetMetadataBlockByName } from '../../../src/metadataBlocks/domain/useCases/GetMetadataBlockByName';
import { IMetadataBlocksRepository } from '../../../src/metadataBlocks/domain/repositories/IMetadataBlocksRepository';
import { ReadError } from '../../../src/core/domain/repositories/ReadError';
import { assert, createSandbox, SinonSandbox } from 'sinon';
import { createMetadataBlockModel } from '../../testHelpers/metadataBlocks/metadataBlockHelper';

describe('execute', () => {
  const sandbox: SinonSandbox = createSandbox();
  const testMetadataBlockName = 'test';

  afterEach(() => {
    sandbox.restore();
  });

  test('should return metadata block on repository success', async () => {
    const testMetadataBlock = createMetadataBlockModel();
    const metadataBlocksRepositoryStub = <IMetadataBlocksRepository>{};
    const getMetadataBlockByNameStub = sandbox.stub().returns(testMetadataBlock);
    metadataBlocksRepositoryStub.getMetadataBlockByName = getMetadataBlockByNameStub;
    const sut = new GetMetadataBlockByName(metadataBlocksRepositoryStub);

    const actual = await sut.execute(testMetadataBlockName);

    assert.match(actual, testMetadataBlock);
    assert.calledWithExactly(getMetadataBlockByNameStub, testMetadataBlockName);
  });

  test('should return error result on repository error', async () => {
    const metadataBlocksRepositoryStub = <IMetadataBlocksRepository>{};
    const testReadError = new ReadError();
    metadataBlocksRepositoryStub.getMetadataBlockByName = sandbox.stub().throwsException(testReadError);
    const sut = new GetMetadataBlockByName(metadataBlocksRepositoryStub);

    let actualError: ReadError = undefined;
    await sut.execute(testMetadataBlockName).catch((e) => (actualError = e));

    assert.match(actualError, testReadError);
  });
});
