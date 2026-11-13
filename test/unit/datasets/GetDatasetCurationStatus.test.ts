import { GetDatasetCurationStatus } from '../../../src/datasets/domain/useCases/curation/GetDatasetCurationStatus'
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'

describe('GetDatasetCurationStatus', () => {
  test.each([1, 'doi:10.5072/FK2/ABC'])(
    'should delegate identifier %s and return the result',
    async (id) => {
      const expected = { label: undefined, createTime: '2026-10-14 12:00:00', assigner: '@curator' }
      const repository = {} as IDatasetsRepository
      repository.getDatasetCurationStatus = jest.fn().mockResolvedValue(expected)
      const sut = new GetDatasetCurationStatus(repository)

      expect(await sut.execute(id)).toEqual(expected)
      expect(repository.getDatasetCurationStatus).toHaveBeenCalledWith(id)
    }
  )

  test('should propagate repository errors', async () => {
    const id = 1
    const error = new ReadError('Denied')
    const repository = {} as IDatasetsRepository
    repository.getDatasetCurationStatus = jest.fn().mockRejectedValue(error)
    const sut = new GetDatasetCurationStatus(repository)

    await expect(sut.execute(id)).rejects.toBe(error)
  })
})
