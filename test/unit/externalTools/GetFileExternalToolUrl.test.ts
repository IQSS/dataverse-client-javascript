import { WriteError } from '../../../src'
import { IExternalToolsRepository } from '../../../src/externalTools/domain/repositories/IExternalToolsRepository'
import { GetFileExternalToolResolved } from '../../../src/externalTools/domain/useCases/GetFileExternalToolResolved'
import { createFileExternalToolResolvedModel } from '../../testHelpers/externalTools/externalToolsHelper'

describe('execute', () => {
  test('should return file external tool resolved on repository success', async () => {
    const testFileExternalToolResolved = createFileExternalToolResolvedModel()
    const externalToolsRepositoryStub: IExternalToolsRepository = {} as IExternalToolsRepository
    externalToolsRepositoryStub.getFileExternalToolResolved = jest
      .fn()
      .mockResolvedValue(testFileExternalToolResolved)
    const sut = new GetFileExternalToolResolved(externalToolsRepositoryStub)

    const actual = await sut.execute(123, 3, { preview: true, locale: 'en' })

    expect(actual).toEqual(testFileExternalToolResolved)
  })

  test('should return error result on repository error', async () => {
    const externalToolsRepositoryStub: IExternalToolsRepository = {} as IExternalToolsRepository
    externalToolsRepositoryStub.getFileExternalToolResolved = jest
      .fn()
      .mockRejectedValue(new WriteError())
    const sut = new GetFileExternalToolResolved(externalToolsRepositoryStub)

    await expect(sut.execute(123, 3, { preview: true, locale: 'en' })).rejects.toThrow(WriteError)
  })
})
