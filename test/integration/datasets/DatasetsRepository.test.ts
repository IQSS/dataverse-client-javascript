import { DatasetsRepository } from '../../../src/datasets/infra/repositories/DatasetsRepository';
import { assert } from 'sinon';
import { ApiConfig, DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig';
import { TestConstants } from '../../testHelpers/TestConstants';
import { createDatasetViaApi, createPrivateUrlViaApi } from '../../testHelpers/datasets/datasetHelper';
import { ReadError } from '../../../src/core/domain/repositories/ReadError';

describe('DatasetsRepository', () => {
  const sut: DatasetsRepository = new DatasetsRepository();
  const createdTestDatasetId = 2;
  const nonExistentTestDatasetId = 100;

  ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.API_KEY, process.env.TEST_API_KEY);

  beforeAll(async () => {
    // We update timeout due to experienced timeout errors
    jest.setTimeout(10000);
    await createDatasetViaApi()
      .then()
      .catch(() => {
        fail('Tests beforeAll(): Error while creating test Dataset');
      });
  });

  afterAll(async () => {
    // We update timeout back to original default value
    jest.setTimeout(5000);
  });

  describe('getDatasetSummaryFieldNames', () => {
    test('should return not empty field list on successful response', async () => {
      const actual = await sut.getDatasetSummaryFieldNames();

      assert.pass(actual.length > 0);
    });
  });

  describe('getDatasetById', () => {
    test('should return dataset when it exists filtering by id', async () => {
      const actual = await sut.getDatasetById(createdTestDatasetId);
      expect(actual.id).toBe(createdTestDatasetId);
    });

    test('should return dataset when it exists filtering by id and version id', async () => {
      const actual = await sut.getDatasetById(createdTestDatasetId, ':draft');
      expect(actual.id).toBe(createdTestDatasetId);
    });

    test('should return error when dataset does not exist', async () => {
      let error: ReadError = undefined;
      await sut.getDatasetById(nonExistentTestDatasetId).catch((e) => (error = e));

      assert.match(
        error.message,
        `There was an error when reading the resource. Reason was: [404] Dataset with ID ${nonExistentTestDatasetId} not found.`,
      );
    });
  });

  describe('getDatasetByPersistentId', () => {
    test('should return dataset when it exists filtering by persistent id', async () => {
      const createdDataset = await sut.getDatasetById(createdTestDatasetId);
      const actual = await sut.getDatasetByPersistentId(createdDataset.persistentId);
      expect(actual.id).toBe(createdTestDatasetId);
    });

    test('should return dataset when it exists filtering by persistent id and version id', async () => {
      const createdDataset = await sut.getDatasetById(createdTestDatasetId);
      const actual = await sut.getDatasetByPersistentId(createdDataset.persistentId, ':draft');
      expect(actual.id).toBe(createdTestDatasetId);
    });

    test('should return error when dataset does not exist', async () => {
      let error: ReadError = undefined;

      const testWrongPersistentId = 'wrongPersistentId';
      await sut.getDatasetByPersistentId(testWrongPersistentId).catch((e) => (error = e));

      assert.match(
        error.message,
        `There was an error when reading the resource. Reason was: [404] Dataset with Persistent ID ${testWrongPersistentId} not found.`,
      );
    });
  });

  describe('getDatasetCitation', () => {
    test('should return citation when dataset exists', async () => {
      const actualDatasetCitation = await sut.getDatasetCitation(createdTestDatasetId);
      expect(typeof actualDatasetCitation).toBe('string');
    });

    test('should return error when dataset does not exist', async () => {
      let error: ReadError = undefined;

      await sut.getDatasetCitation(nonExistentTestDatasetId).catch((e) => (error = e));

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
      await createPrivateUrlViaApi(createdTestDatasetId)
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

        expect(actual.id).toBe(createdTestDatasetId);
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
  });
});
