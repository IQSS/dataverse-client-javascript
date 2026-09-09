import { ICollectionsRepository } from '../../../src/collections/domain/repositories/ICollectionsRepository'
import { WriteError } from '../../../src'
import { UnassignRoleOnCollection } from '../../../src/collections/domain/useCases/UnassignRoleOnCollection'

describe('execute', () => {
  test('should unassign role successfully on repository success', async () => {
    const collectionRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionRepositoryStub.unassignRoleOnCollection = jest.fn().mockResolvedValue(undefined)

    const testUnassignRoleOnCollection = new UnassignRoleOnCollection(collectionRepositoryStub)

    await expect(testUnassignRoleOnCollection.execute(1, 2)).resolves.toBeUndefined()
    expect(collectionRepositoryStub.unassignRoleOnCollection).toHaveBeenCalledWith(1, 2)
  })

  test('should throw error on repository failure', async () => {
    const collectionRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionRepositoryStub.unassignRoleOnCollection = jest.fn().mockRejectedValue(new WriteError())

    const testUnassignRoleOnCollection = new UnassignRoleOnCollection(collectionRepositoryStub)

    await expect(testUnassignRoleOnCollection.execute(1, 2)).rejects.toThrow(WriteError)
    expect(collectionRepositoryStub.unassignRoleOnCollection).toHaveBeenCalledWith(1, 2)
  })
})
