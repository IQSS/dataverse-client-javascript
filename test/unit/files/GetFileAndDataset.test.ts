import { createFileModel } from '../../testHelpers/files/filesHelper'
import { IFilesRepository } from '../../../src/files/domain/repositories/IFilesRepository'
import { DatasetNotNumberedVersion, ReadError } from '../../../src'
import { createDatasetModel } from '../../testHelpers/datasets/datasetHelper'
import { GetFileAndDataset } from '../../../src/files/domain/useCases/GetFileAndDataset'

describe('execute', () => {
  const testFile = createFileModel()
  const testDataset = createDatasetModel()
  const testTuple = [testFile, testDataset]

  test('should return file and dataset on repository success when passing numeric id', async () => {
    const filesRepositoryStub = <IFilesRepository>{}
    filesRepositoryStub.getFile = jest.fn().mockResolvedValue(testTuple)
    const sut = new GetFileAndDataset(filesRepositoryStub)

    const actual = await sut.execute(1)

    expect(actual[0]).toEqual(testFile)
    expect(actual[1]).toEqual(testDataset)
    expect(filesRepositoryStub.getFile).toHaveBeenCalledWith(
      1,
      DatasetNotNumberedVersion.LATEST,
      true,
      false,
      undefined
    )
  })

  test('should return file and dataset on repository success when passing string id', async () => {
    const filesRepositoryStub = <IFilesRepository>{}
    filesRepositoryStub.getFile = jest.fn().mockResolvedValue(testTuple)
    const sut = new GetFileAndDataset(filesRepositoryStub)

    const actual = await sut.execute('doi:10.5072/FK2/J8SJZB')

    expect(actual[0]).toEqual(testFile)
    expect(actual[1]).toEqual(testDataset)
    expect(filesRepositoryStub.getFile).toHaveBeenCalledWith(
      'doi:10.5072/FK2/J8SJZB',
      DatasetNotNumberedVersion.LATEST,
      true,
      false,
      undefined
    )
  })

  test('should return file and dataset on repository success when passing string id and version id', async () => {
    const filesRepositoryStub = <IFilesRepository>{}
    filesRepositoryStub.getFile = jest.fn().mockResolvedValue(testTuple)
    const sut = new GetFileAndDataset(filesRepositoryStub)

    const actual = await sut.execute('doi:10.5072/FK2/J8SJZB', '2.0')

    expect(actual[0]).toEqual(testFile)
    expect(actual[1]).toEqual(testDataset)
    expect(filesRepositoryStub.getFile).toHaveBeenCalledWith(
      'doi:10.5072/FK2/J8SJZB',
      '2.0',
      true,
      false,
      undefined
    )
  })

  test('should return file and dataset on repository success when includeDeaccession is true', async () => {
    const filesRepositoryStub = <IFilesRepository>{}
    filesRepositoryStub.getFile = jest.fn().mockResolvedValue(testTuple)
    const sut = new GetFileAndDataset(filesRepositoryStub)

    const actual = await sut.execute(
      'doi:10.5072/FK2/J8SJZB',
      DatasetNotNumberedVersion.LATEST,
      true
    )

    expect(actual[0]).toEqual(testFile)
    expect(actual[1]).toEqual(testDataset)
    expect(filesRepositoryStub.getFile).toHaveBeenCalledWith(
      'doi:10.5072/FK2/J8SJZB',
      DatasetNotNumberedVersion.LATEST,
      true,
      true,
      undefined
    )
  })

  test('should forward the preview URL token to the repository when provided', async () => {
    const filesRepositoryStub = <IFilesRepository>{}
    filesRepositoryStub.getFile = jest.fn().mockResolvedValue(testTuple)
    const sut = new GetFileAndDataset(filesRepositoryStub)
    const testPreviewUrlToken = 'testToken'

    const actual = await sut.execute(
      1,
      DatasetNotNumberedVersion.LATEST,
      false,
      testPreviewUrlToken
    )

    expect(actual[0]).toEqual(testFile)
    expect(actual[1]).toEqual(testDataset)
    expect(filesRepositoryStub.getFile).toHaveBeenCalledWith(
      1,
      DatasetNotNumberedVersion.LATEST,
      true,
      false,
      testPreviewUrlToken
    )
  })

  test('should return error result on repository error', async () => {
    const filesRepositoryStub = <IFilesRepository>{}
    filesRepositoryStub.getFile = jest.fn().mockRejectedValue(new ReadError())
    const sut = new GetFileAndDataset(filesRepositoryStub)

    await expect(sut.execute(1)).rejects.toThrow(ReadError)
  })
})
