import { ICollectionsRepository } from '../../../src/collections/domain/repositories/ICollectionsRepository'
import { WriteError } from '../../../src'
import { DeleteCollection } from '../../../src/collections/domain/useCases/DeleteCollection'

describe('execute', () => {
  test('should return undefined on repository success', async () => {
    const collectionRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionRepositoryStub.deleteCollection = jest.fn().mockResolvedValue(undefined)
    const testDeleteCollection = new DeleteCollection(collectionRepositoryStub)

    const actual = await testDeleteCollection.execute(1)

    expect(actual).toEqual(undefined)
  })

  test('should return error result on repository error', async () => {
    const collectionRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionRepositoryStub.deleteCollection = jest.fn().mockRejectedValue(new WriteError())
    const testDeleteCollection = new DeleteCollection(collectionRepositoryStub)

    await expect(testDeleteCollection.execute(1)).rejects.toThrow(WriteError)
  })
})
