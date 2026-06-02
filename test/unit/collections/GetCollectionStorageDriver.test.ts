import { ReadError } from '../../../src'
import { ICollectionsRepository } from '../../../src/collections/domain/repositories/ICollectionsRepository'
import { GetCollectionStorageDriver } from '../../../src/collections/domain/useCases/GetCollectionStorageDriver'
import { StorageDriver } from '../../../src/core/domain/models/StorageDriver'

describe('GetCollectionStorageDriver (unit)', () => {
  const testStorageDriver: StorageDriver = {
    name: 'local',
    type: 'filesystem',
    label: 'Local Storage',
    directUpload: true,
    directDownload: true,
    uploadOutOfBand: false
  }

  test('should return collection storage driver on repository success', async () => {
    const collectionsRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionsRepositoryStub.getCollectionStorageDriver = jest
      .fn()
      .mockResolvedValue(testStorageDriver)
    const sut = new GetCollectionStorageDriver(collectionsRepositoryStub)

    const actual = await sut.execute('test-collection')

    expect(actual).toEqual(testStorageDriver)
    expect(collectionsRepositoryStub.getCollectionStorageDriver).toHaveBeenCalledWith(
      'test-collection',
      false
    )
  })

  test('should request effective storage driver when requested', async () => {
    const collectionsRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionsRepositoryStub.getCollectionStorageDriver = jest
      .fn()
      .mockResolvedValue(testStorageDriver)
    const sut = new GetCollectionStorageDriver(collectionsRepositoryStub)

    await sut.execute('test-collection', true)

    expect(collectionsRepositoryStub.getCollectionStorageDriver).toHaveBeenCalledWith(
      'test-collection',
      true
    )
  })

  test('should return error result on repository error', async () => {
    const collectionsRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionsRepositoryStub.getCollectionStorageDriver = jest
      .fn()
      .mockRejectedValue(new ReadError('[404] Collection not found'))
    const sut = new GetCollectionStorageDriver(collectionsRepositoryStub)

    await expect(sut.execute('test-collection')).rejects.toThrow(ReadError)
  })
})
