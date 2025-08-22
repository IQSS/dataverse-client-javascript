import { WriteError } from '../../../src'
import { IExternalToolsRepository } from '../../../src/externalTools/domain/repositories/IExternalToolsRepository'
import { GetDatasetExternalToolUrl } from '../../../src/externalTools/domain/useCases/GetDatasetExternalToolUrl'
import { createFileExternalToolUrlModel } from '../../testHelpers/externalTools/externalToolsHelper'

describe('execute', () => {
  test('should return dataset external tool url on repository success', async () => {
    const testFileExternalToolUrl = createFileExternalToolUrlModel()
    const externalToolsRepositoryStub: IExternalToolsRepository = {} as IExternalToolsRepository
    externalToolsRepositoryStub.getDatasetExternalToolUrl = jest
      .fn()
      .mockResolvedValue(testFileExternalToolUrl)
    const sut = new GetDatasetExternalToolUrl(externalToolsRepositoryStub)

    const actual = await sut.execute(123, 3, { preview: true, locale: 'en' })

    expect(actual).toEqual(testFileExternalToolUrl)
  })

  test('should return error result on repository error', async () => {
    const externalToolsRepositoryStub: IExternalToolsRepository = {} as IExternalToolsRepository
    externalToolsRepositoryStub.getDatasetExternalToolUrl = jest
      .fn()
      .mockRejectedValue(new WriteError())
    const sut = new GetDatasetExternalToolUrl(externalToolsRepositoryStub)

    await expect(sut.execute(123, 3, { preview: true, locale: 'en' })).rejects.toThrow(WriteError)
  })
})
