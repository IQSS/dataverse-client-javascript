import { DataverseInfoRepository } from '../../../src/info/infra/repositories/DataverseInfoRepository';
import { ApiConfig } from '../../../src/core/infra/repositories/ApiConfig';

describe('getDataverseVersion', () => {
  // TODO: Change API URL to another of an integration test oriented Dataverse instance
  const sut: DataverseInfoRepository = new DataverseInfoRepository();

  ApiConfig.init('https://demo.dataverse.org/api/v1');

  test('should return Dataverse version', async () => {
    const actual = await sut.getDataverseVersion();
    expect(typeof actual.number).toBe('string');
    expect(typeof actual.build).toBe('string');
  });
});
