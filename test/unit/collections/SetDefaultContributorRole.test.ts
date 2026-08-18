import { ICollectionsRepository } from '../../../src/collections/domain/repositories/ICollectionsRepository'
import { WriteError } from '../../../src'
import { SetDefaultContributorRole } from '../../../src/collections/domain/useCases/SetDefaultContributorRole'
import { RoleAlias } from '../../../src/roles/domain/models/RoleAlias'

describe('execute', () => {
  test('should set default contributor role on repository success', async () => {
    const collectionRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionRepositoryStub.setDefaultContributorRole = jest.fn().mockResolvedValue(undefined)
    const testSetDefaultContributorRole = new SetDefaultContributorRole(collectionRepositoryStub)

    await expect(testSetDefaultContributorRole.execute(1, RoleAlias.CURATOR)).resolves.toBeUndefined()
    expect(collectionRepositoryStub.setDefaultContributorRole).toHaveBeenCalledWith(1, 'curator')
  })

  test('should return error result on repository error', async () => {
    const collectionRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionRepositoryStub.setDefaultContributorRole = jest
      .fn()
      .mockRejectedValue(new WriteError())
    const testSetDefaultContributorRole = new SetDefaultContributorRole(collectionRepositoryStub)

    await expect(testSetDefaultContributorRole.execute(1, RoleAlias.CURATOR)).rejects.toThrow(WriteError)
    expect(collectionRepositoryStub.setDefaultContributorRole).toHaveBeenCalledWith(1, 'curator')
  })
})
