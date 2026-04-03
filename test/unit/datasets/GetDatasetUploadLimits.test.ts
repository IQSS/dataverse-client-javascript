import { GetDatasetUploadLimits } from '../../../src/datasets/domain/useCases/GetDatasetUploadLimits'
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository'
import { DatasetUploadLimits } from '../../../src/datasets/domain/models/DatasetUploadLimits'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'

describe('GetDatasetUploadLimits (unit)', () => {
  const testUploadLimits: DatasetUploadLimits = {
    numberOfFilesRemaining: 25,
    storageQuotaRemaining: 21474836480
  }

  test('should return upload limits on repository success', async () => {
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.getDatasetUploadLimits = jest.fn().mockResolvedValue(testUploadLimits)
    const sut = new GetDatasetUploadLimits(datasetsRepositoryStub)

    const actual = await sut.execute(1)

    expect(actual).toEqual(testUploadLimits)
    expect(actual.numberOfFilesRemaining).toBe(25)
    expect(actual.storageQuotaRemaining).toBe(21474836480)
  })

  test('should return upload limits when using persistent id', async () => {
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.getDatasetUploadLimits = jest.fn().mockResolvedValue(testUploadLimits)
    const sut = new GetDatasetUploadLimits(datasetsRepositoryStub)

    const actual = await sut.execute('doi:10.77777/FK2/AAAAAA')

    expect(actual).toEqual(testUploadLimits)
  })

  test('should return error result on repository error', async () => {
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.getDatasetUploadLimits = jest
      .fn()
      .mockRejectedValue(new ReadError('[404] Dataset not found'))
    const sut = new GetDatasetUploadLimits(datasetsRepositoryStub)

    await expect(sut.execute(1)).rejects.toThrow(ReadError)
  })
})
