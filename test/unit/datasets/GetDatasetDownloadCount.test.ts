import { GetDatasetDownloadCount } from '../../../src/datasets/domain/useCases/GetDatasetDownloadCount'
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'
import { DatasetDownloadCount } from '../../../src/datasets/domain/models/DatasetDownloadCount'

describe('execute', () => {
  const testDatasetId = 1
  const testDatasetDownloadCount: DatasetDownloadCount = {
    id: testDatasetId,
    downloadCount: 1,
    MDCStartDate: '2021-01-01'
  }

  test('should return count on repository success filtering by id', async () => {
    const filesRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    filesRepositoryStub.getDatasetDownloadCount = jest
      .fn()
      .mockResolvedValue(testDatasetDownloadCount)
    const sut = new GetDatasetDownloadCount(filesRepositoryStub)

    const actual = await sut.execute(testDatasetId)

    expect(actual).toBe(testDatasetDownloadCount)
    expect(filesRepositoryStub.getDatasetDownloadCount).toHaveBeenCalledWith(
      testDatasetId,
      undefined
    )
  })

  test('should return error result on repository error', async () => {
    const filesRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    filesRepositoryStub.getDatasetDownloadCount = jest.fn().mockRejectedValue(new ReadError())
    const sut = new GetDatasetDownloadCount(filesRepositoryStub)

    await expect(sut.execute(testDatasetId)).rejects.toThrow(ReadError)
  })
})
