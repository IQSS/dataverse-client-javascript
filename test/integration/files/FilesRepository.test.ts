import { FilesRepository } from '../../../src/files/infra/repositories/FilesRepository';
import { ApiConfig, DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig';
import { assert } from 'sinon';
import { TestConstants } from '../../testHelpers/TestConstants';
import { createDatasetViaApi } from '../../testHelpers/datasets/datasetHelper';
import { uploadFileViaApi } from '../../testHelpers/files/filesHelper';
import { FileOrderCriteria } from '../../../src/files/domain/models/FileOrderCriteria';
import { DatasetsRepository } from '../../../src/datasets/infra/repositories/DatasetsRepository';
import { ReadError } from '../../../src/core/domain/repositories/ReadError';

describe('FilesRepository', () => {
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

  describe('getDatasetFiles', () => {
    describe('by numeric id', () => {
      test('should return all files filtering by dataset id', async () => {
        const actual = await sut.getDatasetFiles(TestConstants.TEST_CREATED_DATASET_ID);
        assert.match(actual.length, 3);
        assert.match(actual[0].name, testFile1Name);
        assert.match(actual[1].name, testFile2Name);
        assert.match(actual[2].name, testFile3Name);
      });

      test('should return correct files filtering by dataset id and paginating', async () => {
        const actual = await sut.getDatasetFiles(TestConstants.TEST_CREATED_DATASET_ID, undefined, 2, 2, undefined);
        assert.match(actual.length, 1);
        assert.match(actual[0].name, testFile3Name);
      });

      test('should return correct files filtering by dataset id and applying order criteria', async () => {
        let actual = await sut.getDatasetFiles(
          TestConstants.TEST_CREATED_DATASET_ID,
          undefined,
          undefined,
          undefined,
          FileOrderCriteria.NEWEST,
        );
        assert.match(actual.length, 3);
        assert.match(actual[0].name, testFile3Name);
        assert.match(actual[1].name, testFile2Name);
        assert.match(actual[2].name, testFile1Name);
      });

      test('should return error when dataset does not exist', async () => {
        let error: ReadError = undefined;

        const nonExistentTestDatasetId = 100;
        await sut.getDatasetFiles(nonExistentTestDatasetId).catch((e) => (error = e));

        assert.match(
          error.message,
          `There was an error when reading the resource. Reason was: [404] Dataset with ID ${nonExistentTestDatasetId} not found.`,
        );
      });
    });

    describe('by persistent id', () => {
      const datasetRepository = new DatasetsRepository();

      test('should return all files filtering by persistent id', async () => {
        const testDataset = await datasetRepository.getDatasetById(TestConstants.TEST_CREATED_DATASET_ID);
        const actual = await sut.getDatasetFiles(testDataset.persistentId);
        assert.match(actual.length, 3);
        assert.match(actual[0].name, testFile1Name);
        assert.match(actual[1].name, testFile2Name);
        assert.match(actual[2].name, testFile3Name);
      });

      test('should return correct files filtering by persistent id and paginating', async () => {
        const testDataset = await datasetRepository.getDatasetById(TestConstants.TEST_CREATED_DATASET_ID);
        const actual = await sut.getDatasetFiles(testDataset.persistentId, undefined, 2, 2, undefined);
        assert.match(actual.length, 1);
        assert.match(actual[0].name, testFile3Name);
      });

      test('should return correct files filtering by persistent id and applying order criteria', async () => {
        const testDataset = await datasetRepository.getDatasetById(TestConstants.TEST_CREATED_DATASET_ID);
        let actual = await sut.getDatasetFiles(
          testDataset.persistentId,
          undefined,
          undefined,
          undefined,
          FileOrderCriteria.NEWEST,
        );
        assert.match(actual.length, 3);
        assert.match(actual[0].name, testFile3Name);
        assert.match(actual[1].name, testFile2Name);
        assert.match(actual[2].name, testFile1Name);
      });

      test('should return error when dataset does not exist', async () => {
        let error: ReadError = undefined;

        const testWrongPersistentId = 'wrongPersistentId';
        await sut.getDatasetFiles(testWrongPersistentId).catch((e) => (error = e));

        assert.match(
          error.message,
          `There was an error when reading the resource. Reason was: [404] Dataset with Persistent ID ${testWrongPersistentId} not found.`,
        );
      });
    });
  });

  describe('getFileGuestbookResponsesCount', () => {
    test('should return count filtering by file id', async () => {
      const currentTestFiles = await sut.getDatasetFiles(TestConstants.TEST_CREATED_DATASET_ID);
      const testFile = currentTestFiles[0];
      const actual = await sut.getFileGuestbookResponsesCount(testFile.id);
      assert.match(actual, 0);
    });

    test('should return error when file does not exist', async () => {
      let error: ReadError = undefined;

      const nonExistentFiledId = 200;
      await sut.getFileGuestbookResponsesCount(nonExistentFiledId).catch((e) => (error = e));

      assert.match(
        error.message,
        `There was an error when reading the resource. Reason was: [404] File with ID ${nonExistentFiledId} not found.`,
      );
    });
  });
});
