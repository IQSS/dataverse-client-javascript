import { UpdateCollection } from '../../../src/collections/domain/useCases/UpdateCollection'
import { createCollectionDTO } from '../../testHelpers/collections/collectionHelper'
import { WriteError } from '../../../src'
import { ICollectionsRepository } from '../../../src/collections/domain/repositories/ICollectionsRepository'

describe('execute', () => {
  const testCollection = createCollectionDTO()

  test('should return undefined when repository call is successful', async () => {
    const collectionsRepositoryStub = <ICollectionsRepository>{}
    collectionsRepositoryStub.updateCollection = jest.fn().mockResolvedValue(undefined)

    const sut = new UpdateCollection(collectionsRepositoryStub)

    const actual = await sut.execute(1, testCollection)

    expect(actual).toEqual(undefined)
  })

  test('should throw WriteError when the repository raises an error', async () => {
    const collectionsRepositoryStub = <ICollectionsRepository>{}
    const testWriteError = new WriteError('Test error')
    collectionsRepositoryStub.updateCollection = jest.fn().mockRejectedValue(testWriteError)

    const sut = new UpdateCollection(collectionsRepositoryStub)
    await expect(sut.execute(1, testCollection)).rejects.toThrow(testWriteError)
  })
})
