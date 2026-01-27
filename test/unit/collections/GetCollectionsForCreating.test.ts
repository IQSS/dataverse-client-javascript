import { ICollectionsRepository } from '../../../src/collections/domain/repositories/ICollectionsRepository'
import { GetCollectionsForCreating } from '../../../src/collections/domain/useCases/GetCollectionsForCreating'
import { CollectionSummary, ReadError } from '../../../src'

const sample: CollectionSummary[] = [
  { id: 1, alias: 'col1', displayName: 'Collection 1' },
  { id: 2, alias: 'col2', displayName: 'Collection 2' }
]

describe('GetCollectionsForCreating', () => {
  test('should return collections for creating on success', async () => {
    const repo: ICollectionsRepository = {} as ICollectionsRepository
    repo.getCollectionsForCreating = jest.fn().mockResolvedValue(sample)

    const uc = new GetCollectionsForCreating(repo)
    await expect(uc.execute('testUser')).resolves.toEqual(sample)
    expect(repo.getCollectionsForCreating).toHaveBeenCalledWith('@testUser')
  })

  test('should return error result on repository error', async () => {
    const repo: ICollectionsRepository = {} as ICollectionsRepository
    repo.getCollectionsForCreating = jest.fn().mockRejectedValue(new ReadError('x'))

    const uc = new GetCollectionsForCreating(repo)
    await expect(uc.execute('testUser')).rejects.toThrow(ReadError)
    expect(repo.getCollectionsForCreating).toHaveBeenCalledWith('@testUser')
  })
})
