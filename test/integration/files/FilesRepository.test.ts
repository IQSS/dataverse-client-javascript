import { FilesRepository } from '../../../src/files/infra/repositories/FilesRepository';
import { ApiConfig, DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig';
import { assert } from 'sinon';
import { expect } from 'chai';
import { TestConstants } from '../../testHelpers/TestConstants';
import { createDatasetViaApi } from '../../testHelpers/datasets/datasetHelper';
import { uploadFileViaApi, setFileCategoriesViaApi } from '../../testHelpers/files/filesHelper';
import { DatasetsRepository } from '../../../src/datasets/infra/repositories/DatasetsRepository';
import { ReadError } from '../../../src/core/domain/repositories/ReadError';
import { FileCriteria, FileAccessStatus, FileOrderCriteria } from '../../../src/files/domain/models/FileCriteria';
import { DatasetNotNumberedVersion } from '../../../src/datasets';
import { FileCounts } from '../../../src/files/domain/models/FileCounts';

describe('FilesRepository', () => {
  const sut: FilesRepository = new FilesRepository();

  const testTextFile1Name = 'test-file-1.txt';
  const testTextFile2Name = 'test-file-2.txt';
  const testTextFile3Name = 'test-file-3.txt';
  const testTabFile4Name = 'test-file-4.tab';
  const testCategoryName = 'testCategory';

  const nonExistentFiledId = 200;

  const latestDatasetVersionId = DatasetNotNumberedVersion.LATEST;

  const datasetRepository = new DatasetsRepository();

  beforeAll(async () => {
    ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.API_KEY, process.env.TEST_API_KEY);
    await createDatasetViaApi()
      .then()
      .catch(() => {
        fail('Test beforeAll(): Error while creating test Dataset');
      });
    // Uploading test file 1
    await uploadFileViaApi(TestConstants.TEST_CREATED_DATASET_ID, testTextFile1Name)
      .then()
      .catch((e) => {
        console.log(e);
        fail(`Tests beforeAll(): Error while uploading file ${testTextFile1Name}`);
      });
    // Uploading test file 2
    await uploadFileViaApi(TestConstants.TEST_CREATED_DATASET_ID, testTextFile2Name)
      .then()
      .catch((e) => {
        console.log(e);
        fail(`Tests beforeAll(): Error while uploading file ${testTextFile2Name}`);
      });
    // Uploading test file 3
    await uploadFileViaApi(TestConstants.TEST_CREATED_DATASET_ID, testTextFile3Name)
      .then()
      .catch((e) => {
        console.log(e);
        fail(`Tests beforeAll(): Error while uploading file ${testTextFile3Name}`);
      });
    // Uploading test file 4
    await uploadFileViaApi(TestConstants.TEST_CREATED_DATASET_ID, testTabFile4Name)
      .then()
      .catch((e) => {
        console.log(e);
        fail(`Tests beforeAll(): Error while uploading file ${testTabFile4Name}`);
      });
    // Categorize one of the uploaded test files
    const currentTestFiles = await sut.getDatasetFiles(TestConstants.TEST_CREATED_DATASET_ID, latestDatasetVersionId);
    const testFile = currentTestFiles[0];
    setFileCategoriesViaApi(testFile.id, [testCategoryName])
      .then()
      .catch((e) => {
        console.log(e);
        fail(`Tests beforeAll(): Error while setting file categories to ${testFile.name}`);
      });
  });

  describe('getDatasetFiles', () => {
    const testFileCriteria = new FileCriteria()
      .withOrderCriteria(FileOrderCriteria.NEWEST)
      .withContentType('text/plain')
      .withAccessStatus(FileAccessStatus.PUBLIC);

    describe('by numeric id', () => {
      test('should return all files filtering by dataset id and version id', async () => {
        const actual = await sut.getDatasetFiles(TestConstants.TEST_CREATED_DATASET_ID, latestDatasetVersionId);
        assert.match(actual.length, 4);
        assert.match(actual[0].name, testTextFile1Name);
        assert.match(actual[1].name, testTextFile2Name);
        assert.match(actual[2].name, testTextFile3Name);
        assert.match(actual[3].name, testTabFile4Name);
      });

      test('should return correct files filtering by dataset id, version id, and paginating', async () => {
        const actual = await sut.getDatasetFiles(
          TestConstants.TEST_CREATED_DATASET_ID,
          latestDatasetVersionId,
          3,
          3,
          undefined,
        );
        assert.match(actual.length, 1);
        assert.match(actual[0].name, testTabFile4Name);
      });

      test('should return correct files filtering by dataset id, version id, and applying file criteria', async () => {
        let actual = await sut.getDatasetFiles(
          TestConstants.TEST_CREATED_DATASET_ID,
          latestDatasetVersionId,
          undefined,
          undefined,
          testFileCriteria,
        );
        assert.match(actual.length, 3);
        assert.match(actual[0].name, testTextFile3Name);
        assert.match(actual[1].name, testTextFile2Name);
        assert.match(actual[2].name, testTextFile1Name);
      });

      test('should return error when dataset does not exist', async () => {
        let error: ReadError = undefined;

        const nonExistentTestDatasetId = 100;
        await sut.getDatasetFiles(nonExistentTestDatasetId, latestDatasetVersionId).catch((e) => (error = e));

        assert.match(
          error.message,
          `There was an error when reading the resource. Reason was: [404] Dataset with ID ${nonExistentTestDatasetId} not found.`,
        );
      });
    });

    describe('by persistent id', () => {
      test('should return all files filtering by persistent id and version id', async () => {
        const testDataset = await datasetRepository.getDataset(
          TestConstants.TEST_CREATED_DATASET_ID,
          latestDatasetVersionId,
        );
        const actual = await sut.getDatasetFiles(testDataset.persistentId, latestDatasetVersionId);
        assert.match(actual.length, 4);
        assert.match(actual[0].name, testTextFile1Name);
        assert.match(actual[1].name, testTextFile2Name);
        assert.match(actual[2].name, testTextFile3Name);
        assert.match(actual[3].name, testTabFile4Name);
      });

      test('should return correct files filtering by persistent id, version id, and paginating', async () => {
        const testDataset = await datasetRepository.getDataset(
          TestConstants.TEST_CREATED_DATASET_ID,
          latestDatasetVersionId,
        );
        const actual = await sut.getDatasetFiles(testDataset.persistentId, latestDatasetVersionId, 3, 3, undefined);
        assert.match(actual.length, 1);
        assert.match(actual[0].name, testTabFile4Name);
      });

      test('should return correct files filtering by persistent id, version id, and applying file criteria', async () => {
        const testDataset = await datasetRepository.getDataset(
          TestConstants.TEST_CREATED_DATASET_ID,
          latestDatasetVersionId,
        );
        let actual = await sut.getDatasetFiles(
          testDataset.persistentId,
          latestDatasetVersionId,
          undefined,
          undefined,
          testFileCriteria,
        );
        assert.match(actual.length, 3);
        assert.match(actual[0].name, testTextFile3Name);
        assert.match(actual[1].name, testTextFile2Name);
        assert.match(actual[2].name, testTextFile1Name);
      });

      test('should return error when dataset does not exist', async () => {
        let error: ReadError = undefined;

        const testWrongPersistentId = 'wrongPersistentId';
        await sut.getDatasetFiles(testWrongPersistentId, latestDatasetVersionId).catch((e) => (error = e));

        assert.match(
          error.message,
          `There was an error when reading the resource. Reason was: [404] Dataset with Persistent ID ${testWrongPersistentId} not found.`,
        );
      });
    });
  });

  describe('getDatasetFileCounts', () => {
    const expectedFileCounts: FileCounts = {
      total: 4,
      perContentType: [
        {
          contentType: 'text/plain',
          count: 3,
        },
        {
          contentType: 'text/tab-separated-values',
          count: 1,
        },
      ],
      perAccessStatus: [
        {
          accessStatus: FileAccessStatus.PUBLIC,
          count: 4,
        },
      ],
      perCategoryName: [
        {
          categoryName: testCategoryName,
          count: 1,
        },
      ],
    };

    test('should return file count filtering by numeric id', async () => {
      const actual = await sut.getDatasetFileCounts(TestConstants.TEST_CREATED_DATASET_ID, latestDatasetVersionId);
      assert.match(actual.total, expectedFileCounts.total);
      expect(actual.perContentType).to.have.deep.members(expectedFileCounts.perContentType);
      expect(actual.perAccessStatus).to.have.deep.members(expectedFileCounts.perAccessStatus);
      expect(actual.perCategoryName).to.have.deep.members(expectedFileCounts.perCategoryName);
    });

    test('should return file count filtering by persistent id', async () => {
      const testDataset = await datasetRepository.getDataset(
        TestConstants.TEST_CREATED_DATASET_ID,
        latestDatasetVersionId,
      );
      const actual = await sut.getDatasetFileCounts(testDataset.persistentId, latestDatasetVersionId);
      assert.match(actual.total, expectedFileCounts.total);
      expect(actual.perContentType).to.have.deep.members(expectedFileCounts.perContentType);
      expect(actual.perAccessStatus).to.have.deep.members(expectedFileCounts.perAccessStatus);
      expect(actual.perCategoryName).to.have.deep.members(expectedFileCounts.perCategoryName);
    });
  });

  describe('getFileDownloadCount', () => {
    test('should return count filtering by file id and version id', async () => {
      const currentTestFiles = await sut.getDatasetFiles(TestConstants.TEST_CREATED_DATASET_ID, latestDatasetVersionId);
      const testFile = currentTestFiles[0];
      const actual = await sut.getFileDownloadCount(testFile.id);
      assert.match(actual, 0);
    });

    test('should return error when file does not exist', async () => {
      let error: ReadError = undefined;

      await sut.getFileDownloadCount(nonExistentFiledId).catch((e) => (error = e));

      assert.match(
        error.message,
        `There was an error when reading the resource. Reason was: [404] File with ID ${nonExistentFiledId} not found.`,
      );
    });
  });

  describe('getFileUserPermissions', () => {
    test('should return user permissions filtering by file id and version id', async () => {
      const currentTestFiles = await sut.getDatasetFiles(TestConstants.TEST_CREATED_DATASET_ID, latestDatasetVersionId);
      const testFile = currentTestFiles[0];
      const actual = await sut.getFileUserPermissions(testFile.id);
      assert.match(actual.canDownloadFile, true);
      assert.match(actual.canEditOwnerDataset, true);
    });

    test('should return error when file does not exist', async () => {
      let error: ReadError = undefined;

      await sut.getFileUserPermissions(nonExistentFiledId).catch((e) => (error = e));

      assert.match(
        error.message,
        `There was an error when reading the resource. Reason was: [404] File with ID ${nonExistentFiledId} not found.`,
      );
    });
  });

  describe('getFileDataTables', () => {
    test('should return data tables filtering by tabular file id and version id', async () => {
      const currentTestFiles = await sut.getDatasetFiles(TestConstants.TEST_CREATED_DATASET_ID, latestDatasetVersionId);
      const testFile = currentTestFiles[3];
      const actual = await sut.getFileDataTables(testFile.id);
      assert.match(actual[0].varQuantity, 3);
    });

    test('should return error when file is not tabular and version id', async () => {
      const currentTestFiles = await sut.getDatasetFiles(TestConstants.TEST_CREATED_DATASET_ID, latestDatasetVersionId);
      const testFile = currentTestFiles[0];

      let error: ReadError = undefined;

      await sut.getFileDataTables(testFile.id).catch((e) => (error = e));

      assert.match(
        error.message,
        'There was an error when reading the resource. Reason was: [400] This operation is only available for tabular files.',
      );
    });

    test('should return error when file does not exist', async () => {
      let error: ReadError = undefined;

      await sut.getFileDataTables(nonExistentFiledId).catch((e) => (error = e));

      assert.match(
        error.message,
        `There was an error when reading the resource. Reason was: [404] File not found for given id.`,
      );
    });
  });
});
