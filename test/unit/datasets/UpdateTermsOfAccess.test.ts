import { WriteError } from '../../../src'
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository'
import { UpdateTermsOfAccess } from '../../../src/datasets/domain/useCases/UpdateTermsOfAccess'
import { TermsOfAccess } from '../../../src/datasets/domain/models/Dataset'

describe('UpdateTermsOfAccess (unit)', () => {
  test('should return undefined on updating TermsOfAccess with repository success', async () => {
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.updateTermsOfAccess = jest.fn().mockResolvedValue(undefined)

    const sut = new UpdateTermsOfAccess(datasetsRepositoryStub)
    const termsOfAccess: TermsOfAccess = {
      fileAccessRequest: true,
      termsOfAccessForRestrictedFiles: 'Your terms',
      dataAccessPlace: 'Place'
    }

    const actual = await sut.execute(1, termsOfAccess)
    expect(actual).toEqual(undefined)
  })

  test('should return error result on updating TermsOfAccess with repository error', async () => {
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.updateTermsOfAccess = jest.fn().mockRejectedValue(new WriteError())
    const sut = new UpdateTermsOfAccess(datasetsRepositoryStub)

    const nonExistentDatasetId = 111111
    await expect(
      sut.execute(nonExistentDatasetId, {
        fileAccessRequest: true
      })
    ).rejects.toThrow(WriteError)
  })
})
