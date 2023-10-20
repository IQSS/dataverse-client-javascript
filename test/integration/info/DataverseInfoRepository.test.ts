import { DataverseInfoRepository } from '../../../src/info/infra/repositories/DataverseInfoRepository';
import { ApiConfig, DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig';
import { TestConstants } from '../../testHelpers/TestConstants';
import { setMaxEmbargoDurationInMonthsViaApi } from '../../testHelpers/info/infoHelper';
import { ReadError } from '../../../src/core/domain/repositories/ReadError';
import { assert } from 'sinon';
import { fail } from 'assert';

describe('DataverseInfoRepository', () => {
  const sut: DataverseInfoRepository = new DataverseInfoRepository();

  beforeAll(async () => {
    ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.API_KEY, process.env.TEST_API_KEY);
  });

  describe('getDataverseVersion', () => {
    test('should return Dataverse version', async () => {
      const actual = await sut.getDataverseVersion();
      expect(typeof actual.number).toBe('string');
    });
  });

  describe('getZipDownloadLimit', () => {
    test('should return zip download limit', async () => {
      const actual = await sut.getZipDownloadLimit();
      expect(typeof actual).toBe('number');
    });
  });

  describe('getMaxEmbargoDurationInMonths', () => {
    test('should return error when the setting does not exist', async () => {
      let error: ReadError = undefined;
      await sut.getMaxEmbargoDurationInMonths().catch((e) => (error = e));
      assert.match(
        error.message,
        'There was an error when reading the resource. Reason was: [404] Setting :MaxEmbargoDurationInMonths not found',
      );
    });

    test('should return duration when the setting exists', async () => {
      const testMaxEmbargoDurationInMonths = 12;
      await setMaxEmbargoDurationInMonthsViaApi(testMaxEmbargoDurationInMonths)
        .then()
        .catch(() => {
          fail('Test getMaxEmbargoDurationInMonths: Error while setting :MaxEmbargoDurationInMonths');
        });
      const actual = await sut.getMaxEmbargoDurationInMonths();
      assert.match(actual, testMaxEmbargoDurationInMonths);
    });
  });
});
