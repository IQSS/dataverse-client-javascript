import { WriteError } from '../../../src'
import { ICollectionsRepository } from '../../../src/collections/domain/repositories/ICollectionsRepository'
import { DeleteCollectionStorageDriver } from '../../../src/collections/domain/useCases/DeleteCollectionStorageDriver'

describe('DeleteCollectionStorageDriver (unit)', () => {
  test('should delete collection storage driver on repository success', async () => {
    const collectionsRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionsRepositoryStub.deleteCollectionStorageDriver = jest
      .fn()
      .mockResolvedValue('Storage driver cleared. Falling back to default: local')
    const sut = new DeleteCollectionStorageDriver(collectionsRepositoryStub)

    const actual = await sut.execute('test-collection')

    expect(actual).toBe('Storage driver cleared. Falling back to default: local')
    expect(collectionsRepositoryStub.deleteCollectionStorageDriver).toHaveBeenCalledWith(
      'test-collection'
    )
  })

  test('should return error result on repository error', async () => {
    const collectionsRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionsRepositoryStub.deleteCollectionStorageDriver = jest
      .fn()
      .mockRejectedValue(new WriteError('[404] Collection not found'))
    const sut = new DeleteCollectionStorageDriver(collectionsRepositoryStub)

    await expect(sut.execute('test-collection')).rejects.toThrow(WriteError)
  })
})
