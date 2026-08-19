import { DeletePreviewUrl } from '../../../src/datasets/domain/useCases/previewUrl/DeletePreviewUrl'
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository'
import { WriteError } from '../../../src/core/domain/repositories/WriteError'

describe('execute', () => {
  test('should return nothing on repository success', async () => {
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.deletePreviewUrl = jest.fn().mockResolvedValue(undefined)
    const sut = new DeletePreviewUrl(datasetsRepositoryStub)

    const actual = await sut.execute(1)

    expect(actual).toBeUndefined()
    expect(datasetsRepositoryStub.deletePreviewUrl).toHaveBeenCalledWith(1)
  })

  test('should return error result on repository error', async () => {
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.deletePreviewUrl = jest.fn().mockRejectedValue(new WriteError())
    const sut = new DeletePreviewUrl(datasetsRepositoryStub)

    await expect(sut.execute(1)).rejects.toThrow(WriteError)
  })
})
