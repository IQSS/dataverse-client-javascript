import { GetDatasetFiles } from '../../../src/files/domain/useCases/GetDatasetFiles'
import { IFilesRepository } from '../../../src/files/domain/repositories/IFilesRepository'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'
import { File } from '../../../src/files/domain/models/File'
import { createFileModel } from '../../testHelpers/files/filesHelper'
import { DatasetNotNumberedVersion } from '../../../src/datasets'
import { FileOrderCriteria } from '../../../src/files/domain/models/FileCriteria'

describe('execute', () => {
  test('should return files on repository success', async () => {
    const testFiles: File[] = [createFileModel()]
    const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
    filesRepositoryStub.getDatasetFiles = jest.fn().mockResolvedValue(testFiles)

    const sut = new GetDatasetFiles(filesRepositoryStub)

    const actual = await sut.execute(1)

    expect(actual).toEqual(testFiles)
    expect(filesRepositoryStub.getDatasetFiles).toHaveBeenCalledWith(
      1,
      DatasetNotNumberedVersion.LATEST,
      false,
      FileOrderCriteria.NAME_AZ,
      undefined,
      undefined,
      undefined
    )
  })

  test('should return error result on repository error', async () => {
    const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
    filesRepositoryStub.getDatasetFiles = jest.fn().mockRejectedValue(new ReadError())

    const sut = new GetDatasetFiles(filesRepositoryStub)

    await expect(sut.execute(1)).rejects.toThrow(ReadError)
  })
})
