import { WriteError } from '../../../src'
import { UpdateTemplateMetadataDTO } from '../../../src/templates/domain/dtos/UpdateTemplateMetadataDTO'
import { ITemplatesRepository } from '../../../src/templates/domain/repositories/ITemplatesRepository'
import { UpdateTemplateMetadata } from '../../../src/templates/domain/useCases/UpdateTemplateMetadata'

describe('UpdateTemplateMetadata.execute', () => {
  const testTemplateId = 1
  const testPayload = { name: 'updated template name' } as UpdateTemplateMetadataDTO

  test('should call repository with replace=false by default', async () => {
    const templatesRepositoryStub: ITemplatesRepository = {} as ITemplatesRepository
    templatesRepositoryStub.updateTemplateMetadata = jest.fn().mockResolvedValue(undefined)
    const sut = new UpdateTemplateMetadata(templatesRepositoryStub)

    await sut.execute(testTemplateId, testPayload)

    expect(templatesRepositoryStub.updateTemplateMetadata).toHaveBeenCalledWith(
      testTemplateId,
      testPayload,
      false
    )
  })

  test('should call repository with provided replace flag', async () => {
    const templatesRepositoryStub: ITemplatesRepository = {} as ITemplatesRepository
    templatesRepositoryStub.updateTemplateMetadata = jest.fn().mockResolvedValue(undefined)
    const sut = new UpdateTemplateMetadata(templatesRepositoryStub)

    await sut.execute(testTemplateId, testPayload, true)

    expect(templatesRepositoryStub.updateTemplateMetadata).toHaveBeenCalledWith(
      testTemplateId,
      testPayload,
      true
    )
  })

  test('should throw WriteError on repository error', async () => {
    const templatesRepositoryStub: ITemplatesRepository = {} as ITemplatesRepository
    templatesRepositoryStub.updateTemplateMetadata = jest.fn().mockRejectedValue(new WriteError())
    const sut = new UpdateTemplateMetadata(templatesRepositoryStub)

    await expect(sut.execute(testTemplateId, testPayload)).rejects.toThrow(WriteError)
  })
})
