import { GetAllowedDatasetCurationLabels } from '../../../src/datasets/domain/useCases/curation/GetAllowedDatasetCurationLabels'
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'

describe('GetAllowedDatasetCurationLabels', () => {
  test.each([1, 'doi:10.5072/FK2/ABC'])(
    'should delegate identifier %s and return the result',
    async (id) => {
      const expected = ['Privacy Review']
      const repository = {} as IDatasetsRepository
      repository.getAllowedDatasetCurationLabels = jest.fn().mockResolvedValue(expected)
      const sut = new GetAllowedDatasetCurationLabels(repository)

      expect(await sut.execute(id)).toEqual(expected)
      expect(repository.getAllowedDatasetCurationLabels).toHaveBeenCalledWith(id)
    }
  )

  test('should propagate repository errors', async () => {
    const id = 1
    const error = new ReadError('Denied')
    const repository = {} as IDatasetsRepository
    repository.getAllowedDatasetCurationLabels = jest.fn().mockRejectedValue(error)
    const sut = new GetAllowedDatasetCurationLabels(repository)

    await expect(sut.execute(id)).rejects.toBe(error)
  })
})
