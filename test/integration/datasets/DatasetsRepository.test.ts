import { DatasetsRepository } from '../../../src/datasets/infra/repositories/DatasetsRepository';
import { assert } from 'sinon';
import { ApiConfig, DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig';
import { TestConstants } from '../../testHelpers/TestConstants';
import {
  createDatasetViaApi,
  createPrivateUrlViaApi,
  publishDatasetViaApi,
  deaccessionDatasetViaApi,
  waitForNoLocks
} from '../../testHelpers/datasets/datasetHelper';
import { ReadError } from '../../../src/core/domain/repositories/ReadError';
import { DatasetNotNumberedVersion, DatasetLockType } from '../../../src/datasets';

describe('DatasetsRepository', () => {
  const sut: DatasetsRepository = new DatasetsRepository();
  const nonExistentTestDatasetId = 100;

  const latestVersionId = DatasetNotNumberedVersion.LATEST;

  beforeAll(async () => {
    ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.API_KEY, process.env.TEST_API_KEY);
    await createDatasetViaApi()
      .then()
      .catch(() => {
        fail('Tests beforeAll(): Error while creating test Dataset');
      });
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
        const actual = await sut.getDataset(TestConstants.TEST_CREATED_DATASET_ID, latestVersionId, false);
        expect(actual.id).toBe(TestConstants.TEST_CREATED_DATASET_ID);
      });

      test('should return dataset when it exists filtering by id and version id', async () => {
        const actual = await sut.getDataset(TestConstants.TEST_CREATED_DATASET_ID, latestVersionId, false);
        expect(actual.id).toBe(TestConstants.TEST_CREATED_DATASET_ID);
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
        const createdDataset = await sut.getDataset(TestConstants.TEST_CREATED_DATASET_ID, latestVersionId, false);
        const actual = await sut.getDataset(createdDataset.persistentId, latestVersionId, false);
        expect(actual.id).toBe(TestConstants.TEST_CREATED_DATASET_ID);
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
        TestConstants.TEST_CREATED_DATASET_ID,
        latestVersionId,
        false,
      );
      expect(typeof actualDatasetCitation).toBe('string');
    });

    test('should return error when dataset does not exist', async () => {
      let error: ReadError = undefined;
      await sut.getDatasetCitation(nonExistentTestDatasetId, latestVersionId,false).catch((e) => (error = e));

      assert.match(
        error.message,
        `There was an error when reading the resource. Reason was: [404] Dataset with ID ${nonExistentTestDatasetId} not found.`,
      );
    });
    test('should return citation when dataset is deaccessioned', async () => {
      let createdDatasetId = undefined;
      await createDatasetViaApi()
          .then((response) => (createdDatasetId = response.data.data.id))
          .catch(() => {
            assert.fail('Error while creating test Dataset');
          });
      // We publish the new test dataset we can deaccession it
      await publishDatasetViaApi(createdDatasetId)
          .then()
          .catch(() => {
            assert.fail('Error while publishing test Dataset');
          });
      
      await waitForNoLocks(createdDatasetId, 10)
      let locks = await sut.getDatasetLocks(createdDatasetId);
      const maxTries = 10;
      let tries = 0;
      while (locks.length > 0 && tries < maxTries) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        locks = await sut.getDatasetLocks(createdDatasetId);
        tries++
      }
      if (tries >= maxTries && locks.length > 0) {
        assert.fail('Error while waiting for locks to be released');
      }
      await deaccessionDatasetViaApi(createdDatasetId,'1.0')
            .then()
            .catch((error) => {
                console.log(JSON.stringify(error));
                assert.fail('Error while deaccessioning test Dataset');
            });

      const actualDatasetCitation = await sut.getDatasetCitation(
          createdDatasetId,
          latestVersionId,
          true,
      );
      expect(typeof actualDatasetCitation).toBe('string');

    });
  });

  describe('Private URLs', () => {
    const expectedErrorInvalidToken =
      'There was an error when reading the resource. Reason was: [404] Private URL user not found';
    let privateUrlToken: string = undefined;

    beforeAll(async () => {
      await createPrivateUrlViaApi(TestConstants.TEST_CREATED_DATASET_ID)
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

        expect(actual.id).toBe(TestConstants.TEST_CREATED_DATASET_ID);
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
        const actual = await sut.getDatasetUserPermissions(TestConstants.TEST_CREATED_DATASET_ID);
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
        let createdDatasetId = undefined;
        // We create a new dataset
        await createDatasetViaApi()
          .then((response) => (createdDatasetId = response.data.data.id))
          .catch(() => {
            assert.fail('Error while creating test Dataset');
          });
        // We publish the new test dataset so it will create a lock during publishing
        await publishDatasetViaApi(createdDatasetId)
          .then()
          .catch(() => {
            assert.fail('Error while publishing test Dataset');
          });
        const actual = await sut.getDatasetLocks(createdDatasetId);
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
});
