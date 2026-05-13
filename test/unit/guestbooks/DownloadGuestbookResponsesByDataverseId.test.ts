import { ReadError } from '../../../src'
import { IGuestbooksRepository } from '../../../src/guestbooks/domain/repositories/IGuestbooksRepository'
import { DownloadGuestbookResponsesByDataverseId } from '../../../src/guestbooks/domain/useCases/DownloadGuestbookResponsesByDataverseId'

describe('DownloadGuestbookResponsesByDataverseId', () => {
  const dataverseId = 'collectionAlias'
  const csvResponse =
    'Guestbook,Dataset,Dataset PID,Date,Type,File Name,File Id,File PID,User Name,Email,Institution,Position,Custom Questions'

  test('should download guestbook responses for dataverse', async () => {
    const repository: IGuestbooksRepository = {} as IGuestbooksRepository
    repository.downloadGuestbookResponsesByDataverseId = jest.fn().mockResolvedValue(csvResponse)

    const sut = new DownloadGuestbookResponsesByDataverseId(repository)
    const actual = await sut.execute(dataverseId)

    expect(repository.downloadGuestbookResponsesByDataverseId).toHaveBeenCalledWith(dataverseId)
    expect(actual).toEqual(csvResponse)
  })

  test('should throw ReadError when repository fails', async () => {
    const repository: IGuestbooksRepository = {} as IGuestbooksRepository
    repository.downloadGuestbookResponsesByDataverseId = jest
      .fn()
      .mockRejectedValue(new ReadError())
    const sut = new DownloadGuestbookResponsesByDataverseId(repository)

    await expect(sut.execute(dataverseId)).rejects.toThrow(ReadError)
  })
})
