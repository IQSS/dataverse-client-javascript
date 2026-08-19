import { GetDatasetFileCounts } from '../../../src/files/domain/useCases/GetDatasetFileCounts'
import { IFilesRepository } from '../../../src/files/domain/repositories/IFilesRepository'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'
import { DatasetNotNumberedVersion } from '../../../src/datasets'
import { FileCounts } from '../../../src/files/domain/models/FileCounts'
import { createFileCountsModel } from '../../testHelpers/files/fileCountsHelper'

describe('execute', () => {
  test('should return file counts on repository success', async () => {
    const testFileCounts: FileCounts = createFileCountsModel()
    const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
    filesRepositoryStub.getDatasetFileCounts = jest.fn().mockResolvedValue(testFileCounts)

    const sut = new GetDatasetFileCounts(filesRepositoryStub)

    const actual = await sut.execute(1)

    expect(actual).toEqual(testFileCounts)
    expect(filesRepositoryStub.getDatasetFileCounts).toHaveBeenCalledWith(
      1,
      DatasetNotNumberedVersion.LATEST,
      false,
      undefined,
      undefined
    )
  })

  test('should forward the preview URL token to the repository when provided', async () => {
    const testFileCounts: FileCounts = createFileCountsModel()
    const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
    filesRepositoryStub.getDatasetFileCounts = jest.fn().mockResolvedValue(testFileCounts)
    const testPreviewUrlToken = 'testToken'

    const sut = new GetDatasetFileCounts(filesRepositoryStub)

    const actual = await sut.execute(
      1,
      DatasetNotNumberedVersion.LATEST,
      false,
      undefined,
      testPreviewUrlToken
    )

    expect(actual).toEqual(testFileCounts)
    expect(filesRepositoryStub.getDatasetFileCounts).toHaveBeenCalledWith(
      1,
      DatasetNotNumberedVersion.LATEST,
      false,
      undefined,
      testPreviewUrlToken
    )
  })

  test('should return error result on repository error', async () => {
    const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
    filesRepositoryStub.getDatasetFileCounts = jest.fn().mockRejectedValue(new ReadError())

    const sut = new GetDatasetFileCounts(filesRepositoryStub)

    await expect(sut.execute(1)).rejects.toThrow(ReadError)
  })
})
