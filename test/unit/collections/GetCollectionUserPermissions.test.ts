import { GetCollectionUserPermissions } from '../../../src/collections/domain/useCases/GetCollectionUserPermissions'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'
import { ICollectionsRepository } from '../../../src/collections/domain/repositories/ICollectionsRepository'
import { createCollectionUserPermissionsModel } from '../../testHelpers/collections/collectionUserPermissionsHelper'

describe('execute', () => {
  const testCollectionAlias = 'test'

  test('should return collection user permissions on repository success', async () => {
    const testCollectionUserPermissions = createCollectionUserPermissionsModel()
    const collectionsRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionsRepositoryStub.getCollectionUserPermissions = jest
      .fn()
      .mockResolvedValue(testCollectionUserPermissions)
    const sut = new GetCollectionUserPermissions(collectionsRepositoryStub)

    const actual = await sut.execute(testCollectionAlias)

    expect(actual).toEqual(testCollectionUserPermissions)
    expect(collectionsRepositoryStub.getCollectionUserPermissions).toHaveBeenCalledWith(
      testCollectionAlias
    )
  })

  test('should return error result on repository error', async () => {
    const collectionsRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionsRepositoryStub.getCollectionUserPermissions = jest
      .fn()
      .mockRejectedValue(new ReadError())
    const sut = new GetCollectionUserPermissions(collectionsRepositoryStub)

    await expect(sut.execute(testCollectionAlias)).rejects.toThrow(ReadError)
  })
})
