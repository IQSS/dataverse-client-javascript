import { ReadError } from '../../../src'
import { Guestbook } from '../../../src/guestbooks/domain/models/Guestbook'
import { IGuestbooksRepository } from '../../../src/guestbooks/domain/repositories/IGuestbooksRepository'
import { GetGuestbooksByCollectionId } from '../../../src/guestbooks/domain/useCases/GetGuestbooksByCollectionId'

describe('GetGuestbooksByCollectionId', () => {
  const guestbooks: Guestbook[] = [
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
  const collectionId = 'collectionAlias'

  test('should return guestbooks for collection', async () => {
    const repository: IGuestbooksRepository = {} as IGuestbooksRepository
    repository.getGuestbooksBycollectionId = jest.fn().mockResolvedValue(guestbooks)

    const sut = new GetGuestbooksByCollectionId(repository)
    const actual = await sut.execute(collectionId)

    expect(repository.getGuestbooksBycollectionId).toHaveBeenCalledWith(collectionId)
    expect(actual).toEqual(guestbooks)
  })

  test('should throw ReadError when repository fails', async () => {
    const repository: IGuestbooksRepository = {} as IGuestbooksRepository
    repository.getGuestbooksBycollectionId = jest.fn().mockRejectedValue(new ReadError())
    const sut = new GetGuestbooksByCollectionId(repository)

    await expect(sut.execute(collectionId)).rejects.toThrow(ReadError)
  })
})
