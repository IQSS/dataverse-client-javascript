import { GetCollectionStorageDriver } from '../../../src/collections/domain/useCases/GetCollectionStorageDriver'
import { ICollectionsRepository } from '../../../src/collections/domain/repositories/ICollectionsRepository'
import { StorageDriver } from '../../../src/datasets/domain/models/StorageDriver'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'

describe('GetCollectionStorageDriver (unit)', () => {
  const testStorageDriver: StorageDriver = {
    name: 'local',
    type: 'filesystem',
    label: 'Local Storage',
    directUpload: true,
    directDownload: true,
    uploadOutOfBand: false
  }

  test('should return storage driver on repository success', async () => {
    const collectionsRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionsRepositoryStub.getCollectionStorageDriver = jest
      .fn()
      .mockResolvedValue(testStorageDriver)

    const sut = new GetCollectionStorageDriver(collectionsRepositoryStub)

    const actual = await sut.execute('collection-alias')

    expect(actual).toEqual(testStorageDriver)
    expect(actual.name).toBe('local')
    expect(actual.type).toBe('filesystem')
    expect(actual.label).toBe('Local Storage')
    expect(actual.directUpload).toBe(true)
    expect(actual.directDownload).toBe(true)
    expect(actual.uploadOutOfBand).toBe(false)
  })

  test('should pass getEffective flag to repository', async () => {
    const collectionsRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionsRepositoryStub.getCollectionStorageDriver = jest
      .fn()
      .mockResolvedValue(testStorageDriver)

    const sut = new GetCollectionStorageDriver(collectionsRepositoryStub)

    await sut.execute(123, true)

    expect(collectionsRepositoryStub.getCollectionStorageDriver).toHaveBeenCalledWith(123, true)
  })

  test('should throw on repository error', async () => {
    const collectionsRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionsRepositoryStub.getCollectionStorageDriver = jest
      .fn()
      .mockRejectedValue(new ReadError('[404] Collection not found'))

    const sut = new GetCollectionStorageDriver(collectionsRepositoryStub)

    await expect(sut.execute('missing')).rejects.toThrow(ReadError)
  })
})
