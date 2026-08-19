import { CreatePreviewUrl } from '../../../src/datasets/domain/useCases/previewUrl/CreatePreviewUrl'
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'
import { PreviewUrl } from '../../../src/datasets/domain/models/PreviewUrl'

describe('execute', () => {
  const testPreviewUrl: PreviewUrl = {
    token: 'testToken',
    link: 'http://dataverse.com/previewurl.xhtml?token=testToken',
    isAnonymizedAccess: false
  }

  test('should return the created PreviewUrl on repository success', async () => {
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.createPreviewUrl = jest.fn().mockResolvedValue(testPreviewUrl)
    const sut = new CreatePreviewUrl(datasetsRepositoryStub)

    const actual = await sut.execute(1)

    expect(actual).toEqual(testPreviewUrl)
    expect(datasetsRepositoryStub.createPreviewUrl).toHaveBeenCalledWith(1, undefined)
  })

  test('should forward the anonymizedAccess flag to the repository when provided', async () => {
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.createPreviewUrl = jest.fn().mockResolvedValue(testPreviewUrl)
    const sut = new CreatePreviewUrl(datasetsRepositoryStub)

    const actual = await sut.execute(1, true)

    expect(actual).toEqual(testPreviewUrl)
    expect(datasetsRepositoryStub.createPreviewUrl).toHaveBeenCalledWith(1, true)
  })

  test('should return error result on repository error', async () => {
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.createPreviewUrl = jest.fn().mockRejectedValue(new ReadError())
    const sut = new CreatePreviewUrl(datasetsRepositoryStub)

    await expect(sut.execute(1)).rejects.toThrow(ReadError)
  })
})
