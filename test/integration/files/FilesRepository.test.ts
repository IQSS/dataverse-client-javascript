import { FilesRepository } from '../../../src/files/infra/repositories/FilesRepository';
import { ApiConfig, DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig';
import { assert } from 'sinon';
import { TestConstants } from '../../testHelpers/TestConstants';
import { createDatasetViaApi } from '../../testHelpers/datasets/datasetHelper';
import { uploadFileViaApi } from '../../testHelpers/files/filesHelper';

describe('getDataverseVersion', () => {
  const sut: FilesRepository = new FilesRepository();

  beforeAll(async () => {
    ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.API_KEY, process.env.TEST_API_KEY);
    await createDatasetViaApi()
      .then()
      .catch(() => {
        fail('Tesgooglts beforeAll(): Error while creating test Dataset');
      });
    await uploadFileViaApi(TestConstants.TEST_CREATED_DATASET_ID, 'test-file-1.txt')
      .then()
      .catch((e) => {
        console.log(e);
        fail('Tests beforeAll(): Error while creating test file');
      });
  });

  test('should return files when exist filtering by dataset id', async () => {
    const actual = await sut.getFilesByDatasetId(TestConstants.TEST_CREATED_DATASET_ID);
    assert.match(actual, []);
  });
});
