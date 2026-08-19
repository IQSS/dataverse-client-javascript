import { GetPreviewUrl } from '../../../src/datasets/domain/useCases/previewUrl/GetPreviewUrl'
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'
import { PreviewUrl } from '../../../src/datasets/domain/models/PreviewUrl'

describe('execute', () => {
  const testPreviewUrl: PreviewUrl = {
    token: 'testToken',
    link: 'http://dataverse.com/previewurl.xhtml?token=testToken',
    isAnonymizedAccess: false
  }

  test('should return the PreviewUrl on repository success', async () => {
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.getPreviewUrl = jest.fn().mockResolvedValue(testPreviewUrl)
    const sut = new GetPreviewUrl(datasetsRepositoryStub)

    const actual = await sut.execute(1)

    expect(actual).toEqual(testPreviewUrl)
    expect(datasetsRepositoryStub.getPreviewUrl).toHaveBeenCalledWith(1)
  })

  test('should return error result on repository error', async () => {
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.getPreviewUrl = jest.fn().mockRejectedValue(new ReadError())
    const sut = new GetPreviewUrl(datasetsRepositoryStub)

    await expect(sut.execute(1)).rejects.toThrow(ReadError)
  })
})
