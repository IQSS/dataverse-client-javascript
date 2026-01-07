import { GetTemplate } from '../../../src/template/domain/useCases/GetTemplate'
import { ITemplatesRepository } from '../../../src/template/domain/repositories/ITemplatesRepository'
import { DatasetTemplate } from '../../../src/template/domain/models/DatasetTemplate'
import { ReadError } from '../../../src'

describe('execute', () => {
  const templateId = 123
  const template = { id: templateId } as DatasetTemplate

  test('should return a dataset template', async () => {
    const templatesRepositoryStub: ITemplatesRepository = {} as ITemplatesRepository
    templatesRepositoryStub.getTemplate = jest.fn().mockResolvedValue(template)
    const sut = new GetTemplate(templatesRepositoryStub)

    const actual = await sut.execute(templateId)

    expect(templatesRepositoryStub.getTemplate).toHaveBeenCalledWith(templateId)
    expect(actual).toBe(template)
  })

  test('should return error result on repository error', async () => {
    const templatesRepositoryStub: ITemplatesRepository = {} as ITemplatesRepository
    templatesRepositoryStub.getTemplate = jest.fn().mockRejectedValue(new ReadError())
    const sut = new GetTemplate(templatesRepositoryStub)

    await expect(sut.execute(templateId)).rejects.toThrow(ReadError)
  })
})
