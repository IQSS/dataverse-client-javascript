import { ReadError } from '../../../src/core/domain/repositories/ReadError'
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository'
import { createDatasetVersionDiff } from '../../testHelpers/datasets/datasetVersionDiffHelper'
import { GetDatasetVersionDiff } from '../../../src/datasets/domain/useCases/GetDatasetVersionDiff'

describe('execute', () => {
  const testDatasetId = 1

  test('should return dataset version diff on repository success', async () => {
    const testDatasetVersionDiff = [createDatasetVersionDiff()]
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.getDatasetVersionDiff = jest
      .fn()
      .mockResolvedValue(testDatasetVersionDiff)
    const sut = new GetDatasetVersionDiff(datasetsRepositoryStub)

    const actual = await sut.execute(testDatasetId, '1.0', '2.0')

    expect(actual).toEqual(testDatasetVersionDiff)
  })

  test('should return error result on repository error', async () => {
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.getDatasetVersionDiff = jest.fn().mockRejectedValue(new ReadError())
    const sut = new GetDatasetVersionDiff(datasetsRepositoryStub)

    await expect(sut.execute(testDatasetId, '1.0', '2.0')).rejects.toThrow(ReadError)
  })
})
