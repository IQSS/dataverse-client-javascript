import { ICollectionsRepository } from '../../../src/collections/domain/repositories/ICollectionsRepository'
import { WriteError } from '../../../src'
import { LinkCollection } from '../../../src/collections/domain/useCases/LinkCollection'

describe('execute', () => {
  test('should link collection successfully on repository success', async () => {
    const collectionRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionRepositoryStub.linkCollection = jest.fn().mockResolvedValue(undefined)

    const testLinkCollection = new LinkCollection(collectionRepositoryStub)

    await expect(testLinkCollection.execute(1, 2)).resolves.toBeUndefined()
    expect(collectionRepositoryStub.linkCollection).toHaveBeenCalledWith(1, 2)
  })

  test('should throw error on repository failure', async () => {
    const collectionRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionRepositoryStub.linkCollection = jest.fn().mockRejectedValue(new WriteError())

    const testLinkCollection = new LinkCollection(collectionRepositoryStub)

    await expect(testLinkCollection.execute(1, 2)).rejects.toThrow(WriteError)
    expect(collectionRepositoryStub.linkCollection).toHaveBeenCalledWith(1, 2)
  })
})
