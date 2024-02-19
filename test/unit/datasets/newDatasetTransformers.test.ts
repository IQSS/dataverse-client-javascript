import { assert } from 'sinon';
import {
  createNewDatasetMetadataBlockModel,
  createNewDatasetDTO,
  createNewDatasetRequestPayload,
} from '../../testHelpers/datasets/newDatasetHelper';
import { transformNewDatasetModelToRequestPayload } from '../../../src/datasets/infra/repositories/transformers/newDatasetTransformers';

describe('transformNewDatasetModelToRequestPayload', () => {
  test('should correctly transform a new dataset model to a new dataset request payload', async () => {
    const testNewDataset = createNewDatasetDTO();
    const testMetadataBlocks = [createNewDatasetMetadataBlockModel()];
    const expectedNewDatasetRequestPayload = createNewDatasetRequestPayload();
    const actual = transformNewDatasetModelToRequestPayload(testNewDataset, testMetadataBlocks);
    assert.match(actual, expectedNewDatasetRequestPayload);
  });
});