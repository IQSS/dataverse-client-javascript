import { WriteError } from '../../../src'
import { GuestbookResponseDTO } from '../../../src/access/domain/dtos/GuestbookResponseDTO'
import { IAccessRepository } from '../../../src/access/domain/repositories/IAccessRepository'
import { GetSignedDatafileDownloadUrl } from '../../../src/access/domain/useCases/GetSignedDatafileDownloadUrl'
import { GetSignedDatafilesDownloadUrl } from '../../../src/access/domain/useCases/GetSignedDatafilesDownloadUrl'
import { GetSignedDatasetDownloadUrl } from '../../../src/access/domain/useCases/GetSignedDatasetDownloadUrl'
import { GetSignedDatasetVersionDownloadUrl } from '../../../src/access/domain/useCases/GetSignedDatasetVersionDownloadUrl'
import { SubmitGuestbookForDatafileDownload } from '../../../src/access/domain/useCases/SubmitGuestbookForDatafileDownload'
import { SubmitGuestbookForDatafilesDownload } from '../../../src/access/domain/useCases/SubmitGuestbookForDatafilesDownload'
import { SubmitGuestbookForDatasetDownload } from '../../../src/access/domain/useCases/SubmitGuestbookForDatasetDownload'
import { SubmitGuestbookForDatasetVersionDownload } from '../../../src/access/domain/useCases/SubmitGuestbookForDatasetVersionDownload'

describe('access download use cases', () => {
  const guestbookResponse: GuestbookResponseDTO = {
    guestbookResponse: {
      answers: [{ id: 1, value: 'question 1' }]
    }
  }

  test('should get signed datafile download url', async () => {
    const repository: IAccessRepository = {} as IAccessRepository
    repository.getSignedDatafileDownloadUrl = jest.fn().mockResolvedValue('https://signed.datafile')
    const sut = new GetSignedDatafileDownloadUrl(repository)

    const actual = await sut.execute(1)

    expect(repository.getSignedDatafileDownloadUrl).toHaveBeenCalledWith(1)
    expect(actual).toEqual('https://signed.datafile')
  })

  test('should get signed datafiles download url', async () => {
    const repository: IAccessRepository = {} as IAccessRepository
    repository.getSignedDatafilesDownloadUrl = jest
      .fn()
      .mockResolvedValue('https://signed.datafiles')
    const sut = new GetSignedDatafilesDownloadUrl(repository)

    const actual = await sut.execute([1, 2])

    expect(repository.getSignedDatafilesDownloadUrl).toHaveBeenCalledWith([1, 2])
    expect(actual).toEqual('https://signed.datafiles')
  })

  test('should get signed dataset download url', async () => {
    const repository: IAccessRepository = {} as IAccessRepository
    repository.getSignedDatasetDownloadUrl = jest.fn().mockResolvedValue('https://signed.dataset')
    const sut = new GetSignedDatasetDownloadUrl(repository)

    const actual = await sut.execute('doi:10.5072/FK2/TEST')

    expect(repository.getSignedDatasetDownloadUrl).toHaveBeenCalledWith('doi:10.5072/FK2/TEST')
    expect(actual).toEqual('https://signed.dataset')
  })

  test('should throw WriteError when signed dataset version download url fails', async () => {
    const repository: IAccessRepository = {} as IAccessRepository
    repository.getSignedDatasetVersionDownloadUrl = jest.fn().mockRejectedValue(new WriteError())
    const sut = new GetSignedDatasetVersionDownloadUrl(repository)

    await expect(sut.execute(10, '2.0')).rejects.toThrow(WriteError)
  })

  test('should submit datafile download and return signed url', async () => {
    const repository: IAccessRepository = {} as IAccessRepository
    repository.submitGuestbookForDatafileDownload = jest
      .fn()
      .mockResolvedValue('https://signed.datafile')
    const sut = new SubmitGuestbookForDatafileDownload(repository)

    const actual = await sut.execute(1, guestbookResponse)

    expect(repository.submitGuestbookForDatafileDownload).toHaveBeenCalledWith(1, guestbookResponse)
    expect(actual).toEqual('https://signed.datafile')
  })

  test('should submit datafiles download and return signed url', async () => {
    const repository: IAccessRepository = {} as IAccessRepository
    repository.submitGuestbookForDatafilesDownload = jest
      .fn()
      .mockResolvedValue('https://signed.datafiles')
    const sut = new SubmitGuestbookForDatafilesDownload(repository)

    const actual = await sut.execute([1, 2], guestbookResponse)

    expect(repository.submitGuestbookForDatafilesDownload).toHaveBeenCalledWith(
      [1, 2],
      guestbookResponse
    )
    expect(actual).toEqual('https://signed.datafiles')
  })

  test('should submit dataset download and return signed url', async () => {
    const repository: IAccessRepository = {} as IAccessRepository
    repository.submitGuestbookForDatasetDownload = jest
      .fn()
      .mockResolvedValue('https://signed.dataset')
    const sut = new SubmitGuestbookForDatasetDownload(repository)

    const actual = await sut.execute('doi:10.5072/FK2/TEST', guestbookResponse)

    expect(repository.submitGuestbookForDatasetDownload).toHaveBeenCalledWith(
      'doi:10.5072/FK2/TEST',
      guestbookResponse
    )
    expect(actual).toEqual('https://signed.dataset')
  })

  test('should throw WriteError when dataset version download fails', async () => {
    const repository: IAccessRepository = {} as IAccessRepository
    repository.submitGuestbookForDatasetVersionDownload = jest
      .fn()
      .mockRejectedValue(new WriteError())
    const sut = new SubmitGuestbookForDatasetVersionDownload(repository)

    await expect(sut.execute(10, '2.0', guestbookResponse)).rejects.toThrow(WriteError)
  })
})
