import { DataverseInfoRepository } from '../../../src/info/infra/repositories/DataverseInfoRepository';

describe('getDataverseVersion', () => {
  // TODO: Change API URL to another of an integration test oriented Dataverse instance
  const sut: DataverseInfoRepository = new DataverseInfoRepository('https://demo.dataverse.org/api/v1');

  test('should return Dataverse version', async () => {
    const actual = await sut.getDataverseVersion();
    expect(typeof actual).toBe('string');
  });
});
