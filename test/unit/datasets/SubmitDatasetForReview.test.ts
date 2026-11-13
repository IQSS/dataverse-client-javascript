import { SubmitDatasetForReview } from '../../../src/datasets/domain/useCases/curation/SubmitDatasetForReview'
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository'
import { WriteError } from '../../../src/core/domain/repositories/WriteError'

describe('SubmitDatasetForReview', () => {
  test.each([1, 'doi:10.5072/FK2/ABC'])(
    'should delegate identifier %s and return the result',
    async (id) => {
      const expected = { inReview: true, message: 'Submitted for review' }
      const repository = {} as IDatasetsRepository
      repository.submitDatasetForReview = jest.fn().mockResolvedValue(expected)
      const sut = new SubmitDatasetForReview(repository)

      expect(await sut.execute(id)).toEqual(expected)
      expect(repository.submitDatasetForReview).toHaveBeenCalledWith(id)
    }
  )

  test('should propagate repository errors', async () => {
    const id = 1
    const error = new WriteError('Denied')
    const repository = {} as IDatasetsRepository
    repository.submitDatasetForReview = jest.fn().mockRejectedValue(error)
    const sut = new SubmitDatasetForReview(repository)

    await expect(sut.execute(id)).rejects.toBe(error)
  })
})
