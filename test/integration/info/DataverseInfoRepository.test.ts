import { DataverseInfoRepository } from '../../../src/info/infra/repositories/DataverseInfoRepository';
import { ApiConfig } from '../../../src/core/infra/repositories/ApiConfig';

describe('getDataverseVersion', () => {
  const sut: DataverseInfoRepository = new DataverseInfoRepository();

  ApiConfig.init('http://localhost:8080/api/v1');

  test('should return Dataverse version', async () => {
    const actual = await sut.getDataverseVersion();
    expect(typeof actual.number).toBe('string');
  });
});
