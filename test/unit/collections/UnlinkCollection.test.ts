import { ICollectionsRepository } from '../../../src/collections/domain/repositories/ICollectionsRepository'
import { WriteError } from '../../../src'
import { UnlinkCollection } from '../../../src/collections/domain/useCases/UnlinkCollection'

describe('execute', () => {
  test('should unlink collection successfully on repository success', async () => {
    const collectionRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionRepositoryStub.unlinkCollection = jest.fn().mockResolvedValue(undefined)

    const testUnlinkCollection = new UnlinkCollection(collectionRepositoryStub)

    await expect(testUnlinkCollection.execute(1, 2)).resolves.toBeUndefined()
    expect(collectionRepositoryStub.unlinkCollection).toHaveBeenCalledWith(1, 2)
  })

  test('should throw error on repository failure', async () => {
    const collectionRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionRepositoryStub.unlinkCollection = jest.fn().mockRejectedValue(new WriteError())

    const testUnlinkCollection = new UnlinkCollection(collectionRepositoryStub)

    await expect(testUnlinkCollection.execute(1, 2)).rejects.toThrow(WriteError)
    expect(collectionRepositoryStub.unlinkCollection).toHaveBeenCalledWith(1, 2)
  })
})
