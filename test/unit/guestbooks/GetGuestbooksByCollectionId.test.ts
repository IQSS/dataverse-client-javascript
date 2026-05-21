import { ReadError } from '../../../src'
import { Guestbook } from '../../../src/guestbooks/domain/models/Guestbook'
import { IGuestbooksRepository } from '../../../src/guestbooks/domain/repositories/IGuestbooksRepository'
import { GetGuestbooksByCollectionId } from '../../../src/guestbooks/domain/useCases/GetGuestbooksByCollectionId'

describe('GetGuestbooksByCollectionId', () => {
  const guestbooksWithoutStats: Guestbook[] = [
    {
      id: 12,
      name: 'test',
      enabled: true,
      emailRequired: true,
      nameRequired: true,
      institutionRequired: false,
      positionRequired: false,
      customQuestions: [],
      createTime: '2024-01-01T00:00:00Z',
      dataverseId: 10
    }
  ]
  const guestbooksWithStats: Guestbook[] = [
    {
      id: 12,
      name: 'test',
      enabled: true,
      emailRequired: true,
      nameRequired: true,
      institutionRequired: false,
      positionRequired: false,
      customQuestions: [],
      createTime: '2024-01-01T00:00:00Z',
      dataverseId: 10,
      usageCount: 3,
      responseCount: 2
    }
  ]
  const collectionId = 'collectionAlias'

  test('should return guestbooks for collection', async () => {
    const repository: IGuestbooksRepository = {} as IGuestbooksRepository
    repository.getGuestbooksByCollectionId = jest.fn().mockResolvedValue(guestbooksWithoutStats)

    const sut = new GetGuestbooksByCollectionId(repository)
    const actual = await sut.execute(collectionId)

    expect(repository.getGuestbooksByCollectionId).toHaveBeenCalledWith(collectionId)
    expect(actual).toEqual(guestbooksWithoutStats)
    expect(actual[0].usageCount).toBeUndefined()
    expect(actual[0].responseCount).toBeUndefined()
  })

  test('should request guestbooks with stats when includeStats is true', async () => {
    const repository: IGuestbooksRepository = {} as IGuestbooksRepository
    repository.getGuestbooksByCollectionId = jest.fn().mockResolvedValue(guestbooksWithStats)

    const sut = new GetGuestbooksByCollectionId(repository)
    const actual = await sut.execute(collectionId, true)

    expect(repository.getGuestbooksByCollectionId).toHaveBeenCalledWith(collectionId, true, false)
    expect(actual).toEqual(guestbooksWithStats)
  })

  test('should request guestbooks with inherited guestbooks when includeInherited is true', async () => {
    const repository: IGuestbooksRepository = {} as IGuestbooksRepository
    repository.getGuestbooksByCollectionId = jest.fn().mockResolvedValue(guestbooksWithoutStats)

    const sut = new GetGuestbooksByCollectionId(repository)
    const actual = await sut.execute(collectionId, false, true)

    expect(repository.getGuestbooksByCollectionId).toHaveBeenCalledWith(collectionId, false, true)
    expect(actual).toEqual(guestbooksWithoutStats)
  })

  test('should request guestbooks with options object when includeInherited is true', async () => {
    const repository: IGuestbooksRepository = {} as IGuestbooksRepository
    repository.getGuestbooksByCollectionId = jest.fn().mockResolvedValue(guestbooksWithoutStats)

    const sut = new GetGuestbooksByCollectionId(repository)
    const actual = await sut.execute(collectionId, undefined, true)

    expect(repository.getGuestbooksByCollectionId).toHaveBeenCalledWith(collectionId, false, true)
    expect(actual).toEqual(guestbooksWithoutStats)
  })

  test('should throw ReadError when repository fails', async () => {
    const repository: IGuestbooksRepository = {} as IGuestbooksRepository
    repository.getGuestbooksByCollectionId = jest.fn().mockRejectedValue(new ReadError())
    const sut = new GetGuestbooksByCollectionId(repository)

    await expect(sut.execute(collectionId)).rejects.toThrow(ReadError)
  })
})
