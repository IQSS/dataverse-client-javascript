import { DeleteDatasetType } from '../../../src/datasets/domain/useCases/DeleteDatasetType'
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository'
import { WriteError } from '../../../src'

describe('execute', () => {
  test('should return undefined on delete success', async () => {
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.deleteDatasetType = jest.fn().mockResolvedValue(undefined)
    const sut = new DeleteDatasetType(datasetsRepositoryStub)

    const actual = await sut.execute(1)
    expect(actual).toEqual(undefined)
  })

  test('should return error result on delete error', async () => {
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.deleteDatasetType = jest.fn().mockRejectedValue(new WriteError())
    const sut = new DeleteDatasetType(datasetsRepositoryStub)

    const nonExistentDatasetTypeId = 111
    await expect(sut.execute(nonExistentDatasetTypeId)).rejects.toThrow(WriteError)
  })
})
