import { ICollectionsRepository } from '../../../src/collections/domain/repositories/ICollectionsRepository'
import { PublishCollection } from '../../../src/collections/domain/useCases/PublishCollection'
import { WriteError } from '../../../src'

describe('execute', () => {
  test('should return undefined on repository success', async () => {
    const collectionsRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionsRepositoryStub.publishCollection = jest.fn().mockResolvedValue(undefined)
    const sut = new PublishCollection(collectionsRepositoryStub)

    const actual = await sut.execute(1)

    expect(actual).toEqual(undefined)
  })

  test('should return error result on repository error', async () => {
    const collectionsRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionsRepositoryStub.publishCollection = jest.fn().mockRejectedValue(new WriteError())
    const sut = new PublishCollection(collectionsRepositoryStub)

    await expect(sut.execute(1)).rejects.toThrow(WriteError)
  })
})
