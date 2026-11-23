import { DeleteDatasetCurationStatus } from '../../../src/datasets/domain/useCases/curation/DeleteDatasetCurationStatus'
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository'
import { WriteError } from '../../../src/core/domain/repositories/WriteError'

describe('DeleteDatasetCurationStatus', () => {
  test.each([1, 'doi:10.5072/FK2/ABC'])(
    'should delegate identifier %s and return the result',
    async (id) => {
      const expected = undefined
      const repository = {} as IDatasetsRepository
      repository.deleteDatasetCurationStatus = jest.fn().mockResolvedValue(expected)
      const sut = new DeleteDatasetCurationStatus(repository)

      expect(await sut.execute(id)).toEqual(expected)
      expect(repository.deleteDatasetCurationStatus).toHaveBeenCalledWith(id)
    }
  )

  test('should propagate repository errors', async () => {
    const id = 1
    const error = new WriteError('Denied')
    const repository = {} as IDatasetsRepository
    repository.deleteDatasetCurationStatus = jest.fn().mockRejectedValue(error)
    const sut = new DeleteDatasetCurationStatus(repository)

    await expect(sut.execute(id)).rejects.toBe(error)
  })
})
