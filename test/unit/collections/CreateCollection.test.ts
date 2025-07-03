import { CreateCollection } from '../../../src/collections/domain/useCases/CreateCollection'
import { ICollectionsRepository } from '../../../src/collections/domain/repositories/ICollectionsRepository'
import { WriteError } from '../../../src'
import { createCollectionDTO } from '../../testHelpers/collections/collectionHelper'

describe('execute', () => {
  const testCollectionDTO = createCollectionDTO()
  const testCollectionId = 1

  test('should return undefined on repository success', async () => {
    const collectionRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionRepositoryStub.createCollection = jest.fn().mockResolvedValue(testCollectionId)
    const testCreateCollection = new CreateCollection(collectionRepositoryStub)

    const actual = await testCreateCollection.execute(testCollectionDTO)

    expect(actual).toEqual(testCollectionId)
  })

  test('should return error result on repository error', async () => {
    const collectionRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionRepositoryStub.createCollection = jest.fn().mockRejectedValue(new WriteError())
    const testCreateCollection = new CreateCollection(collectionRepositoryStub)

    await expect(testCreateCollection.execute(testCollectionDTO)).rejects.toThrow(WriteError)
  })
})
