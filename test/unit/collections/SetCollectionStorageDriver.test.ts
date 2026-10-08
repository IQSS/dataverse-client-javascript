import { WriteError } from '../../../src'
import { ICollectionsRepository } from '../../../src/collections/domain/repositories/ICollectionsRepository'
import { SetCollectionStorageDriver } from '../../../src/collections/domain/useCases/SetCollectionStorageDriver'

describe('SetCollectionStorageDriver (unit)', () => {
  test('should set collection storage driver on repository success', async () => {
    const collectionsRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionsRepositoryStub.setCollectionStorageDriver = jest
      .fn()
      .mockResolvedValue('Storage set to: local/Local Storage')
    const sut = new SetCollectionStorageDriver(collectionsRepositoryStub)

    const actual = await sut.execute('test-collection', 'Local Storage')

    expect(actual).toBe('Storage set to: local/Local Storage')
    expect(collectionsRepositoryStub.setCollectionStorageDriver).toHaveBeenCalledWith(
      'test-collection',
      'Local Storage'
    )
  })

  test('should return error result on repository error', async () => {
    const collectionsRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionsRepositoryStub.setCollectionStorageDriver = jest
      .fn()
      .mockRejectedValue(new WriteError('[403] Permission denied'))
    const sut = new SetCollectionStorageDriver(collectionsRepositoryStub)

    await expect(sut.execute('test-collection', 'Local Storage')).rejects.toThrow(WriteError)
  })
})
