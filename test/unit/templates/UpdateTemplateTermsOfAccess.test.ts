import { WriteError } from '../../../src'
import { ITemplatesRepository } from '../../../src/templates/domain/repositories/ITemplatesRepository'
import { UpdateTemplateTermsOfAccess } from '../../../src/templates/domain/useCases/UpdateTemplateTermsOfAccess'
import { TermsOfAccess } from '../../../src/datasets/domain/models/Dataset'

describe('UpdateTemplateTermsOfAccess.execute', () => {
  const testTemplateId = 1
  const testTermsOfAccess = {
    fileAccessRequest: true,
    termsOfAccessForRestrictedFiles: 'restricted'
  } as TermsOfAccess

  test('should call repository with provided terms of access', async () => {
    const templatesRepositoryStub: ITemplatesRepository = {} as ITemplatesRepository
    templatesRepositoryStub.updateTemplateTermsOfAccess = jest.fn().mockResolvedValue(undefined)
    const sut = new UpdateTemplateTermsOfAccess(templatesRepositoryStub)

    await sut.execute(testTemplateId, testTermsOfAccess)

    expect(templatesRepositoryStub.updateTemplateTermsOfAccess).toHaveBeenCalledWith(
      testTemplateId,
      testTermsOfAccess
    )
  })

  test('should throw WriteError on repository error', async () => {
    const templatesRepositoryStub: ITemplatesRepository = {} as ITemplatesRepository
    templatesRepositoryStub.updateTemplateTermsOfAccess = jest
      .fn()
      .mockRejectedValue(new WriteError())
    const sut = new UpdateTemplateTermsOfAccess(templatesRepositoryStub)

    await expect(sut.execute(testTemplateId, testTermsOfAccess)).rejects.toThrow(WriteError)
  })
})
