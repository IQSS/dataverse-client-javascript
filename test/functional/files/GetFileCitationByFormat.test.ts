import {
  ApiConfig,
  createDataset,
  CreatedDatasetIdentifiers,
  FileCitationFormat,
  getDatasetFiles,
  getFileCitationByFormat,
  ReadError
} from '../../../src'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import {
  createCollectionViaApi,
  deleteCollectionViaApi
} from '../../testHelpers/collections/collectionHelper'
import { deleteUnpublishedDatasetViaApi } from '../../testHelpers/datasets/datasetHelper'
import { uploadFileViaApi } from '../../testHelpers/files/filesHelper'
import { TestConstants } from '../../testHelpers/TestConstants'

describe('execute', () => {
  const testCollectionAlias = 'getFileCitationByFormatFunctionalTest'
  const testTextFile1Name = 'test-file-1.txt'
  let testDatasetIds: CreatedDatasetIdentifiers

  beforeAll(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
    await createCollectionViaApi(testCollectionAlias)

    try {
      testDatasetIds = await createDataset.execute(
        TestConstants.TEST_NEW_DATASET_DTO,
        testCollectionAlias
      )
    } catch (error) {
      throw new Error('Tests beforeAll(): Error while creating test dataset')
    }

    await uploadFileViaApi(testDatasetIds.numericId, testTextFile1Name).catch(() => {
      throw new Error(`Tests beforeAll(): Error while uploading file ${testTextFile1Name}`)
    })
  })

  afterAll(async () => {
    try {
      await deleteUnpublishedDatasetViaApi(testDatasetIds.numericId)
    } catch (error) {
      throw new Error('Tests afterAll(): Error while deleting test dataset')
    }

    try {
      await deleteCollectionViaApi(testCollectionAlias)
    } catch (error) {
      throw new Error('Tests afterAll(): Error while deleting test collection')
    }
  })

  const getTestFileId = async (): Promise<number> => {
    const datasetFiles = await getDatasetFiles.execute(testDatasetIds.numericId)
    return datasetFiles.files[0].id
  }

  test('should successfully get file citation in EndNote (XML) format', async () => {
    const fileId = await getTestFileId()

    const citation = await getFileCitationByFormat.execute(fileId, FileCitationFormat.ENDNOTE)

    expect(typeof citation).toBe('string')
    expect(citation.trimStart()).toMatch(/^<\?xml/)
  })

  test('should successfully get file citation in RIS (plain text) format', async () => {
    const fileId = await getTestFileId()

    const citation = await getFileCitationByFormat.execute(fileId, FileCitationFormat.RIS)

    expect(typeof citation).toBe('string')
    // RIS records use TY (type) and ER (end of record) tags
    expect(citation).toMatch(/TY\s+-/)
    expect(citation).toMatch(/ER\s+-/)
  })

  test('should successfully get file citation in BibTeX (plain text) format', async () => {
    const fileId = await getTestFileId()

    const citation = await getFileCitationByFormat.execute(fileId, FileCitationFormat.BIBTEX)

    expect(typeof citation).toBe('string')
    // BibTeX entries start with @<entry-type>{
    expect(citation.trimStart()).toMatch(/^@\w+\{/)
  })

  test('should successfully get file citation in CSL (JSON) format', async () => {
    const fileId = await getTestFileId()

    const citation = await getFileCitationByFormat.execute(fileId, FileCitationFormat.CSL)

    expect(typeof citation).toBe('string')
    const parsed = JSON.parse(citation)
    expect(typeof parsed).toBe('object')
    expect(parsed).not.toBeNull()
  })

  test('should successfully get file citation in Internal (HTML) format', async () => {
    const fileId = await getTestFileId()

    const citation = await getFileCitationByFormat.execute(fileId, FileCitationFormat.INTERNAL)

    expect(typeof citation).toBe('string')
    // Internal HTML format includes anchor tags linking to the dataset
    expect(citation).toMatch(/<a\s+href=/i)
  })

  test('should throw an error when the file id does not exist', async () => {
    const nonExistentFileId = 5

    await expect(
      getFileCitationByFormat.execute(nonExistentFileId, FileCitationFormat.BIBTEX)
    ).rejects.toThrow(ReadError)
  })
})
