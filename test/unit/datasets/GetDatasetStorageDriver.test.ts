import { GetDatasetStorageDriver } from '../../../src/datasets/domain/useCases/GetDatasetStorageDriver'
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository'
import { StorageDriver } from '../../../src/core/domain/models/StorageDriver'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'

describe('execute', () => {
  test('should return storage driver on repository success', async () => {
    const testStorageDriver: StorageDriver = {
      name: 's3',
      type: 's3',
      label: 'S3',
      directUpload: true,
      directDownload: true
    }

    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.getDatasetStorageDriver = jest.fn().mockResolvedValue(testStorageDriver)

    const sut = new GetDatasetStorageDriver(datasetsRepositoryStub)

    const actual = await sut.execute(1)

    expect(actual).toEqual(testStorageDriver)
  })

  test('should throw ReadError on repository error', async () => {
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.getDatasetStorageDriver = jest.fn().mockRejectedValue(new ReadError())

    const sut = new GetDatasetStorageDriver(datasetsRepositoryStub)

    await expect(sut.execute(1)).rejects.toThrow(ReadError)
  })
})
