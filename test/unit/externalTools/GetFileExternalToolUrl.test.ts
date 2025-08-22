import { WriteError } from '../../../src'
import { IExternalToolsRepository } from '../../../src/externalTools/domain/repositories/IExternalToolsRepository'
import { GetFileExternalToolUrl } from '../../../src/externalTools/domain/useCases/GetFileExternalToolUrl'
import { createFileExternalToolUrlModel } from '../../testHelpers/externalTools/externalToolsHelper'

describe('execute', () => {
  test('should return file external tool url on repository success', async () => {
    const testFileExternalToolUrl = createFileExternalToolUrlModel()
    const externalToolsRepositoryStub: IExternalToolsRepository = {} as IExternalToolsRepository
    externalToolsRepositoryStub.getFileExternalToolUrl = jest
      .fn()
      .mockResolvedValue(testFileExternalToolUrl)
    const sut = new GetFileExternalToolUrl(externalToolsRepositoryStub)

    const actual = await sut.execute(123, 3, { preview: true, locale: 'en' })

    expect(actual).toEqual(testFileExternalToolUrl)
  })

  test('should return error result on repository error', async () => {
    const externalToolsRepositoryStub: IExternalToolsRepository = {} as IExternalToolsRepository
    externalToolsRepositoryStub.getFileExternalToolUrl = jest
      .fn()
      .mockRejectedValue(new WriteError())
    const sut = new GetFileExternalToolUrl(externalToolsRepositoryStub)

    await expect(sut.execute(123, 3, { preview: true, locale: 'en' })).rejects.toThrow(WriteError)
  })
})
