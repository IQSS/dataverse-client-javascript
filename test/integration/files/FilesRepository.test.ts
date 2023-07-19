import { FilesRepository } from '../../../src/files/infra/repositories/FilesRepository';
import { ApiConfig, DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig';
import { assert } from 'sinon';
import { TestConstants } from '../../testHelpers/TestConstants';
import { createDatasetViaApi } from '../../testHelpers/datasets/datasetHelper';
import { uploadFileViaApi } from '../../testHelpers/files/filesHelper';

describe('getDataverseVersion', () => {
  const sut: FilesRepository = new FilesRepository();

  const testFile1Name = 'test-file-1.txt';
  const testFile2Name = 'test-file-2.txt';
  const testFile3Name = 'test-file-3.txt';

  beforeAll(async () => {
    ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.API_KEY, process.env.TEST_API_KEY);
    await createDatasetViaApi()
      .then()
      .catch(() => {
        fail('Test beforeAll(): Error while creating test Dataset');
      });
    // Uploading test file 1
    await uploadFileViaApi(TestConstants.TEST_CREATED_DATASET_ID, testFile1Name)
      .then()
      .catch((e) => {
        console.log(e);
        fail(`Tests beforeAll(): Error while uploading file ${testFile1Name}`);
      });
    // Uploading test file 2
    await uploadFileViaApi(TestConstants.TEST_CREATED_DATASET_ID, testFile2Name)
      .then()
      .catch((e) => {
        console.log(e);
        fail(`Tests beforeAll(): Error while uploading file ${testFile2Name}`);
      });
    // Uploading test file 3
    await uploadFileViaApi(TestConstants.TEST_CREATED_DATASET_ID, testFile3Name)
      .then()
      .catch((e) => {
        console.log(e);
        fail(`Tests beforeAll(): Error while uploading file ${testFile3Name}`);
      });
  });

  test('should return files when exist filtering by dataset id', async () => {
    const actual = await sut.getFilesByDatasetId(TestConstants.TEST_CREATED_DATASET_ID);
    assert.match(actual, []);
  });
});
