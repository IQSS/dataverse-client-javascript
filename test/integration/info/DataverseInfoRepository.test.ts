import { DataverseInfoRepository } from '../../../src/info/infra/repositories/DataverseInfoRepository';

describe('getDataverseVersion', () => {
  const sut: DataverseInfoRepository = new DataverseInfoRepository();

  test('should return Dataverse version', async () => {
    const actual = await sut.getDataverseVersion();
    expect(typeof actual).toBe('string');
  });
});
