import { GetPrivateUrlDatasetCitation } from '../../../src/datasets/domain/useCases/GetPrivateUrlDatasetCitation'
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'

describe('execute', () => {
  const testPrivateUrlToken = 'token'
  test('should return successful result with citation on repository success', async () => {
    const testCitation = 'test citation'
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.getPrivateUrlDatasetCitation = jest.fn().mockResolvedValue(testCitation)
    const sut = new GetPrivateUrlDatasetCitation(datasetsRepositoryStub)

    const actual = await sut.execute(testPrivateUrlToken)

    expect(actual).toEqual(testCitation)
    expect(datasetsRepositoryStub.getPrivateUrlDatasetCitation).toHaveBeenCalledWith(
      testPrivateUrlToken
    )
  })

  test('should return error result on repository error', async () => {
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.getPrivateUrlDatasetCitation = jest
      .fn()
      .mockRejectedValue(new ReadError())
    const sut = new GetPrivateUrlDatasetCitation(datasetsRepositoryStub)

    await expect(sut.execute(testPrivateUrlToken)).rejects.toThrow(ReadError)
  })
})
