import { ReadError } from '../../../src'
import { AllowedStorageDrivers } from '../../../src/collections/domain/models/AllowedStorageDrivers'
import { ICollectionsRepository } from '../../../src/collections/domain/repositories/ICollectionsRepository'
import { GetAllowedCollectionStorageDrivers } from '../../../src/collections/domain/useCases/GetAllowedCollectionStorageDrivers'

describe('GetAllowedCollectionStorageDrivers (unit)', () => {
  const testStorageDrivers: AllowedStorageDrivers = {
    Filesystem: 'file1',
    LocalStack: 'localstack1'
  }

  test('should return allowed collection storage drivers on repository success', async () => {
    const collectionsRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionsRepositoryStub.getAllowedCollectionStorageDrivers = jest
      .fn()
      .mockResolvedValue(testStorageDrivers)
    const sut = new GetAllowedCollectionStorageDrivers(collectionsRepositoryStub)

    const actual = await sut.execute('test-collection')

    expect(actual).toEqual(testStorageDrivers)
    expect(collectionsRepositoryStub.getAllowedCollectionStorageDrivers).toHaveBeenCalledWith(
      'test-collection'
    )
  })

  test('should return error result on repository error', async () => {
    const collectionsRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionsRepositoryStub.getAllowedCollectionStorageDrivers = jest
      .fn()
      .mockRejectedValue(new ReadError('[404] Collection not found'))
    const sut = new GetAllowedCollectionStorageDrivers(collectionsRepositoryStub)

    await expect(sut.execute('test-collection')).rejects.toThrow(ReadError)
  })
})
