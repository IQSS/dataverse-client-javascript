import { DeleteDataset } from '../../../src/datasets/domain/useCases/DeleteDataset'
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository'
import { WriteError } from '../../../src'

describe('execute', () => {
  test('should return undefined on delete success', async () => {
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.deleteDataset = jest.fn().mockResolvedValue(undefined)
    const sut = new DeleteDataset(datasetsRepositoryStub)

    const actual = await sut.execute(1)
    expect(actual).toEqual(undefined)
  })

  test('should return error result on delete error', async () => {
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.deleteDataset = jest.fn().mockRejectedValue(new WriteError())
    const sut = new DeleteDataset(datasetsRepositoryStub)

    const nonExistentDatasetId = 111
    await expect(sut.execute(nonExistentDatasetId)).rejects.toThrow(WriteError)
  })
})
