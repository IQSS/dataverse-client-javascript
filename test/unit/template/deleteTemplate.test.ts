import { DeleteTemplate } from '../../../src/template/domain/useCases/DeleteTemplate'
import { ITemplatesRepository } from '../../../src/template/domain/repositories/ITemplatesRepository'
import { WriteError } from '../../../src'

describe('execute', () => {
  const templateId = 123

  test('should delete a dataset template', async () => {
    const templatesRepositoryStub: ITemplatesRepository = {} as ITemplatesRepository
    templatesRepositoryStub.deleteTemplate = jest.fn().mockResolvedValue(undefined)
    const sut = new DeleteTemplate(templatesRepositoryStub)

    const actual = await sut.execute(templateId)

    expect(templatesRepositoryStub.deleteTemplate).toHaveBeenCalledWith(templateId)
    expect(actual).toBeUndefined()
  })

  test('should return error result on repository error', async () => {
    const templatesRepositoryStub: ITemplatesRepository = {} as ITemplatesRepository
    templatesRepositoryStub.deleteTemplate = jest.fn().mockRejectedValue(new WriteError())
    const sut = new DeleteTemplate(templatesRepositoryStub)

    await expect(sut.execute(templateId)).rejects.toThrow(WriteError)
  })
})
