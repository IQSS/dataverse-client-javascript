import { ReadError } from '../../../src'
import { IGuestbooksRepository } from '../../../src/guestbooks/domain/repositories/IGuestbooksRepository'
import { DownloadGuestbookResponsesByCollectionId } from '../../../src/guestbooks/domain/useCases/DownloadGuestbookResponsesByCollectionId'

describe('DownloadGuestbookResponsesByCollectionId', () => {
  const collectionIdOrAlias = 'collectionAlias'
  const csvResponse =
    'Guestbook,Dataset,Dataset PID,Date,Type,File Name,File Id,File PID,User Name,Email,Institution,Position,Custom Questions'

  test('should download guestbook responses for collection', async () => {
    const repository: IGuestbooksRepository = {} as IGuestbooksRepository
    repository.downloadGuestbookResponsesByCollectionId = jest.fn().mockResolvedValue(csvResponse)

    const sut = new DownloadGuestbookResponsesByCollectionId(repository)
    const actual = await sut.execute(collectionIdOrAlias)

    expect(repository.downloadGuestbookResponsesByCollectionId).toHaveBeenCalledWith(
      collectionIdOrAlias
    )
    expect(actual).toEqual(csvResponse)
  })

  test('should throw ReadError when repository fails', async () => {
    const repository: IGuestbooksRepository = {} as IGuestbooksRepository
    repository.downloadGuestbookResponsesByCollectionId = jest
      .fn()
      .mockRejectedValue(new ReadError())
    const sut = new DownloadGuestbookResponsesByCollectionId(repository)

    await expect(sut.execute(collectionIdOrAlias)).rejects.toThrow(ReadError)
  })
})
