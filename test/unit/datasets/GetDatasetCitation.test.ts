import { GetDatasetCitation } from '../../../src/datasets/domain/useCases/GetDatasetCitation'
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'

describe('execute', () => {
  const testId = 1

  test('should return successful result with citation on repository success', async () => {
    const testCitation = 'test citation'
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.getDatasetCitation = jest.fn().mockResolvedValue(testCitation)
    const sut = new GetDatasetCitation(datasetsRepositoryStub)

    const actual = await sut.execute(testId)

    expect(actual).toEqual(testCitation)
  })

  test('should return error result on repository error', async () => {
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.getDatasetCitation = jest.fn().mockRejectedValue(new ReadError())
    const sut = new GetDatasetCitation(datasetsRepositoryStub)

    await expect(sut.execute(testId)).rejects.toThrow(ReadError)
  })
})
