import { ReturnDatasetToAuthor } from '../../../src/datasets/domain/useCases/curation/ReturnDatasetToAuthor'
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository'
import { WriteError } from '../../../src'

describe('ReturnDatasetToAuthor.execute', () => {
  test.each([42, 'doi:10.5072/FK2/TEST'])(
    'delegates the ID and exact reason for %s',
    async (id) => {
      const repository = {
        returnDatasetToAuthor: jest.fn().mockResolvedValue(undefined)
      } as unknown as IDatasetsRepository
      const sut = new ReturnDatasetToAuthor(repository)
      expect(await sut.execute(id, ' Please fix metadata. ')).toBeUndefined()
      expect(repository.returnDatasetToAuthor).toHaveBeenCalledWith(id, ' Please fix metadata. ')
    }
  )
  test('preserves write errors', async () => {
    const error = new WriteError('[403] Permission denied')
    const repository = {
      returnDatasetToAuthor: jest.fn().mockRejectedValue(error)
    } as unknown as IDatasetsRepository
    await expect(new ReturnDatasetToAuthor(repository).execute(42, 'Fix metadata')).rejects.toBe(
      error
    )
  })
})
