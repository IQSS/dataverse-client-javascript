import { SetDefaultTemplate } from '../../../src/templates/domain/useCases/SetDefaultTemplate'
import { ITemplatesRepository } from '../../../src/templates/domain/repositories/ITemplatesRepository'
import { WriteError } from '../../../src'

describe('execute', () => {
  const templateId = 123

  test('should set default template for :root', async () => {
    const templatesRepositoryStub: ITemplatesRepository = {} as ITemplatesRepository
    templatesRepositoryStub.setDefaultTemplate = jest.fn().mockResolvedValue(undefined)
    const sut = new SetDefaultTemplate(templatesRepositoryStub)

    const actual = await sut.execute(templateId)

    expect(templatesRepositoryStub.setDefaultTemplate).toHaveBeenCalledWith(':root', templateId)
    expect(actual).toBeUndefined()
  })

  test('should call repository with provided collection id/alias', async () => {
    const templatesRepositoryStub: ITemplatesRepository = {} as ITemplatesRepository
    templatesRepositoryStub.setDefaultTemplate = jest.fn().mockResolvedValue(undefined)
    const sut = new SetDefaultTemplate(templatesRepositoryStub)

    const actual = await sut.execute(templateId, 'alias123')

    expect(templatesRepositoryStub.setDefaultTemplate).toHaveBeenCalledWith('alias123', templateId)
    expect(actual).toBeUndefined()
  })

  test('should return error result on repository error', async () => {
    const templatesRepositoryStub: ITemplatesRepository = {} as ITemplatesRepository
    templatesRepositoryStub.setDefaultTemplate = jest.fn().mockRejectedValue(new WriteError())
    const sut = new SetDefaultTemplate(templatesRepositoryStub)

    await expect(sut.execute(templateId)).rejects.toThrow(WriteError)
  })
})
