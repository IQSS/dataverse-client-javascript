import { FilesRepository } from '../../../src/files/infra/repositories/FilesRepository';
import { ApiConfig, DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig';
import { assert } from 'sinon';
import { expect } from 'chai';
import { TestConstants } from '../../testHelpers/TestConstants';
import {registerFileViaApi, uploadFileViaApi} from '../../testHelpers/files/filesHelper';
import { DatasetsRepository } from '../../../src/datasets/infra/repositories/DatasetsRepository';
import { ReadError } from '../../../src/core/domain/repositories/ReadError';
import { FileSearchCriteria, FileAccessStatus, FileOrderCriteria } from '../../../src/files/domain/models/FileCriteria';
import { DatasetNotNumberedVersion } from '../../../src/datasets';
import { FileCounts } from '../../../src/files/domain/models/FileCounts';
import { FileDownloadSizeMode } from '../../../src';
import { fail } from 'assert';

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

  let testFileId: number;
  let testFilePersistentId: string;
  beforeAll(async () => {
    ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.API_KEY, process.env.TEST_API_KEY);
    // Uploading test file 1 with some categories
    const uploadFileResponse = await uploadFileViaApi(TestConstants.TEST_CREATED_DATASET_1_ID, testTextFile1Name, { categories: [testCategoryName] })
      .then()
      .catch((e) => {
        console.log(e);
        fail(`Tests beforeAll(): Error while uploading file ${testTextFile1Name}`);
      });
    // Uploading test file 2
    await uploadFileViaApi(TestConstants.TEST_CREATED_DATASET_1_ID, testTextFile2Name)
      .then()
      .catch((e) => {
        console.log(e);
        fail(`Tests beforeAll(): Error while uploading file ${testTextFile2Name}`);
      });
    // Uploading test file 3
    await uploadFileViaApi(TestConstants.TEST_CREATED_DATASET_1_ID, testTextFile3Name)
      .then()
      .catch((e) => {
        console.log(e);
        fail(`Tests beforeAll(): Error while uploading file ${testTextFile3Name}`);
      });
    // Uploading test file 4
    await uploadFileViaApi(TestConstants.TEST_CREATED_DATASET_1_ID, testTabFile4Name)
      .then()
      .catch((e) => {
        console.log(e);
        fail(`Tests beforeAll(): Error while uploading file ${testTabFile4Name}`);
      });
    // Registering test file 1
    await registerFileViaApi(uploadFileResponse.data.data.files[0].dataFile.id);
    const filesSubset = await sut.getDatasetFiles(
        TestConstants.TEST_CREATED_DATASET_1_ID,
        latestDatasetVersionId,
        false,
        FileOrderCriteria.NAME_AZ,
    )
    testFileId = filesSubset.files[0].id;
    testFilePersistentId = filesSubset.files[0].persistentId;
  });

  describe('getDatasetFiles', () => {
    const testFileCriteria = new FileSearchCriteria()
      .withContentType('text/plain')
      .withAccessStatus(FileAccessStatus.PUBLIC);

    describe('by numeric id', () => {
      test('should return all files filtering by dataset id and version id', async () => {
        const actual = await sut.getDatasetFiles(
          TestConstants.TEST_CREATED_DATASET_1_ID,
          latestDatasetVersionId,
          false,
          FileOrderCriteria.NAME_AZ,
        );
        assert.match(actual.files.length, 4);
        assert.match(actual.files[0].name, testTextFile1Name);
        assert.match(actual.files[1].name, testTextFile2Name);
        assert.match(actual.files[2].name, testTextFile3Name);
        assert.match(actual.files[3].name, testTabFile4Name);
        assert.match(actual.totalFilesCount, 4);
      });

      test('should return correct files filtering by dataset id, version id, and paginating', async () => {
        const actual = await sut.getDatasetFiles(
          TestConstants.TEST_CREATED_DATASET_1_ID,
          latestDatasetVersionId,
          false,
          FileOrderCriteria.NAME_AZ,
          3,
          3,
          undefined,
        );
        assert.match(actual.files.length, 1);
        assert.match(actual.files[0].name, testTabFile4Name);
        assert.match(actual.totalFilesCount, 4);
      });

      test('should return correct files filtering by dataset id, version id, and applying newest file criteria', async () => {
        const actual = await sut.getDatasetFiles(
          TestConstants.TEST_CREATED_DATASET_1_ID,
          latestDatasetVersionId,
          false,
          FileOrderCriteria.NEWEST,
          undefined,
          undefined,
          testFileCriteria,
        );
        assert.match(actual.files.length, 3);
        assert.match(actual.files[0].name, testTextFile3Name);
        assert.match(actual.files[1].name, testTextFile2Name);
        assert.match(actual.files[2].name, testTextFile1Name);
        assert.match(actual.totalFilesCount, 3);
      });

      test('should return error when dataset does not exist', async () => {
        let error: ReadError = undefined;

        const nonExistentTestDatasetId = 100;
        await sut
          .getDatasetFiles(nonExistentTestDatasetId, latestDatasetVersionId, false, FileOrderCriteria.NAME_AZ)
          .catch((e) => (error = e));

        assert.match(
          error.message,
          `There was an error when reading the resource. Reason was: [404] Dataset with ID ${nonExistentTestDatasetId} not found.`,
        );
      });
    });

    describe('by persistent id', () => {
      test('should return all files filtering by persistent id and version id', async () => {
        const testDataset = await datasetRepository.getDataset(
          TestConstants.TEST_CREATED_DATASET_1_ID,
          latestDatasetVersionId,
          false,
        );
        const actual = await sut.getDatasetFiles(
          testDataset.persistentId,
          latestDatasetVersionId,
          false,
          FileOrderCriteria.NAME_AZ,
        );
        assert.match(actual.files.length, 4);
        assert.match(actual.files[0].name, testTextFile1Name);
        assert.match(actual.files[1].name, testTextFile2Name);
        assert.match(actual.files[2].name, testTextFile3Name);
        assert.match(actual.files[3].name, testTabFile4Name);
        assert.match(actual.totalFilesCount, 4);
      });

      test('should return correct files filtering by persistent id, version id, and paginating', async () => {
        const testDataset = await datasetRepository.getDataset(
          TestConstants.TEST_CREATED_DATASET_1_ID,
          latestDatasetVersionId,
          false,
        );
        const actual = await sut.getDatasetFiles(
          testDataset.persistentId,
          latestDatasetVersionId,
          false,
          FileOrderCriteria.NAME_AZ,
          3,
          3,
          undefined,
        );
        assert.match(actual.files.length, 1);
        assert.match(actual.files[0].name, testTabFile4Name);
        assert.match(actual.totalFilesCount, 4);
      });

      test('should return correct files filtering by persistent id, version id, and applying newest file criteria', async () => {
        const testDataset = await datasetRepository.getDataset(
          TestConstants.TEST_CREATED_DATASET_1_ID,
          latestDatasetVersionId,
          false,
        );
        const actual = await sut.getDatasetFiles(
          testDataset.persistentId,
          latestDatasetVersionId,
          false,
          FileOrderCriteria.NEWEST,
          undefined,
          undefined,
          testFileCriteria,
        );
        assert.match(actual.files.length, 3);
        assert.match(actual.files[0].name, testTextFile3Name);
        assert.match(actual.files[1].name, testTextFile2Name);
        assert.match(actual.files[2].name, testTextFile1Name);
        assert.match(actual.totalFilesCount, 3);
      });

      test('should return error when dataset does not exist', async () => {
        let error: ReadError = undefined;

        const testWrongPersistentId = 'wrongPersistentId';
        await sut
          .getDatasetFiles(testWrongPersistentId, latestDatasetVersionId, false, FileOrderCriteria.NAME_AZ)
          .catch((e) => (error = e));

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
      const actual = await sut.getDatasetFileCounts(
        TestConstants.TEST_CREATED_DATASET_1_ID,
        latestDatasetVersionId,
        false,
      );
      assert.match(actual.total, expectedFileCounts.total);
      expect(actual.perContentType).to.have.deep.members(expectedFileCounts.perContentType);
      expect(actual.perAccessStatus).to.have.deep.members(expectedFileCounts.perAccessStatus);
      expect(actual.perCategoryName).to.have.deep.members(expectedFileCounts.perCategoryName);
    });

    test('should return file count filtering by numeric id and applying category criteria', async () => {
      const expectedFileCountsForCriteria: FileCounts = {
        total: 1,
        perContentType: [
          {
            contentType: 'text/plain',
            count: 1,
          },
        ],
        perAccessStatus: [
          {
            accessStatus: FileAccessStatus.PUBLIC,
            count: 1,
          },
        ],
        perCategoryName: [
          {
            categoryName: testCategoryName,
            count: 1,
          },
        ],
      };
      const testCriteria = new FileSearchCriteria().withCategoryName(testCategoryName);
      const actual = await sut.getDatasetFileCounts(
        TestConstants.TEST_CREATED_DATASET_1_ID,
        latestDatasetVersionId,
        false,
        testCriteria,
      );
      assert.match(actual.total, expectedFileCountsForCriteria.total);
      expect(actual.perContentType).to.have.deep.members(expectedFileCountsForCriteria.perContentType);
      expect(actual.perAccessStatus).to.have.deep.members(expectedFileCountsForCriteria.perAccessStatus);
      expect(actual.perCategoryName).to.have.deep.members(expectedFileCountsForCriteria.perCategoryName);
    });

    test('should return file count filtering by persistent id', async () => {
      const testDataset = await datasetRepository.getDataset(
        TestConstants.TEST_CREATED_DATASET_1_ID,
        latestDatasetVersionId,
        false,
      );
      const actual = await sut.getDatasetFileCounts(testDataset.persistentId, latestDatasetVersionId, false);
      assert.match(actual.total, expectedFileCounts.total);
      expect(actual.perContentType).to.have.deep.members(expectedFileCounts.perContentType);
      expect(actual.perAccessStatus).to.have.deep.members(expectedFileCounts.perAccessStatus);
      expect(actual.perCategoryName).to.have.deep.members(expectedFileCounts.perCategoryName);
    });
  });

  describe('getDatasetFilesTotalDownloadSize', () => {
    const expectedTotalDownloadSize = 193; // 193 bytes

    test('should return total download size filtering by numeric id and ignoring original tabular size', async () => {
      const actual = await sut.getDatasetFilesTotalDownloadSize(
        TestConstants.TEST_CREATED_DATASET_1_ID,
        latestDatasetVersionId,
        false,
        FileDownloadSizeMode.ORIGINAL,
      );
      assert.match(actual, expectedTotalDownloadSize);
    });

    test('should return total download size filtering by persistent id and ignoring original tabular size', async () => {
      const testDataset = await datasetRepository.getDataset(
        TestConstants.TEST_CREATED_DATASET_1_ID,
        latestDatasetVersionId,
        false,
      );
      const actual = await sut.getDatasetFilesTotalDownloadSize(
        testDataset.persistentId,
        latestDatasetVersionId,
        false,
        FileDownloadSizeMode.ORIGINAL,
      );
      assert.match(actual, expectedTotalDownloadSize);
    });

    test('should return total download size filtering by numeric id, ignoring original tabular size and applying category criteria', async () => {
      const expectedTotalDownloadSizeForCriteria = 12; // 12 bytes
      const testCriteria = new FileSearchCriteria().withCategoryName(testCategoryName);
      const actual = await sut.getDatasetFilesTotalDownloadSize(
        TestConstants.TEST_CREATED_DATASET_1_ID,
        latestDatasetVersionId,
        false,
        FileDownloadSizeMode.ORIGINAL,
        testCriteria,
      );
      assert.match(actual, expectedTotalDownloadSizeForCriteria);
    });
  });

  describe('getFileDownloadCount', () => {
    test('should return count filtering by file id and version id', async () => {
      const currentTestFilesSubset = await sut.getDatasetFiles(
        TestConstants.TEST_CREATED_DATASET_1_ID,
        latestDatasetVersionId,
        false,
        FileOrderCriteria.NAME_AZ,
      );
      const testFile = currentTestFilesSubset.files[0];
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
      const currentTestFilesSubset = await sut.getDatasetFiles(
        TestConstants.TEST_CREATED_DATASET_1_ID,
        latestDatasetVersionId,
        false,
        FileOrderCriteria.NAME_AZ,
      );
      const testFile = currentTestFilesSubset.files[0];
      const actual = await sut.getFileUserPermissions(testFile.id);
      assert.match(actual.canDownloadFile, true);
      assert.match(actual.canManageFilePermissions, true);
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
      const currentTestFilesSubset = await sut.getDatasetFiles(
        TestConstants.TEST_CREATED_DATASET_1_ID,
        latestDatasetVersionId,
        false,
        FileOrderCriteria.NAME_AZ,
      );
      const testFile = currentTestFilesSubset.files[3];
      const actual = await sut.getFileDataTables(testFile.id);
      assert.match(actual[0].varQuantity, 3);
    });

    test('should return error when file is not tabular and version id', async () => {
      const currentTestFilesSubset = await sut.getDatasetFiles(
        TestConstants.TEST_CREATED_DATASET_1_ID,
        latestDatasetVersionId,
        false,
        FileOrderCriteria.NAME_AZ,
      );
      const testFile = currentTestFilesSubset.files[0];

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
        'There was an error when reading the resource. Reason was: [404] File not found for given id.',
      );
    });
  });

  describe('getFile', () => {
    describe('by numeric id', () => {
        test('should return file when providing a valid id', async () => {
          const actual = await sut.getFile(testFileId, DatasetNotNumberedVersion.LATEST);

          assert.match(actual.name, testTextFile1Name);
        });

      test('should return file draft when providing a valid id and version is draft', async () => {
        const actual = await sut.getFile(testFileId, DatasetNotNumberedVersion.DRAFT);

        assert.match(actual.name, testTextFile1Name);
      });

      test('should return Not Implemented Yet error when when providing a valid id and version is different than latest and draft', async () => {
        // This tests can be removed once the API supports getting a file by version
        let error: ReadError = undefined;

        await sut.getFile(testFileId, '1.0').catch((e) => (error = e));

        assert.match(
            error.message,
            `Requesting a file by its dataset version is not yet supported. Requested version: 1.0. Please try using the :latest or :draft version instead.`,
        );
      });

        test('should return error when file does not exist', async () => {
          let error: ReadError = undefined;

          await sut.getFile(nonExistentFiledId, DatasetNotNumberedVersion.LATEST).catch((e) => (error = e));

          assert.match(
            error.message,
            `There was an error when reading the resource. Reason was: [400] Error attempting get the requested data file.`,
          );
        });
    });
    describe('by persistent id', () => {
      test('should return file when providing a valid persistent id', async () => {
        const actual = await sut.getFile(testFilePersistentId, DatasetNotNumberedVersion.LATEST);

        assert.match(actual.name, testTextFile1Name);
      });

      test('should return file draft when providing a valid persistent id and version is draft', async () => {
        const actual = await sut.getFile(testFilePersistentId, DatasetNotNumberedVersion.DRAFT);

        assert.match(actual.name, testTextFile1Name);
      });

      test('should return Not Implemented Yet error when when providing a valid persistent id and version is different than latest and draft', async () => {
        // This tests can be removed once the API supports getting a file by version
        let error: ReadError = undefined;

        await sut.getFile(testFilePersistentId, '1.0').catch((e) => (error = e));

        assert.match(
            error.message,
            `Requesting a file by its dataset version is not yet supported. Requested version: 1.0. Please try using the :latest or :draft version instead.`,
        );
      });

      test('should return error when file does not exist', async () => {
        let error: ReadError = undefined;

        const nonExistentFiledPersistentId = 'nonExistentFiledPersistentId';
        await sut.getFile(nonExistentFiledPersistentId, DatasetNotNumberedVersion.LATEST).catch((e) => (error = e));

        assert.match(
            error.message,
            `There was an error when reading the resource. Reason was: [400] Error attempting get the requested data file.`,
        );
      });
    });
  });
});
