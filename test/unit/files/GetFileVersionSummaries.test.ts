import { IFilesRepository } from '../../../src/files/domain/repositories/IFilesRepository'
import { ReadError } from '../../../src'
import { GetFileVersionSummaries } from '../../../src/files/domain/useCases/GetFileVersionSummaries'
import { FileVersionSummaryInfo } from '../../../src/files/domain/models/FileVersionSummaryInfo'

describe('execute', () => {
  test('should return file on repository success when passing numeric id', async () => {
    const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
    const fileVersionSummaries: FileVersionSummaryInfo[] = [
      {
        datasetVersion: '1.0',
        versionNumber: 1,
        versionMinorNumber: 0,
        contributors: 'John Doe',
        publishedDate: '2023-01-01',
        fileDifferenceSummary: {
          FileMetadata: [
            {
              name: 'file.txt',
              action: 'Added'
            }
          ]
        },
        isDraft: false,
        isDeaccessioned: false,
        isReleased: false,
        datafileId: 1
      }
    ]
    filesRepositoryStub.getFileVersionSummaries = jest.fn().mockResolvedValue(fileVersionSummaries)

    const sut = new GetFileVersionSummaries(filesRepositoryStub)
    const actualFileVersionSummaries = await sut.execute(1)
    expect(actualFileVersionSummaries).toEqual(fileVersionSummaries)
  })

  test('should return error result on repository error', async () => {
    const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
    filesRepositoryStub.getFileVersionSummaries = jest.fn().mockRejectedValue(new ReadError())
    const sut = new GetFileVersionSummaries(filesRepositoryStub)

    await expect(sut.execute(1)).rejects.toThrow(ReadError)
  })
})
