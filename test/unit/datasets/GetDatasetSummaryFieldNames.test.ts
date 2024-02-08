import { GetDatasetSummaryFieldNames } from '../../../src/datasets/domain/useCases/GetDatasetSummaryFieldNames'
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'
import { createSandbox, SinonSandbox } from 'sinon'

describe('execute', () => {
  const sandbox: SinonSandbox = createSandbox()

  afterEach(() => {
    sandbox.restore()
  })

  test('should return successful result with field names on repository success', async () => {
    const testFieldNames = ['test1', 'test2']
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.getDatasetSummaryFieldNames = jest.fn().mockResolvedValue(testFieldNames)
    const sut = new GetDatasetSummaryFieldNames(datasetsRepositoryStub)

    const actual = await sut.execute()

    expect(actual).toEqual(testFieldNames)
  })

  test('should return error result on repository error', async () => {
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.getDatasetSummaryFieldNames = jest
      .fn()
      .mockRejectedValue(new ReadError())
    const sut = new GetDatasetSummaryFieldNames(datasetsRepositoryStub)

    await expect(sut.execute()).rejects.toThrow(ReadError)
  })
})
