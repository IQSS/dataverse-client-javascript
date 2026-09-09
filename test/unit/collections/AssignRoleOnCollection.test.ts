import { ICollectionsRepository } from '../../../src/collections/domain/repositories/ICollectionsRepository'
import { WriteError } from '../../../src'
import { AssignRoleOnCollection } from '../../../src/collections/domain/useCases/AssignRoleOnCollection'

describe('execute', () => {
  test('should assign role successfully on repository success', async () => {
    const collectionRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionRepositoryStub.assignRoleOnCollection = jest.fn().mockResolvedValue(123)

    const testAssignRoleOnCollection = new AssignRoleOnCollection(collectionRepositoryStub)

    await expect(testAssignRoleOnCollection.execute(1, "@testUser", "curator")).resolves.toBe(123)
    expect(collectionRepositoryStub.assignRoleOnCollection).toHaveBeenCalledWith(1, "@testUser", "curator")
  })

  test('should throw error on repository failure', async () => {
    const collectionRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionRepositoryStub.assignRoleOnCollection = jest.fn().mockRejectedValue(new WriteError())

    const testAssignRoleOnCollection = new AssignRoleOnCollection(collectionRepositoryStub)

    await expect(testAssignRoleOnCollection.execute(1, "@testUser", "curator")).rejects.toThrow(WriteError)
    expect(collectionRepositoryStub.assignRoleOnCollection).toHaveBeenCalledWith(1, "@testUser", "curator")
  })
})
