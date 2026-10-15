import { SetDatasetCurationStatus } from '../../../src/datasets/domain/useCases/curation/SetDatasetCurationStatus'
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository'
import { WriteError } from '../../../src/core/domain/repositories/WriteError'

describe('SetDatasetCurationStatus', () => {
  test.each([1, 'doi:10.5072/FK2/ABC'])(
    'should delegate identifier %s and return the result',
    async (id) => {
      const expected = undefined
      const repository = {} as IDatasetsRepository
      repository.setDatasetCurationStatus = jest.fn().mockResolvedValue(expected)
      const sut = new SetDatasetCurationStatus(repository)

      expect(await sut.execute(id, 'Privacy Review')).toEqual(expected)
      expect(repository.setDatasetCurationStatus).toHaveBeenCalledWith(id, 'Privacy Review')
    }
  )

  test('should propagate repository errors', async () => {
    const id = 1
    const error = new WriteError('Denied')
    const repository = {} as IDatasetsRepository
    repository.setDatasetCurationStatus = jest.fn().mockRejectedValue(error)
    const sut = new SetDatasetCurationStatus(repository)

    await expect(sut.execute(id, 'Privacy Review')).rejects.toBe(error)
  })
})
