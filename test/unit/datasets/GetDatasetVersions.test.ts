import { ReadError } from '../../../src/core/domain/repositories/ReadError'
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository'
import { createDatasetVersionModel } from '../../testHelpers/datasets/datasetVersionsHelper'
import { GetDatasetVersions } from '../../../src/datasets/domain/useCases/GetDatasetVersions'
import { DatasetVersionSubset } from '../../../src/datasets/domain/models/DatasetVersion'

const testDatasetId = 1

describe('execute', () => {
  test('should return dataset versions summaries on repository success', async () => {
    const testDatasetVersionsSubset: DatasetVersionSubset = {
      versions: [createDatasetVersionModel()],
      totalCount: 1
    }
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.getDatasetVersionsSummaries = jest
      .fn()
      .mockResolvedValue(testDatasetVersionsSubset)
    const sut = new GetDatasetVersions(datasetsRepositoryStub)

    const actual = await sut.execute(testDatasetId)

    expect(actual).toEqual(testDatasetVersionsSubset)
    expect(datasetsRepositoryStub.getDatasetVersionsSummaries).toHaveBeenCalledWith(
      testDatasetId,
      undefined,
      undefined
    )
  })

  test('should return error result on repository error', async () => {
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.getDatasetVersionsSummaries = jest
      .fn()
      .mockRejectedValue(new ReadError())
    const sut = new GetDatasetVersions(datasetsRepositoryStub)

    await expect(sut.execute(testDatasetId)).rejects.toThrow(ReadError)
  })
})
