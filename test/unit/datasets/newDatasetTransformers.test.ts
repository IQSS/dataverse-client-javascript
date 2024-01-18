import { createSandbox, SinonSandbox } from 'sinon';
import { createNewDatasetMetadataBlockModel, createNewDatasetModel } from '../../testHelpers/datasets/newDatasetHelper';
import { transformNewDatasetModelToRequestPayload } from '../../../src/datasets/infra/repositories/transformers/newDatasetTransformers';

describe('transformNewDatasetModelToRequestPayload', () => {
  const sandbox: SinonSandbox = createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  test('should not raise a validation error when a new dataset with only the required fields is valid', async () => {
    const testNewDataset = createNewDatasetModel();
    const testMetadataBlocks = [createNewDatasetMetadataBlockModel()];

    const actual = transformNewDatasetModelToRequestPayload(testNewDataset, testMetadataBlocks);
    console.log(actual);
  });
});
