import { ReadError } from '../../../src'
import { GuestbookResponse } from '../../../src/guestbooks/domain/models/GuestbookResponse'
import { IGuestbooksRepository } from '../../../src/guestbooks/domain/repositories/IGuestbooksRepository'
import { GetGuestbookResponsesOfAGuestbook } from '../../../src/guestbooks/domain/useCases/GetGuestbookResponsesOfAGuestbook'

describe('GetGuestbookResponsesOfAGuestbook', () => {
  const dataverseId = 'collectionAlias'
  const guestbookId = 12
  const guestbookResponses: GuestbookResponse[] = [
    {
      guestbookId,
      dataverseId: 34,
      name: 'Guest User',
      email: 'guest@example.edu'
    }
  ]

  test('should return guestbook responses for one guestbook', async () => {
    const repository: IGuestbooksRepository = {} as IGuestbooksRepository
    repository.getGuestbookResponsesByDataverseId = jest.fn().mockResolvedValue(guestbookResponses)

    const sut = new GetGuestbookResponsesOfAGuestbook(repository)
    const actual = await sut.execute(dataverseId, guestbookId)

    expect(repository.getGuestbookResponsesByDataverseId).toHaveBeenCalledWith(
      dataverseId,
      guestbookId
    )
    expect(actual).toEqual(guestbookResponses)
  })

  test('should throw ReadError when repository fails', async () => {
    const repository: IGuestbooksRepository = {} as IGuestbooksRepository
    repository.getGuestbookResponsesByDataverseId = jest.fn().mockRejectedValue(new ReadError())
    const sut = new GetGuestbookResponsesOfAGuestbook(repository)

    await expect(sut.execute(dataverseId, guestbookId)).rejects.toThrow(ReadError)
  })
})
