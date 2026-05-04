import { GetTemplatesByCollectionId } from '../../../src/templates/domain/useCases/GetTemplatesByCollectionId'
import { ITemplatesRepository } from '../../../src/templates/domain/repositories/ITemplatesRepository'
import { Template } from '../../../src/templates/domain/models/Template'
import { ReadError } from '../../../src'

describe('execute', () => {
  const templates = [{ id: 1 }, { id: 2 }] as Template[]

  test('should return templates for default collection', async () => {
    const templatesRepositoryStub: ITemplatesRepository = {} as ITemplatesRepository
    templatesRepositoryStub.getTemplatesByCollectionId = jest.fn().mockResolvedValue(templates)
    const sut = new GetTemplatesByCollectionId(templatesRepositoryStub)

    const actual = await sut.execute()

    expect(templatesRepositoryStub.getTemplatesByCollectionId).toHaveBeenCalledWith(':root')
    expect(actual).toBe(templates)
  })

  test('should call repository with provided collection id/alias', async () => {
    const templatesRepositoryStub: ITemplatesRepository = {} as ITemplatesRepository
    templatesRepositoryStub.getTemplatesByCollectionId = jest.fn().mockResolvedValue(templates)
    const sut = new GetTemplatesByCollectionId(templatesRepositoryStub)

    const actual = await sut.execute('alias123')

    expect(templatesRepositoryStub.getTemplatesByCollectionId).toHaveBeenCalledWith('alias123')
    expect(actual).toBe(templates)
  })

  test('should return error result on repository error', async () => {
    const templatesRepositoryStub: ITemplatesRepository = {} as ITemplatesRepository
    templatesRepositoryStub.getTemplatesByCollectionId = jest
      .fn()
      .mockRejectedValue(new ReadError())
    const sut = new GetTemplatesByCollectionId(templatesRepositoryStub)

    await expect(sut.execute()).rejects.toThrow(ReadError)
  })
})
