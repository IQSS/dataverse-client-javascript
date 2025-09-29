import { GetExternalTools } from '../../../src/externalTools/domain/useCases/GetExternalTools'
import { IExternalToolsRepository } from '../../../src/externalTools/domain/repositories/IExternalToolsRepository'
import { createExternalToolsModel } from '../../testHelpers/externalTools/externalToolsHelper'
import { ReadError } from '../../../src'

describe('execute', () => {
  test('should return external tools list on repository success', async () => {
    const testExternalTools = createExternalToolsModel()
    const externalToolsRepositoryStub: IExternalToolsRepository = {} as IExternalToolsRepository
    externalToolsRepositoryStub.getExternalTools = jest.fn().mockResolvedValue(testExternalTools)
    const sut = new GetExternalTools(externalToolsRepositoryStub)

    const actual = await sut.execute()

    expect(actual).toEqual(testExternalTools)
  })

  test('should return error result on repository error', async () => {
    const externalToolsRepositoryStub: IExternalToolsRepository = {} as IExternalToolsRepository
    externalToolsRepositoryStub.getExternalTools = jest.fn().mockRejectedValue(new ReadError())
    const sut = new GetExternalTools(externalToolsRepositoryStub)

    await expect(sut.execute()).rejects.toThrow(ReadError)
  })
})
