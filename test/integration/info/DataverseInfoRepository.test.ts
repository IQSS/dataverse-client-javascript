import { DataverseInfoRepository } from '../../../src/info/infra/repositories/DataverseInfoRepository';
import { ApiConfig, DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig';
import { TestConstants } from '../../testHelpers/TestConstants';

describe('getDataverseVersion', () => {
  const sut: DataverseInfoRepository = new DataverseInfoRepository();

  ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.API_KEY);

  test('should return Dataverse version', async () => {
    const actual = await sut.getDataverseVersion();
    expect(typeof actual.number).toBe('string');
  });
});
