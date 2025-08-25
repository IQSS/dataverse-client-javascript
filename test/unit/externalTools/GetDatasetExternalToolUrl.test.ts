import { WriteError } from '../../../src'
import { IExternalToolsRepository } from '../../../src/externalTools/domain/repositories/IExternalToolsRepository'
import { GetDatasetExternalToolResolved } from '../../../src/externalTools/domain/useCases/GetDatasetExternalToolResolved'
import { createDatasetExternalToolResolvedModel } from '../../testHelpers/externalTools/externalToolsHelper'

describe('execute', () => {
  test('should return dataset external tool resolved on repository success', async () => {
    const testDatasetExternalToolResolved = createDatasetExternalToolResolvedModel()
    const externalToolsRepositoryStub: IExternalToolsRepository = {} as IExternalToolsRepository
    externalToolsRepositoryStub.getDatasetExternalToolResolved = jest
      .fn()
      .mockResolvedValue(testDatasetExternalToolResolved)
    const sut = new GetDatasetExternalToolResolved(externalToolsRepositoryStub)

    const actual = await sut.execute(123, 3, { preview: true, locale: 'en' })

    expect(actual).toEqual(testDatasetExternalToolResolved)
  })

  test('should return error result on repository error', async () => {
    const externalToolsRepositoryStub: IExternalToolsRepository = {} as IExternalToolsRepository
    externalToolsRepositoryStub.getDatasetExternalToolResolved = jest
      .fn()
      .mockRejectedValue(new WriteError())
    const sut = new GetDatasetExternalToolResolved(externalToolsRepositoryStub)

    await expect(sut.execute(123, 3, { preview: true, locale: 'en' })).rejects.toThrow(WriteError)
  })
})
