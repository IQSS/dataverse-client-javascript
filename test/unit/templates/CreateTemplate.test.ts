import { CreateTemplate } from '../../../src/templates/domain/useCases/CreateTemplate'
import { ITemplatesRepository } from '../../../src/templates/domain/repositories/ITemplatesRepository'
import { CreateTemplateDTO } from '../../../src/templates/domain/dtos/CreateTemplateDTO'
import { WriteError } from '../../../src'

describe('execute', () => {
  const testTemplateDTO = { name: 't' } as CreateTemplateDTO
  test('should return undefined when repository call is successful', async () => {
    const templatesRepositoryStub: ITemplatesRepository = {} as ITemplatesRepository
    templatesRepositoryStub.createTemplate = jest.fn().mockResolvedValue(undefined)
    const sut = new CreateTemplate(templatesRepositoryStub)

    const actual = await sut.execute(testTemplateDTO)

    expect(templatesRepositoryStub.createTemplate).toHaveBeenCalledWith(':root', testTemplateDTO)
    expect(actual).toBeUndefined()
  })

  test('should call repository with provided collection id/alias', async () => {
    const templatesRepositoryStub: ITemplatesRepository = {} as ITemplatesRepository
    templatesRepositoryStub.createTemplate = jest.fn().mockResolvedValue(undefined)

    const sut = new CreateTemplate(templatesRepositoryStub)
    const actual = await sut.execute(testTemplateDTO, 'alias123')

    expect(templatesRepositoryStub.createTemplate).toHaveBeenCalledWith('alias123', testTemplateDTO)

    expect(actual).toBeUndefined()
  })

  test('should return error result on repository error', async () => {
    const templatesRepositoryStub: ITemplatesRepository = {} as ITemplatesRepository
    templatesRepositoryStub.createTemplate = jest.fn().mockRejectedValue(new WriteError())
    const testCreateTemplate = new CreateTemplate(templatesRepositoryStub)

    await expect(testCreateTemplate.execute(testTemplateDTO)).rejects.toThrow(WriteError)
  })
})
