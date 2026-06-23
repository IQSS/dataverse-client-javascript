import { ReadError } from '../../../src/core/domain/repositories/ReadError'
import { DatasetReview } from '../../../src/datasets/domain/models/DatasetReview'
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository'
import { GetDatasetReviews } from '../../../src/datasets/domain/useCases/GetDatasetReviews'
import { createDatasetReviewModel } from '../../testHelpers/datasets/datasetReviewHelper'

describe('GetDatasetReviews', () => {
  const testDatasetId = 'doi:10.77777/FK2/AAAAAA'

  test('should return dataset reviews on repository success', async () => {
    const testDatasetReviews: DatasetReview[] = [createDatasetReviewModel()]
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.getDatasetReviews = jest.fn().mockResolvedValue(testDatasetReviews)
    const sut = new GetDatasetReviews(datasetsRepositoryStub)

    const actual = await sut.execute(testDatasetId)

    expect(actual).toEqual(testDatasetReviews)
    expect(datasetsRepositoryStub.getDatasetReviews).toHaveBeenCalledWith(testDatasetId)
  })

  test('should return error result on repository error', async () => {
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.getDatasetReviews = jest.fn().mockRejectedValue(new ReadError())
    const sut = new GetDatasetReviews(datasetsRepositoryStub)

    await expect(sut.execute(testDatasetId)).rejects.toThrow(ReadError)
  })
})
