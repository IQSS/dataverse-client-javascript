import { GetZipDownloadLimit } from '../../../src/info/domain/useCases/GetZipDownloadLimit'
import { IDataverseInfoRepository } from '../../../src/info/domain/repositories/IDataverseInfoRepository'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'

describe('execute', () => {
  test('should return successful result on repository success', async () => {
    const testZipDownloadLimit = 100
    const dataverseInfoRepositoryStub: IDataverseInfoRepository = {} as IDataverseInfoRepository
    dataverseInfoRepositoryStub.getZipDownloadLimit = jest
      .fn()
      .mockResolvedValue(testZipDownloadLimit)

    const sut = new GetZipDownloadLimit(dataverseInfoRepositoryStub)

    const actual = await sut.execute()

    expect(actual).toEqual(testZipDownloadLimit)
  })

  test('should return error result on repository error', async () => {
    const dataverseInfoRepositoryStub: IDataverseInfoRepository = {} as IDataverseInfoRepository
    dataverseInfoRepositoryStub.getZipDownloadLimit = jest.fn().mockRejectedValue(new ReadError())
    const sut = new GetZipDownloadLimit(dataverseInfoRepositoryStub)

    let actualError: ReadError
    await sut.execute().catch((e) => (actualError = e))

    expect(actualError).toBeInstanceOf(ReadError)
  })
})
