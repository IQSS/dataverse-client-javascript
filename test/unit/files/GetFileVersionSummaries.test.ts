import { IFilesRepository } from '../../../src/files/domain/repositories/IFilesRepository'
import { ReadError } from '../../../src'
import { GetFileVersionSummaries } from '../../../src/files/domain/useCases/GetFileVersionSummaries'
import { FileVersionSummarySubset } from '../../../src/files/domain/models/FileVersionSummaryInfo'

describe('execute', () => {
  test('should return file on repository success when passing numeric id', async () => {
    const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
    const fileVersionSummariesSubset: FileVersionSummarySubset = {
      summaries: [
        {
          datasetVersion: '1.0',
          contributors: 'John Doe',
          publishedDate: '2023-01-01',
          fileDifferenceSummary: {
            fileMetadata: [
              {
                name: 'file.txt',
                action: 'Added'
              }
            ]
          },
          datafileId: 1
        }
      ],
      totalCount: 1
    }
    filesRepositoryStub.getFileVersionSummaries = jest
      .fn()
      .mockResolvedValue(fileVersionSummariesSubset)

    const sut = new GetFileVersionSummaries(filesRepositoryStub)
    const actualFileVersionSummaries = await sut.execute(1)
    expect(actualFileVersionSummaries).toEqual(fileVersionSummariesSubset)
  })

  test('should return error result on repository error', async () => {
    const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
    filesRepositoryStub.getFileVersionSummaries = jest.fn().mockRejectedValue(new ReadError())
    const sut = new GetFileVersionSummaries(filesRepositoryStub)

    await expect(sut.execute(1)).rejects.toThrow(ReadError)
  })
})
