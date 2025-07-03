import { GetCollection } from '../../../src/collections/domain/useCases/GetCollection'
import { ICollectionsRepository } from '../../../src/collections/domain/repositories/ICollectionsRepository'
import { ReadError } from '../../../src'
import { createCollectionModel } from '../../testHelpers/collections/collectionHelper'

describe('execute', () => {
  test('should return collection on repository success', async () => {
    const testCollection = createCollectionModel()
    const collectionRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionRepositoryStub.getCollection = jest.fn().mockResolvedValue(testCollection)
    const testGetCollection = new GetCollection(collectionRepositoryStub)

    const actual = await testGetCollection.execute(1)

    expect(actual).toEqual(testCollection)
  })

  test('should return error result on repository error', async () => {
    const collectionRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionRepositoryStub.getCollection = jest.fn().mockRejectedValue(new ReadError())
    const testGetCollection = new GetCollection(collectionRepositoryStub)

    await expect(testGetCollection.execute(1)).rejects.toThrow(ReadError)
  })
})
