import { GetCollectionFacets } from '../../../src/collections/domain/useCases/GetCollectionFacets'
import { ICollectionsRepository } from '../../../src/collections/domain/repositories/ICollectionsRepository'
import { ReadError } from '../../../src'

describe('execute', () => {
  test('should return collection facets on repository success', async () => {
    const testFacets = ['test1', 'test2']
    const collectionRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionRepositoryStub.getCollectionFacets = jest.fn().mockResolvedValue(testFacets)
    const testGetCollectionFacets = new GetCollectionFacets(collectionRepositoryStub)

    const actual = await testGetCollectionFacets.execute(1)

    expect(actual).toEqual(testFacets)
  })

  test('should return error result on repository error', async () => {
    const collectionRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionRepositoryStub.getCollectionFacets = jest.fn().mockRejectedValue(new ReadError())
    const testGetCollectionFacets = new GetCollectionFacets(collectionRepositoryStub)

    await expect(testGetCollectionFacets.execute(1)).rejects.toThrow(ReadError)
  })
})
