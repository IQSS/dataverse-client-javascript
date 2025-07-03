import { DeleteDatasetDraft } from '../../../src/datasets/domain/useCases/DeleteDatasetDraft'
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository'
import { WriteError } from '../../../src'

describe('execute', () => {
  test('should return undefined on delete success', async () => {
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.deleteDatasetDraft = jest.fn().mockResolvedValue(undefined)
    const sut = new DeleteDatasetDraft(datasetsRepositoryStub)

    const actual = await sut.execute(1)
    expect(actual).toEqual(undefined)
  })

  test('should return error result on delete error', async () => {
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.deleteDatasetDraft = jest.fn().mockRejectedValue(new WriteError())
    const sut = new DeleteDatasetDraft(datasetsRepositoryStub)

    const nonExistentDatasetId = 111
    await expect(sut.execute(nonExistentDatasetId)).rejects.toThrow(WriteError)
  })
})
