import { GetDatasetCurationStatusHistory } from '../../../src/datasets/domain/useCases/curation/GetDatasetCurationStatusHistory'
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'

describe('GetDatasetCurationStatusHistory', () => {
  test.each([1, 'doi:10.5072/FK2/ABC'])(
    'should delegate identifier %s and return the result',
    async (id) => {
      const expected = [{ label: undefined, createTime: undefined, assigner: undefined }]
      const repository = {} as IDatasetsRepository
      repository.getDatasetCurationStatusHistory = jest.fn().mockResolvedValue(expected)
      const sut = new GetDatasetCurationStatusHistory(repository)

      expect(await sut.execute(id)).toEqual(expected)
      expect(repository.getDatasetCurationStatusHistory).toHaveBeenCalledWith(id)
    }
  )

  test('should propagate repository errors', async () => {
    const id = 1
    const error = new ReadError('Denied')
    const repository = {} as IDatasetsRepository
    repository.getDatasetCurationStatusHistory = jest.fn().mockRejectedValue(error)
    const sut = new GetDatasetCurationStatusHistory(repository)

    await expect(sut.execute(id)).rejects.toBe(error)
  })
})
