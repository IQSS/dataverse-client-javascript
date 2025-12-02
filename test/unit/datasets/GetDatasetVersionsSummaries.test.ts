import { ReadError } from '../../../src/core/domain/repositories/ReadError'
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository'
import { createDatasetVersionSummaryModel } from '../../testHelpers/datasets/datasetVersionsSummariesHelper'
import { GetDatasetVersionsSummaries } from '../../../src/datasets/domain/useCases/GetDatasetVersionsSummaries'
import { DatasetVersionSummarySubset } from '../../../src/datasets/domain/models/DatasetVersionSummaryInfo'

const testDatasetId = 1

describe('execute', () => {
  test('should return dataset versions summaries on repository success', async () => {
    const testDatasetVersionsSummariesSubset: DatasetVersionSummarySubset = {
      summaries: [createDatasetVersionSummaryModel()],
      totalCount: 1
    }
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.getDatasetVersionsSummaries = jest
      .fn()
      .mockResolvedValue(testDatasetVersionsSummariesSubset)
    const sut = new GetDatasetVersionsSummaries(datasetsRepositoryStub)

    const actual = await sut.execute(testDatasetId)

    expect(actual).toEqual(testDatasetVersionsSummariesSubset)
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
    const sut = new GetDatasetVersionsSummaries(datasetsRepositoryStub)

    await expect(sut.execute(testDatasetId)).rejects.toThrow(ReadError)
  })
})
