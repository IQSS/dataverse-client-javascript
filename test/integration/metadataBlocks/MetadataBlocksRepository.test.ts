import { MetadataBlocksRepository } from '../../../src/metadataBlocks/infra/repositories/MetadataBlocksRepository';
import { ReadError } from '../../../src/core/domain/repositories/ReadError';
import { assert } from 'sinon';
import { ApiConfig, DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig';
import { TestConstants } from '../../testHelpers/TestConstants';

describe('getMetadataBlockByName', () => {
  const sut: MetadataBlocksRepository = new MetadataBlocksRepository();

  ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.API_KEY, process.env.TEST_API_KEY);

  test('should return error when metadata block does not exist', async () => {
    let error: ReadError = undefined;
    const nonExistentMetadataBlockName = 'nonExistentMetadataBlock';
    await sut.getMetadataBlockByName(nonExistentMetadataBlockName).catch((e) => (error = e));

    assert.match(
      error.message,
      `There was an error when reading the resource. Reason was: [404] Can't find metadata block '${nonExistentMetadataBlockName}'`,
    );
  });

  test('should return metadata block when it exists', async () => {
    const citationMetadataBlockName = 'citation';
    const actual = await sut.getMetadataBlockByName(citationMetadataBlockName);

    assert.match(actual.name, citationMetadataBlockName);
  });
});
