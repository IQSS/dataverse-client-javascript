import { assert, createSandbox, SinonSandbox } from 'sinon'
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
  const sandbox: SinonSandbox = createSandbox()

  const testDatasetTotalDownloadSize = 123456789

  afterEach(() => {
    sandbox.restore()
  })

  test('should return dataset files total download size of the latest version given a dataset id', async () => {
    const filesRepositoryStub = <IFilesRepository>{}
    const getDatasetTotalDownloadSizeStub = sandbox.stub().returns(testDatasetTotalDownloadSize)
    filesRepositoryStub.getDatasetFilesTotalDownloadSize = getDatasetTotalDownloadSizeStub
    const sut = new GetDatasetFilesTotalDownloadSize(filesRepositoryStub)

    const actual = await sut.execute(1)

    assert.match(actual, testDatasetTotalDownloadSize)
    assert.calledWithExactly(
      getDatasetTotalDownloadSizeStub,
      1,
      DatasetNotNumberedVersion.LATEST,
      false,
      FileDownloadSizeMode.ALL,
      undefined
    )
  })

  test('should return dataset files total download size given a dataset id, version, file download size mode and search criteria', async () => {
    const filesRepositoryStub = <IFilesRepository>{}
    const getDatasetTotalDownloadSizeStub = sandbox.stub().returns(testDatasetTotalDownloadSize)
    filesRepositoryStub.getDatasetFilesTotalDownloadSize = getDatasetTotalDownloadSizeStub
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

    assert.match(actual, testDatasetTotalDownloadSize)
    assert.calledWithExactly(
      getDatasetTotalDownloadSizeStub,
      1,
      testVersionId,
      false,
      FileDownloadSizeMode.ARCHIVAL,
      testFileSearchCriteria
    )
  })

  test('should return error result on repository error', async () => {
    const filesRepositoryStub = <IFilesRepository>{}
    const testReadError = new ReadError()
    filesRepositoryStub.getDatasetFilesTotalDownloadSize = sandbox
      .stub()
      .throwsException(testReadError)
    const sut = new GetDatasetFilesTotalDownloadSize(filesRepositoryStub)

    let actualError: ReadError = undefined
    await sut.execute(1).catch((e: ReadError) => (actualError = e))

    assert.match(actualError, testReadError)
  })
})
