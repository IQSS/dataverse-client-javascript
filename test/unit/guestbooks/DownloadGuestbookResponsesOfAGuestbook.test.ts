import { ReadError } from '../../../src'
import { IGuestbooksRepository } from '../../../src/guestbooks/domain/repositories/IGuestbooksRepository'
import { DownloadGuestbookResponsesOfAGuestbook } from '../../../src/guestbooks/domain/useCases/DownloadGuestbookResponsesOfAGuestbook'

describe('DownloadGuestbookResponsesOfAGuestbook', () => {
  const dataverseId = 'collectionAlias'
  const guestbookId = 12
  const csvResponse =
    'Guestbook,Dataset,Dataset PID,Date,Type,File Name,File Id,File PID,User Name,Email,Institution,Position,Custom Questions'

  test('should download guestbook responses for one guestbook', async () => {
    const repository: IGuestbooksRepository = {} as IGuestbooksRepository
    repository.downloadGuestbookResponsesByDataverseId = jest.fn().mockResolvedValue(csvResponse)

    const sut = new DownloadGuestbookResponsesOfAGuestbook(repository)
    const actual = await sut.execute(dataverseId, guestbookId)

    expect(repository.downloadGuestbookResponsesByDataverseId).toHaveBeenCalledWith(
      dataverseId,
      guestbookId
    )
    expect(actual).toEqual(csvResponse)
  })

  test('should throw ReadError when repository fails', async () => {
    const repository: IGuestbooksRepository = {} as IGuestbooksRepository
    repository.downloadGuestbookResponsesByDataverseId = jest
      .fn()
      .mockRejectedValue(new ReadError())
    const sut = new DownloadGuestbookResponsesOfAGuestbook(repository)

    await expect(sut.execute(dataverseId, guestbookId)).rejects.toThrow(ReadError)
  })
})
