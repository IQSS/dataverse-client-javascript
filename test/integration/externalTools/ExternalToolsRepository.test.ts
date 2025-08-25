import {
  ApiConfig,
  DataverseApiAuthMechanism
} from '../../../src/core/infra/repositories/ApiConfig'
import { TestConstants } from '../../testHelpers/TestConstants'
import { ExternalToolsRepository } from '../../../src/externalTools/infra/ExternalToolsRepository'
import {
  deleteExternalToolViaApi,
  createExternalToolViaApi,
  CREATE_FILE_EXTERNAL_TOOL_PAYLOAD,
  CREATE_DATASET_EXTERNAL_TOOL_PAYLOAD
} from '../../testHelpers/externalTools/externalToolsHelper'
import { createDataset, CreatedDatasetIdentifiers, getDatasetFiles, WriteError } from '../../../src'
import {
  createCollectionViaApi,
  deleteCollectionViaApi
} from '../../testHelpers/collections/collectionHelper'
import { uploadFileViaApi } from '../../testHelpers/files/filesHelper'
import { deleteUnpublishedDatasetViaApi } from '../../testHelpers/datasets/datasetHelper'

describe('ExternalToolsRepository', () => {
  const sut: ExternalToolsRepository = new ExternalToolsRepository()

  beforeAll(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
  })

  describe('getExternalTools', () => {
    test('should return all external tools availables in the installation', async () => {
      const createdToolResponse = await createExternalToolViaApi('file')
      const actual = await sut.getExternalTools()

      expect(actual.length).toBe(1)
      expect(actual[0].id).toBe(createdToolResponse.data.data.id)

      await deleteExternalToolViaApi(createdToolResponse.data.data.id)
    })

    test('should return empty array if no external tools are available', async () => {
      const actual = await sut.getExternalTools()

      expect(actual.length).toBe(0)
      expect(actual).toStrictEqual([])
    })
  })

  // TODO:ME - Skip for now until Backend PR is merged to develop.
  describe.skip('getFileExternalToolUrl', () => {
    const testCollectionAlias = 'getFileExternalToolUrlFunctionalTestCollection'
    let testDatasetIds: CreatedDatasetIdentifiers
    const testTextFile1Name = 'test-file-1.txt'
    let testFileId: number
    let testDatasetExternalToolId: number
    let testFileExternalToolId: number

    beforeAll(async () => {
      try {
        // Create a Collection
        await createCollectionViaApi(testCollectionAlias)
        // Create a Dataset
        testDatasetIds = await createDataset.execute(
          TestConstants.TEST_NEW_DATASET_DTO,
          testCollectionAlias
        )
        // Upload a file to the Dataset
        await uploadFileViaApi(testDatasetIds.numericId, testTextFile1Name)
        // Save File Id
        const datasetFiles = await getDatasetFiles.execute(testDatasetIds.numericId)
        testFileId = datasetFiles.files[0].id
        // Create a dataset-level External Tool
        const createdExtToolResponse1 = await createExternalToolViaApi('dataset')
        testDatasetExternalToolId = createdExtToolResponse1.data.data.id
        // Create a file-level External Tool
        const createdExtToolResponse2 = await createExternalToolViaApi('file')
        testFileExternalToolId = createdExtToolResponse2.data.data.id
      } catch (error) {
        throw new Error('Tests beforeAll(): Error setting up test data.')
      }
    })

    afterAll(async () => {
      try {
        await deleteUnpublishedDatasetViaApi(testDatasetIds.numericId)
        await deleteCollectionViaApi(testCollectionAlias)
        await deleteExternalToolViaApi(testDatasetExternalToolId)
        await deleteExternalToolViaApi(testFileExternalToolId)
      } catch (error) {
        throw new Error('Tests afterAll(): Error cleaning up test data.')
      }
    })

    test('should return file external tool url', async () => {
      const fileExternalToolUrl = await sut.getFileExternalToolUrl(
        testFileId,
        testFileExternalToolId,
        {
          preview: true,
          locale: 'en'
        }
      )
      expect(fileExternalToolUrl.fileId).toBe(testFileId)
      expect(fileExternalToolUrl.displayName).toBe(CREATE_FILE_EXTERNAL_TOOL_PAYLOAD.displayName)
      expect(fileExternalToolUrl.toolUrlResolved).toContain(
        CREATE_FILE_EXTERNAL_TOOL_PAYLOAD.toolUrl
      )
      expect(fileExternalToolUrl.toolUrlResolved).toContain(`preview=true`)
      expect(fileExternalToolUrl.preview).toBe(true)
    })

    test('should return error if file external tool id does not exist', async () => {
      await expect(
        sut.getFileExternalToolUrl(testFileId, 999999, {
          preview: true,
          locale: 'en'
        })
      ).rejects.toThrow(WriteError) // e.g. [400] External tool not found with id: 999999
    })

    test('should return error if toolId is not for a file-level external tool', async () => {
      await expect(
        sut.getFileExternalToolUrl(testFileId, testDatasetExternalToolId, {
          preview: true,
          locale: 'en'
        })
      ).rejects.toThrow(WriteError) // e.g. [400] External tool does not have file scope.
    })

    test('should return error if file id does not exist', async () => {
      await expect(
        sut.getFileExternalToolUrl(56565656, testFileExternalToolId, {
          preview: true,
          locale: 'en'
        })
      ).rejects.toThrow(WriteError) // e.g. [404] File not found for given id: 56565656
    })
  })

  // TODO:ME - Skip for now until Backend PR is merged to develop.
  describe.skip('getDatasetExternalToolUrl', () => {
    const testCollectionAlias = 'getDatasetExternalToolUrlFunctionalTestCollection'
    let testDatasetIds: CreatedDatasetIdentifiers
    const testTextFile1Name = 'test-file-1.txt'
    let testDatasetExternalToolId: number
    let testFileExternalToolId: number

    beforeAll(async () => {
      try {
        // Create a Collection
        await createCollectionViaApi(testCollectionAlias)
        // Create a Dataset
        testDatasetIds = await createDataset.execute(
          TestConstants.TEST_NEW_DATASET_DTO,
          testCollectionAlias
        )
        // Upload a file to the Dataset
        await uploadFileViaApi(testDatasetIds.numericId, testTextFile1Name)
        // Create a dataset-level External Tool
        const createdExtToolResponse1 = await createExternalToolViaApi('dataset')
        testDatasetExternalToolId = createdExtToolResponse1.data.data.id
        // Create a file-level External Tool
        const createdExtToolResponse2 = await createExternalToolViaApi('file')
        testFileExternalToolId = createdExtToolResponse2.data.data.id
      } catch (error) {
        throw new Error('Tests beforeAll(): Error setting up test data.')
      }
    })

    afterAll(async () => {
      try {
        await deleteUnpublishedDatasetViaApi(testDatasetIds.numericId)
        await deleteCollectionViaApi(testCollectionAlias)
        await deleteExternalToolViaApi(testDatasetExternalToolId)
        await deleteExternalToolViaApi(testFileExternalToolId)
      } catch (error) {
        throw new Error('Tests afterAll(): Error cleaning up test data.')
      }
    })

    test('should return dataset external tool url', async () => {
      const datasetfileExternalToolUrl = await sut.getDatasetExternalToolUrl(
        testDatasetIds.numericId,
        testDatasetExternalToolId,
        {
          preview: true,
          locale: 'en'
        }
      )
      expect(datasetfileExternalToolUrl.datasetId).toBe(testDatasetIds.numericId)
      expect(datasetfileExternalToolUrl.displayName).toBe(
        CREATE_DATASET_EXTERNAL_TOOL_PAYLOAD.displayName
      )
      expect(datasetfileExternalToolUrl.toolUrlResolved).toContain(
        CREATE_DATASET_EXTERNAL_TOOL_PAYLOAD.toolUrl
      )
      expect(datasetfileExternalToolUrl.toolUrlResolved).toContain(`preview=true`)
      expect(datasetfileExternalToolUrl.preview).toBe(true)
    })

    test('should return error if dataset external tool id does not exist', async () => {
      await expect(
        sut.getDatasetExternalToolUrl(testDatasetIds.numericId, 999999, {
          preview: true,
          locale: 'en'
        })
      ).rejects.toThrow(WriteError) // e.g. [400] External tool not found with id: 999999
    })

    test('should return error if toolId is not for a dataset-level external tool', async () => {
      await expect(
        sut.getDatasetExternalToolUrl(testDatasetIds.numericId, testFileExternalToolId, {
          preview: true,
          locale: 'en'
        })
      ).rejects.toThrow(WriteError) // e.g. [400] External tool does not have dataset scope.
    })

    test('should return error if dataset id does not exist', async () => {
      await expect(
        sut.getDatasetExternalToolUrl(56565656, testDatasetExternalToolId, {
          preview: true,
          locale: 'en'
        })
      ).rejects.toThrow(WriteError) // e.g. [404] Dataset not found for given id: 56565656
    })
  })
})
