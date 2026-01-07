import { CreateDatasetTemplate } from '../../../src/template/domain/useCases/CreateDatasetTemplate'
import { ITemplatesRepository } from '../../../src/template/domain/repositories/ITemplatesRepository'
import { CreateDatasetTemplateDTO } from '../../../src/template/domain/dtos/CreateDatasetTemplateDTO'
import { WriteError } from '../../../src'

describe('execute', () => {
  const testTemplateDTO = { name: 't' } as CreateDatasetTemplateDTO
  test('should return undefined when repository call is successful', async () => {
    const templatesRepositoryStub: ITemplatesRepository = {} as ITemplatesRepository
    templatesRepositoryStub.createDatasetTemplate = jest.fn().mockResolvedValue(undefined)
    const sut = new CreateDatasetTemplate(templatesRepositoryStub)

    const actual = await sut.execute(testTemplateDTO)

    expect(templatesRepositoryStub.createDatasetTemplate).toHaveBeenCalledWith(
      ':root',
      testTemplateDTO
    )
    expect(actual).toBeUndefined()
  })

  test('should call repository with provided collection id/alias', async () => {
    const templatesRepositoryStub: ITemplatesRepository = {} as ITemplatesRepository
    templatesRepositoryStub.createDatasetTemplate = jest.fn().mockResolvedValue(undefined)

    const sut = new CreateDatasetTemplate(templatesRepositoryStub)
    const actual = await sut.execute(testTemplateDTO, 'alias123')

    expect(templatesRepositoryStub.createDatasetTemplate).toHaveBeenCalledWith(
      'alias123',
      testTemplateDTO
    )

    expect(actual).toBeUndefined()
  })

  test('should return error result on repository error', async () => {
    const templatesRepositoryStub: ITemplatesRepository = {} as ITemplatesRepository
    templatesRepositoryStub.createDatasetTemplate = jest.fn().mockRejectedValue(new WriteError())
    const testCreateTemplate = new CreateDatasetTemplate(templatesRepositoryStub)

    await expect(testCreateTemplate.execute(testTemplateDTO)).rejects.toThrow(WriteError)
  })
})
