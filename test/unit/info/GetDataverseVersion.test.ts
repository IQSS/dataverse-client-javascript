import { GetDataverseVersion } from '../../../src/info/domain/useCases/GetDataverseVersion'
import { IDataverseInfoRepository } from '../../../src/info/domain/repositories/IDataverseInfoRepository'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'

describe('execute', () => {
  test('should return successful result with version on repository success', async () => {
    const testDataverseVersion = '5.13'
    const dataverseInfoRepositoryStub: IDataverseInfoRepository = {} as IDataverseInfoRepository
    dataverseInfoRepositoryStub.getDataverseVersion = jest
      .fn()
      .mockResolvedValue(testDataverseVersion)
    const sut = new GetDataverseVersion(dataverseInfoRepositoryStub)

    const actual = await sut.execute()

    expect(actual).toBe(testDataverseVersion)
  })

  test('should return error result on repository error', async () => {
    const dataverseInfoRepositoryStub: IDataverseInfoRepository = {} as IDataverseInfoRepository
    const testReadError = new ReadError()
    dataverseInfoRepositoryStub.getDataverseVersion = jest.fn().mockRejectedValue(testReadError)
    const sut = new GetDataverseVersion(dataverseInfoRepositoryStub)

    let actualError: ReadError = undefined
    await sut.execute().catch((e) => (actualError = e))

    expect(actualError).toBe(testReadError)
  })
})
