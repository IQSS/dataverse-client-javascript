import { GetDefaultContributorRole } from '../../../src/collections/domain/useCases/GetDefaultContributorRole'
import { ICollectionsRepository } from '../../../src/collections/domain/repositories/ICollectionsRepository'
import { ReadError } from '../../../src'
import { createRoleModel } from '../../testHelpers/roles/roleHelper'

describe('GetDefaultContributorRole', () => {
  test('should return the default role on repository success', async () => {
    const role = createRoleModel()
    const collectionRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionRepositoryStub.getDefaultContributorRole = jest.fn().mockResolvedValue(role)
    const testGetDefaultContributorRole = new GetDefaultContributorRole(collectionRepositoryStub)

    const actual = await testGetDefaultContributorRole.execute(1)

    expect(actual).toEqual(role)
  })

  test('should return error result on repository error', async () => {
    const collectionRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionRepositoryStub.getDefaultContributorRole = jest
      .fn()
      .mockRejectedValue(new ReadError())
    const testGetDefaultContributorRole = new GetDefaultContributorRole(collectionRepositoryStub)

    await expect(testGetDefaultContributorRole.execute(1)).rejects.toThrow(ReadError)
  })
})
