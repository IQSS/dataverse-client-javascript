import { DatasetsRepository } from '../../../src/datasets/infra/repositories/DatasetsRepository';
import { assert } from 'sinon';
import { TestConstants } from '../../testHelpers/TestConstants';
import {
  createPrivateUrlViaApi,
  publishDatasetViaApi,
  deaccessionDatasetViaApi,
  waitForNoLocks,
} from '../../testHelpers/datasets/datasetHelper';
import { ReadError } from '../../../src/core/domain/repositories/ReadError';
import { DatasetNotNumberedVersion, DatasetLockType, DatasetPreviewSubset } from '../../../src/datasets';
import { fail } from 'assert';
import { ApiConfig } from '../../../src';
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig';
import { NewDatasetDTO } from '../../../src/datasets/domain/dtos/NewDatasetDTO';
import { MetadataBlocksRepository } from '../../../src/metadataBlocks/infra/repositories/MetadataBlocksRepository';
import { Author, DatasetContact, DatasetDescription } from '../../../src/datasets/domain/models/Dataset';

describe('DatasetsRepository', () => {
  const sut: DatasetsRepository = new DatasetsRepository();
  const nonExistentTestDatasetId = 100;

  const latestVersionId = DatasetNotNumberedVersion.LATEST;

  beforeAll(async () => {
    ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.API_KEY, process.env.TEST_API_KEY);
  });

  describe('getAllDatasetPreviews', () => {
    const testPageLimit = 1;

    test('should return all dataset previews when no pagination params are defined', async () => {
      const actual: DatasetPreviewSubset = await sut.getAllDatasetPreviews();
      assert.match(actual.datasetPreviews.length, 2);
      assert.match(actual.datasetPreviews[0].title, 'Second Dataset');
      assert.match(actual.totalDatasetCount, 2);
    });

    test('should return first dataset preview page', async () => {
      const actual = await sut.getAllDatasetPreviews(testPageLimit, 0);
      assert.match(actual.datasetPreviews.length, 1);
      assert.match(actual.datasetPreviews[0].title, 'Second Dataset');
      assert.match(actual.totalDatasetCount, 2);
    });

    test('should return second dataset preview page', async () => {
      const actual = await sut.getAllDatasetPreviews(testPageLimit, 1);
      assert.match(actual.datasetPreviews.length, 1);
      assert.match(actual.datasetPreviews[0].title, 'First Dataset');
      assert.match(actual.totalDatasetCount, 2);
    });

    test('should return third dataset preview page', async () => {
      const actual = await sut.getAllDatasetPreviews(testPageLimit, 2);
      assert.match(actual.datasetPreviews.length, 0);
      assert.match(actual.totalDatasetCount, 2);
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

  describe('getDatasetCitation', () => {
    test('should return citation when dataset exists', async () => {
      const actualDatasetCitation = await sut.getDatasetCitation(
        TestConstants.TEST_CREATED_DATASET_1_ID,
        latestVersionId,
        false,
      );
      expect(typeof actualDatasetCitation).toBe('string');
    });

    test('should return error when dataset does not exist', async () => {
      let error: ReadError = undefined;
      await sut.getDatasetCitation(nonExistentTestDatasetId, latestVersionId, false).catch((e) => (error = e));

      assert.match(
        error.message,
        `There was an error when reading the resource. Reason was: [404] Dataset with ID ${nonExistentTestDatasetId} not found.`,
      );
    });

    test('should return citation when dataset is deaccessioned', async () => {
      await waitForNoLocks(TestConstants.TEST_CREATED_DATASET_2_ID, 10)
        .then()
        .catch(() => {
          assert.fail('Error while waiting for no locks');
        });

      await deaccessionDatasetViaApi(TestConstants.TEST_CREATED_DATASET_2_ID, '1.0')
        .then()
        .catch((error) => {
          console.log(JSON.stringify(error));
          assert.fail('Error while deaccessioning test Dataset');
        });

      const actualDatasetCitation = await sut.getDatasetCitation(
        TestConstants.TEST_CREATED_DATASET_2_ID,
        latestVersionId,
        true,
      );
      expect(typeof actualDatasetCitation).toBe('string');
    });
  });

  describe('createDataset', () => {
    test('should create a dataset with the provided dataset citation fields', async () => {
      const testTitle = 'Dataset created using the createDataset use case';
      const testAuthorName1 = 'Admin, Dataverse';
      const testAuthorName2 = 'Owner, Dataverse';
      const testAuthorAffiliation1 = 'Dataverse.org';
      const testAuthorAffiliation2 = 'Dataversedemo.org';
      const testContactEmail = 'finch@mailinator.com';
      const testContactName = 'Finch, Fiona';
      const testDescription = 'This is the description of the dataset.';
      const testSubject = ['Medicine, Health and Life Sciences'];

      const testNewDataset: NewDatasetDTO = {
        metadataBlockValues: [
          {
            name: 'citation',
            fields: {
              title: testTitle,
              author: [
                {
                  authorName: testAuthorName1,
                  authorAffiliation: testAuthorAffiliation1,
                },
                {
                  authorName: testAuthorName2,
                  authorAffiliation: testAuthorAffiliation2,
                },
              ],
              datasetContact: [
                {
                  datasetContactEmail: testContactEmail,
                  datasetContactName: testContactName,
                },
              ],
              dsDescription: [
                {
                  dsDescriptionValue: testDescription,
                },
              ],
              subject: testSubject,
            },
          },
        ],
      };

      const metadataBlocksRepository = new MetadataBlocksRepository();
      const citationMetadataBlock = await metadataBlocksRepository.getMetadataBlockByName('citation');
      const createdDataset = await sut.createDataset(testNewDataset, [citationMetadataBlock], 'root');
      const actualCreatedDataset = await sut.getDataset(createdDataset.numericId, latestVersionId, false);

      expect(actualCreatedDataset.metadataBlocks[0].fields.title).toBe(testTitle);
      expect((actualCreatedDataset.metadataBlocks[0].fields.author[0] as Author).authorName).toBe(testAuthorName1);
      expect((actualCreatedDataset.metadataBlocks[0].fields.author[0] as Author).authorAffiliation).toBe(
        testAuthorAffiliation1,
      );
      expect((actualCreatedDataset.metadataBlocks[0].fields.author[1] as Author).authorName).toBe(testAuthorName2);
      expect((actualCreatedDataset.metadataBlocks[0].fields.author[1] as Author).authorAffiliation).toBe(
        testAuthorAffiliation2,
      );
      expect(
        (actualCreatedDataset.metadataBlocks[0].fields.datasetContact[0] as DatasetContact).datasetContactEmail,
      ).toBe(testContactEmail);
      expect(
        (actualCreatedDataset.metadataBlocks[0].fields.datasetContact[0] as DatasetContact).datasetContactName,
      ).toBe(testContactName);
      expect(
        (actualCreatedDataset.metadataBlocks[0].fields.dsDescription[0] as DatasetDescription).dsDescriptionValue,
      ).toBe(testDescription);
      expect(actualCreatedDataset.metadataBlocks[0].fields.subject[0]).toBe(testSubject[0]);
      expect(actualCreatedDataset.metadataBlocks[0].fields.subject[1]).toBe(testSubject[1]);
    });
  });
});
