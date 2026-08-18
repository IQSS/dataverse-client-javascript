import { UnsetTemplateAsDefault } from '../../../src/templates/domain/useCases/UnsetTemplateAsDefault'
import { ITemplatesRepository } from '../../../src/templates/domain/repositories/ITemplatesRepository'
import { WriteError } from '../../../src'

describe('execute', () => {
  test('should remove default template for :root', async () => {
    const templatesRepositoryStub: ITemplatesRepository = {} as ITemplatesRepository
    templatesRepositoryStub.unsetTemplateAsDefault = jest.fn().mockResolvedValue(undefined)
    const sut = new UnsetTemplateAsDefault(templatesRepositoryStub)

    const actual = await sut.execute()

    expect(templatesRepositoryStub.unsetTemplateAsDefault).toHaveBeenCalledWith(':root')
    expect(actual).toBeUndefined()
  })

  test('should call repository with provided collection id/alias', async () => {
    const templatesRepositoryStub: ITemplatesRepository = {} as ITemplatesRepository
    templatesRepositoryStub.unsetTemplateAsDefault = jest.fn().mockResolvedValue(undefined)
    const sut = new UnsetTemplateAsDefault(templatesRepositoryStub)

    const actual = await sut.execute('alias123')

    expect(templatesRepositoryStub.unsetTemplateAsDefault).toHaveBeenCalledWith('alias123')
    expect(actual).toBeUndefined()
  })

  test('should return error result on repository error', async () => {
    const templatesRepositoryStub: ITemplatesRepository = {} as ITemplatesRepository
    templatesRepositoryStub.unsetTemplateAsDefault = jest.fn().mockRejectedValue(new WriteError())
    const sut = new UnsetTemplateAsDefault(templatesRepositoryStub)

    await expect(sut.execute()).rejects.toThrow(WriteError)
  })
})
