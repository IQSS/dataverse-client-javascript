import { ReadError } from '../../../src'
import { GuestbookResponse } from '../../../src/guestbooks/domain/models/GuestbookResponse'
import { IGuestbooksRepository } from '../../../src/guestbooks/domain/repositories/IGuestbooksRepository'
import { GetGuestbookResponsesByDataverseId } from '../../../src/guestbooks/domain/useCases/GetGuestbookResponsesByDataverseId'

describe('GetGuestbookResponsesByDataverseId', () => {
  const dataverseId = 'collectionAlias'
  const guestbookResponses: GuestbookResponse[] = [
    {
      guestbookId: 12,
      dataverseId: 34,
      name: 'Guest User',
      email: 'guest@example.edu'
    }
  ]

  test('should return guestbook responses for dataverse', async () => {
    const repository: IGuestbooksRepository = {} as IGuestbooksRepository
    repository.getGuestbookResponsesByDataverseId = jest.fn().mockResolvedValue(guestbookResponses)

    const sut = new GetGuestbookResponsesByDataverseId(repository)
    const actual = await sut.execute(dataverseId)

    expect(repository.getGuestbookResponsesByDataverseId).toHaveBeenCalledWith(dataverseId)
    expect(actual).toEqual(guestbookResponses)
  })

  test('should throw ReadError when repository fails', async () => {
    const repository: IGuestbooksRepository = {} as IGuestbooksRepository
    repository.getGuestbookResponsesByDataverseId = jest.fn().mockRejectedValue(new ReadError())
    const sut = new GetGuestbookResponsesByDataverseId(repository)

    await expect(sut.execute(dataverseId)).rejects.toThrow(ReadError)
  })
})
