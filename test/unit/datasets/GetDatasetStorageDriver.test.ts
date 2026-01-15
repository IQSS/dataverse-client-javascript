import { GetDatasetStorageDriver } from '../../../src/datasets/domain/useCases/GetDatasetStorageDriver'
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository'
import { StorageDriver } from '../../../src/datasets/domain/models/StorageDriver'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'

describe('GetDatasetStorageDriver (unit)', () => {
  const testStorageDriver: StorageDriver = {
    name: 'local',
    type: 'filesystem',
    label: 'Local Storage',
    directUpload: true,
    directDownload: true,
    uploadOutOfBand: false
  }

  test('should return storage driver on repository success', async () => {
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.getDatasetStorageDriver = jest.fn().mockResolvedValue(testStorageDriver)
    const sut = new GetDatasetStorageDriver(datasetsRepositoryStub)

    const actual = await sut.execute(1)

    expect(actual).toEqual(testStorageDriver)
    expect(actual.name).toBe('local')
    expect(actual.type).toBe('filesystem')
    expect(actual.label).toBe('Local Storage')
    expect(actual.directUpload).toBe(true)
    expect(actual.directDownload).toBe(true)
    expect(actual.uploadOutOfBand).toBe(false)
  })

  test('should return storage driver when using persistent id', async () => {
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.getDatasetStorageDriver = jest.fn().mockResolvedValue(testStorageDriver)
    const sut = new GetDatasetStorageDriver(datasetsRepositoryStub)

    const actual = await sut.execute('doi:10.77777/FK2/AAAAAA')

    expect(actual).toEqual(testStorageDriver)
  })

  test('should return error result on repository error', async () => {
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.getDatasetStorageDriver = jest
      .fn()
      .mockRejectedValue(new ReadError('[404] Dataset not found'))
    const sut = new GetDatasetStorageDriver(datasetsRepositoryStub)

    await expect(sut.execute(1)).rejects.toThrow(ReadError)
  })
})
