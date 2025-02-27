import { ReadError } from '../../../src/core/domain/repositories/ReadError'
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository'
import { createDatasetVersionSummaryModel } from '../../testHelpers/datasets/datasetVersionsSummariesHelper'
import { GetDatasetVersionsSummaries } from '../../../src/datasets/domain/useCases/GetDatasetVersionsSummaries'

const testDatasetId = 1

describe('execute', () => {
  test('should return dataset versions summaries on repository success', async () => {
    const testDatasetVersionsSummaries = [createDatasetVersionSummaryModel()]
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.getDatasetVersionsSummaries = jest
      .fn()
      .mockResolvedValue(testDatasetVersionsSummaries)
    const sut = new GetDatasetVersionsSummaries(datasetsRepositoryStub)

    const actual = await sut.execute(testDatasetId)

    expect(actual).toEqual(testDatasetVersionsSummaries)
    expect(datasetsRepositoryStub.getDatasetVersionsSummaries).toHaveBeenCalledWith(testDatasetId)
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
