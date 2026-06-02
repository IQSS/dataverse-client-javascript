import { WriteError } from '../../../src'
import { UpdateTemplateLicenseTermsDTO } from '../../../src/templates/domain/dtos/UpdateTemplateLicenseTermsDTO'
import { ITemplatesRepository } from '../../../src/templates/domain/repositories/ITemplatesRepository'
import { UpdateTemplateLicenseTerms } from '../../../src/templates/domain/useCases/UpdateTemplateLicenseTerms'

describe('UpdateTemplateLicenseTerms.execute', () => {
  const testTemplateId = 1
  const testPayload = {
    customTerms: {
      termsOfUse: 'custom terms'
    }
  } as UpdateTemplateLicenseTermsDTO

  test('should call repository with provided payload', async () => {
    const templatesRepositoryStub: ITemplatesRepository = {} as ITemplatesRepository
    templatesRepositoryStub.updateTemplateLicenseTerms = jest.fn().mockResolvedValue(undefined)
    const sut = new UpdateTemplateLicenseTerms(templatesRepositoryStub)

    await sut.execute(testTemplateId, testPayload)

    expect(templatesRepositoryStub.updateTemplateLicenseTerms).toHaveBeenCalledWith(
      testTemplateId,
      testPayload
    )
  })

  test('should throw WriteError on repository error', async () => {
    const templatesRepositoryStub: ITemplatesRepository = {} as ITemplatesRepository
    templatesRepositoryStub.updateTemplateLicenseTerms = jest
      .fn()
      .mockRejectedValue(new WriteError())
    const sut = new UpdateTemplateLicenseTerms(templatesRepositoryStub)

    await expect(sut.execute(testTemplateId, testPayload)).rejects.toThrow(WriteError)
  })
})
