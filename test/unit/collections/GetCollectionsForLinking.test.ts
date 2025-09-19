import { ICollectionsRepository } from '../../../src/collections/domain/repositories/ICollectionsRepository'
import { GetCollectionsForLinking } from '../../../src/collections/domain/useCases/GetCollectionsForLinking'
import { CollectionSummary, ReadError } from '../../../src'

const sample: CollectionSummary[] = [
  { id: 1, alias: 'col1', displayName: 'Collection 1' },
  { id: 2, alias: 'col2', displayName: 'Collection 2' }
]

describe('GetCollectionsForLinking', () => {
  test('should return collections for linking on success', async () => {
    const repo: ICollectionsRepository = {} as ICollectionsRepository
    repo.getCollectionsForLinking = jest.fn().mockResolvedValue(sample)

    const uc = new GetCollectionsForLinking(repo)
    await expect(uc.execute('collection', 123, 'foo')).resolves.toEqual(sample)
    expect(repo.getCollectionsForLinking).toHaveBeenCalledWith('collection', 123, 'foo', false)
  })

  test('should return error result on repository error', async () => {
    const repo: ICollectionsRepository = {} as ICollectionsRepository
    repo.getCollectionsForLinking = jest.fn().mockRejectedValue(new ReadError('x'))

    const uc = new GetCollectionsForLinking(repo)
    await expect(uc.execute('dataset', 'doi:10.123/ABC')).rejects.toThrow(ReadError)
    expect(repo.getCollectionsForLinking).toHaveBeenCalledWith(
      'dataset',
      'doi:10.123/ABC',
      '',
      false
    )
  })
})
