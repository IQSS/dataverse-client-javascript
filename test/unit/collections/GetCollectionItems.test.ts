import { GetCollectionItems } from '../../../src/collections/domain/useCases/GetCollectionItems'
import { ICollectionsRepository } from '../../../src/collections/domain/repositories/ICollectionsRepository'
import { ReadError } from '../../../src'
import { createDatasetPreviewModel } from '../../testHelpers/datasets/datasetPreviewHelper'
import { createFilePreviewModel } from '../../testHelpers/files/filePreviewHelper'
import { CollectionItemSubset } from '../../../src/collections/domain/models/CollectionItemSubset'
import { createCollectionPreviewModel } from '../../testHelpers/collections/collectionPreviewHelper'

describe('execute', () => {
  test('should return item subset on repository success', async () => {
    const testItems = [
      createDatasetPreviewModel(),
      createFilePreviewModel(),
      createCollectionPreviewModel()
    ]
    const testTotalCount = 3

    const testItemSubset: CollectionItemSubset = {
      items: testItems,
      totalItemCount: testTotalCount
    }

    const collectionRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionRepositoryStub.getCollectionItems = jest.fn().mockResolvedValue(testItemSubset)
    const testGetCollectionItems = new GetCollectionItems(collectionRepositoryStub)

    const actual = await testGetCollectionItems.execute()

    expect(actual).toEqual(testItemSubset)
  })

  test('should return error result on repository error', async () => {
    const collectionRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionRepositoryStub.getCollectionItems = jest.fn().mockRejectedValue(new ReadError())
    const testGetCollectionItems = new GetCollectionItems(collectionRepositoryStub)

    await expect(testGetCollectionItems.execute()).rejects.toThrow(ReadError)
  })
})
