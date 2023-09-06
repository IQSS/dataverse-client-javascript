import { DataverseInfoRepository } from '../../../src/info/infra/repositories/DataverseInfoRepository';
import { ApiConfig, DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig';
import { TestConstants } from '../../testHelpers/TestConstants';

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

  describe('isEmbargoEnabled', () => {
    test('should return boolean result', async () => {
      const actual = await sut.isEmbargoEnabled();
      expect(typeof actual).toBe('boolean');
    });
  });
});
