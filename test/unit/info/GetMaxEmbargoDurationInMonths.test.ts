import { GetMaxEmbargoDurationInMonths } from '../../../src/info/domain/useCases/GetMaxEmbargoDurationInMonths'
import { IDataverseInfoRepository } from '../../../src/info/domain/repositories/IDataverseInfoRepository'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'

describe('execute', () => {
  test('should return duration on repository success', async () => {
    const testDuration = 12
    const dataverseInfoRepositoryStub: IDataverseInfoRepository = {} as IDataverseInfoRepository
    dataverseInfoRepositoryStub.getMaxEmbargoDurationInMonths = jest
      .fn()
      .mockResolvedValue(testDuration)

    const sut = new GetMaxEmbargoDurationInMonths(dataverseInfoRepositoryStub)

    const actual = await sut.execute()

    expect(actual).toBe(testDuration)
  })

  test('should return error result on repository error', async () => {
    const dataverseInfoRepositoryStub: IDataverseInfoRepository = {} as IDataverseInfoRepository
    dataverseInfoRepositoryStub.getMaxEmbargoDurationInMonths = jest
      .fn()
      .mockRejectedValue(new ReadError())
    const sut = new GetMaxEmbargoDurationInMonths(dataverseInfoRepositoryStub)

    await expect(sut.execute()).rejects.toBeInstanceOf(ReadError)
  })
})
