import { ReadError } from '../../../src/core/domain/repositories/ReadError'
import { IDataverseInfoRepository } from '../../../src/info/domain/repositories/IDataverseInfoRepository'
import { GetApplicationTermsOfUse } from '../../../src/info/domain/useCases/GetApplicationTermsOfUse'

describe('execute', () => {
  test('should return successful result with terms of use on repository success', async () => {
    const testTermsOfUse = 'Be excellent to each other.'
    const dataverseInfoRepositoryStub: IDataverseInfoRepository = {} as IDataverseInfoRepository
    dataverseInfoRepositoryStub.getApplicationTermsOfUse = jest
      .fn()
      .mockResolvedValue(testTermsOfUse)
    const sut = new GetApplicationTermsOfUse(dataverseInfoRepositoryStub)

    const actual = await sut.execute()

    expect(actual).toBe(testTermsOfUse)
  })

  test('should return error result on repository error', async () => {
    const dataverseInfoRepositoryStub: IDataverseInfoRepository = {} as IDataverseInfoRepository
    const testReadError = new ReadError()
    dataverseInfoRepositoryStub.getApplicationTermsOfUse = jest
      .fn()
      .mockRejectedValue(testReadError)
    const sut = new GetApplicationTermsOfUse(dataverseInfoRepositoryStub)

    await expect(sut.execute()).rejects.toThrow(ReadError)
  })
})
