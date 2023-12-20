import { DatasetsRepository } from '../../../src/datasets/infra/repositories/DatasetsRepository';
import { assert } from 'sinon';
import { TestConstants } from '../../testHelpers/TestConstants';
import { createPrivateUrlViaApi, publishDatasetViaApi } from '../../testHelpers/datasets/datasetHelper';
import { ReadError } from '../../../src/core/domain/repositories/ReadError';
import { DatasetNotNumberedVersion, DatasetLockType } from '../../../src/datasets';
import { DatasetPreview } from '../../../src/datasets/domain/models/DatasetPreview';
import { fail } from 'assert';
import { ApiConfig } from '../../../src';
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig';

describe('DatasetsRepository', () => {
  const sut: DatasetsRepository = new DatasetsRepository();
  const nonExistentTestDatasetId = 100;

  const latestVersionId = DatasetNotNumberedVersion.LATEST;

  beforeAll(async () => {
    ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.API_KEY, process.env.TEST_API_KEY);
  });

  describe('getDatasetSummaryFieldNames', () => {
    test('should return not empty field list on successful response', async () => {
      const actual = await sut.getDatasetSummaryFieldNames();

      assert.pass(actual.length > 0);
    });
  });

  describe('getDataset', () => {
    describe('by numeric id', () => {
      test('should return dataset when it exists filtering by id and version id', async () => {
        const actual = await sut.getDataset(TestConstants.TEST_CREATED_DATASET_1_ID, latestVersionId, false);
        expect(actual.id).toBe(TestConstants.TEST_CREATED_DATASET_1_ID);
      });

      test('should return dataset when it exists filtering by id and version id', async () => {
        const actual = await sut.getDataset(TestConstants.TEST_CREATED_DATASET_1_ID, latestVersionId, false);
        expect(actual.id).toBe(TestConstants.TEST_CREATED_DATASET_1_ID);
      });

      test('should return error when dataset does not exist', async () => {
        let error: ReadError = undefined;
        await sut.getDataset(nonExistentTestDatasetId, latestVersionId, false).catch((e) => (error = e));

        assert.match(
          error.message,
          `There was an error when reading the resource. Reason was: [404] Dataset with ID ${nonExistentTestDatasetId} not found.`,
        );
      });
    });
    describe('by persistent id', () => {
      test('should return dataset when it exists filtering by persistent id and version id', async () => {
        const createdDataset = await sut.getDataset(TestConstants.TEST_CREATED_DATASET_1_ID, latestVersionId, false);
        const actual = await sut.getDataset(createdDataset.persistentId, latestVersionId, false);
        expect(actual.id).toBe(TestConstants.TEST_CREATED_DATASET_1_ID);
      });

      test('should return error when dataset does not exist', async () => {
        let error: ReadError = undefined;

        const testWrongPersistentId = 'wrongPersistentId';
        await sut.getDataset(testWrongPersistentId, latestVersionId, false).catch((e) => (error = e));

        assert.match(
          error.message,
          `There was an error when reading the resource. Reason was: [404] Dataset with Persistent ID ${testWrongPersistentId} not found.`,
        );
      });
    });
  });

  describe('getDatasetCitation', () => {
    test('should return citation when dataset exists', async () => {
      const actualDatasetCitation = await sut.getDatasetCitation(
        TestConstants.TEST_CREATED_DATASET_1_ID,
        latestVersionId,
      );
      expect(typeof actualDatasetCitation).toBe('string');
    });

    test('should return error when dataset does not exist', async () => {
      let error: ReadError = undefined;

      await sut.getDatasetCitation(nonExistentTestDatasetId, latestVersionId).catch((e) => (error = e));

      assert.match(
        error.message,
        `There was an error when reading the resource. Reason was: [404] Dataset with ID ${nonExistentTestDatasetId} not found.`,
      );
    });
  });

  describe('Private URLs', () => {
    const expectedErrorInvalidToken =
      'There was an error when reading the resource. Reason was: [404] Private URL user not found';
    let privateUrlToken: string = undefined;

    beforeAll(async () => {
      await createPrivateUrlViaApi(TestConstants.TEST_CREATED_DATASET_1_ID)
        .then((response) => {
          privateUrlToken = response.data.data.token;
        })
        .catch(() => {
          fail('Tests beforeAll(): Error while creating Dataset private URL');
        });
    });

    describe('getPrivateUrlDataset', () => {
      test('should return dataset when token is valid', async () => {
        const actual = await sut.getPrivateUrlDataset(privateUrlToken);

        expect(actual.id).toBe(TestConstants.TEST_CREATED_DATASET_1_ID);
      });

      test('should return error when token is not valid', async () => {
        let error: ReadError = undefined;

        await sut.getPrivateUrlDataset('invalidToken').catch((e) => (error = e));

        assert.match(error.message, expectedErrorInvalidToken);
      });
    });

    describe('getPrivateUrlDatasetCitation', () => {
      test('should return dataset citation when token is valid', async () => {
        const actual = await sut.getPrivateUrlDatasetCitation(privateUrlToken);

        expect(typeof actual).toBe('string');
      });

      test('should return error when token is not valid', async () => {
        let error: ReadError = undefined;

        await sut.getPrivateUrlDataset('invalidToken').catch((e) => (error = e));

        assert.match(error.message, expectedErrorInvalidToken);
      });
    });

    describe('getDatasetUserPermissions', () => {
      test('should return user permissions filtering by dataset id', async () => {
        const actual = await sut.getDatasetUserPermissions(TestConstants.TEST_CREATED_DATASET_1_ID);
        assert.match(actual.canViewUnpublishedDataset, true);
        assert.match(actual.canEditDataset, true);
        assert.match(actual.canPublishDataset, true);
        assert.match(actual.canManageDatasetPermissions, true);
        assert.match(actual.canDeleteDatasetDraft, true);
      });

      test('should return error when dataset does not exist', async () => {
        let error: ReadError = undefined;

        await sut.getDatasetUserPermissions(nonExistentTestDatasetId).catch((e) => (error = e));

        assert.match(
          error.message,
          `There was an error when reading the resource. Reason was: [404] Dataset with ID ${nonExistentTestDatasetId} not found.`,
        );
      });
    });

    describe('getDatasetLocks', () => {
      test('should return list of dataset locks by dataset id for a dataset while publishing', async () => {
        await publishDatasetViaApi(TestConstants.TEST_CREATED_DATASET_2_ID)
          .then()
          .catch(() => {
            assert.fail('Error while publishing test Dataset');
          });
        const actual = await sut.getDatasetLocks(TestConstants.TEST_CREATED_DATASET_2_ID);
        assert.match(actual.length, 1);
        assert.match(actual[0].lockType, DatasetLockType.FINALIZE_PUBLICATION);
        assert.match(actual[0].userId, 'dataverseAdmin');
        assert.match(actual[0].message, 'Publishing the dataset; Validating Datafiles Asynchronously');
      });

      test('should return error when dataset does not exist', async () => {
        let error: ReadError = undefined;

        await sut.getDatasetLocks(nonExistentTestDatasetId).catch((e) => (error = e));

        assert.match(
          error.message,
          `There was an error when reading the resource. Reason was: [404] Dataset with ID ${nonExistentTestDatasetId} not found.`,
        );
      });
    });
  });

  describe('getAllDatasetPreviews', () => {
    const expectedDatasetTitle = "Darwin's Finches";

    test('should return all datasets when no pagination params are defined', async () => {
      const actual: DatasetPreview[] = await sut.getAllDatasetPreviews();
      assert.match(actual.length, 2);
      assert.match(actual[0].title, expectedDatasetTitle);
    });

    test('should return dataset pages correctly when pagination params are defined', async () => {
      // First page
      let actual = await sut.getAllDatasetPreviews(1, 0);
      assert.match(actual.length, 1);
      assert.match(actual[0].title, expectedDatasetTitle);
      const firstDatasetPid = actual[0].persistentId;
      // Second page
      actual = await sut.getAllDatasetPreviews(1, 1);
      assert.match(actual.length, 1);
      assert.match(actual[0].title, expectedDatasetTitle);
      const secondDatasetPid = actual[0].persistentId;
      expect(secondDatasetPid == firstDatasetPid).toBe(false);
      // Third page
      actual = await sut.getAllDatasetPreviews(1, 2);
      assert.match(actual.length, 0);
    });
  });
});
