import { IFilesRepository } from '../../../src/files/domain/repositories/IFilesRepository'
import {
  DatasetNotNumberedVersion,
  ReadError,
  FileDownloadSizeMode,
  FileSearchCriteria,
  FileAccessStatus
} from '../../../src'
import { GetDatasetFilesTotalDownloadSize } from '../../../src/files/domain/useCases/GetDatasetFilesTotalDownloadSize'

describe('execute', () => {
  const testDatasetTotalDownloadSize = 123456789

  test('should return dataset files total download size of the latest version given a dataset id', async () => {
    const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
    filesRepositoryStub.getDatasetFilesTotalDownloadSize = jest
      .fn()
      .mockResolvedValue(testDatasetTotalDownloadSize)

    const sut = new GetDatasetFilesTotalDownloadSize(filesRepositoryStub)

    const actual = await sut.execute(1)

    expect(actual).toEqual(testDatasetTotalDownloadSize)
    expect(filesRepositoryStub.getDatasetFilesTotalDownloadSize).toHaveBeenCalledWith(
      1,
      DatasetNotNumberedVersion.LATEST,
      false,
      FileDownloadSizeMode.ALL,
      undefined
    )
  })

  test('should return dataset files total download size given a dataset id, version, file download size mode and search criteria', async () => {
    const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
    filesRepositoryStub.getDatasetFilesTotalDownloadSize = jest
      .fn()
      .mockResolvedValue(testDatasetTotalDownloadSize)
    const sut = new GetDatasetFilesTotalDownloadSize(filesRepositoryStub)

    const testVersionId = '1.0'
    const testFileSearchCriteria = new FileSearchCriteria()
      .withCategoryName('testCategory')
      .withContentType('testContentType')
      .withAccessStatus(FileAccessStatus.PUBLIC)
      .withTabularTagName('testTabularTagName')

    const actual = await sut.execute(
      1,
      testVersionId,
      FileDownloadSizeMode.ARCHIVAL,
      testFileSearchCriteria
    )

    expect(actual).toEqual(testDatasetTotalDownloadSize)
    expect(filesRepositoryStub.getDatasetFilesTotalDownloadSize).toHaveBeenCalledWith(
      1,
      testVersionId,
      false,
      FileDownloadSizeMode.ARCHIVAL,
      testFileSearchCriteria
    )
  })

  test('should return error result on repository error', async () => {
    const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
    filesRepositoryStub.getDatasetFilesTotalDownloadSize = jest
      .fn()
      .mockRejectedValue(new ReadError())
    const sut = new GetDatasetFilesTotalDownloadSize(filesRepositoryStub)

    await expect(sut.execute(1)).rejects.toThrow(ReadError)
  })
})
