import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import { ApiConfig, ReadError, WriteError } from '../../../src'
import { GuestbooksRepository } from '../../../src/guestbooks/infra/repositories/GuestbooksRepository'
import { CreateGuestbookDTO } from '../../../src/guestbooks/domain/dtos/CreateGuestbookDTO'
import { TestConstants } from '../../testHelpers/TestConstants'
import {
  createDataset,
  CreatedDatasetIdentifiers,
  DatasetNotNumberedVersion,
  getDataset
} from '../../../src/datasets'
import {
  deletePublishedDatasetViaApi,
  deleteUnpublishedDatasetViaApi,
  publishDatasetViaApi,
  waitForNoLocks
} from '../../testHelpers/datasets/datasetHelper'
import {
  createCollectionViaApi,
  deleteCollectionViaApi,
  publishCollectionViaApi
} from '../../testHelpers/collections/collectionHelper'
import { CollectionPayload } from '../../../src/collections/infra/repositories/transformers/CollectionPayload'
import { AccessRepository } from '../../../src/access/infra/repositories/AccessRepository'
import { GuestbookResponseDTO } from '../../../src/access/domain/dtos/GuestbookResponseDTO'
import { testTextFile1Name, uploadFileViaApi } from '../../testHelpers/files/filesHelper'
import { FilesRepository } from '../../../src/files/infra/repositories/FilesRepository'
import { FileOrderCriteria } from '../../../src/files/domain/models/FileCriteria'

describe('GuestbooksRepository', () => {
  const sut = new GuestbooksRepository()
  const accessRepository = new AccessRepository()
  const filesRepository = new FilesRepository()
  const testCollectionAlias = 'testGuestbooksRepository'
  let testCollectionId: number
  let createdGuestbookId: number

  const createGuestbookDTO: CreateGuestbookDTO = {
    name: 'my test guestbook',
    enabled: true,
    emailRequired: true,
    nameRequired: true,
    institutionRequired: false,
    positionRequired: false,
    customQuestions: [
      {
        question: "how's your day",
        required: true,
        displayOrder: 0,
        type: 'text',
        hidden: false
      },
      {
        question: 'Describe yourself',
        required: false,
        displayOrder: 1,
        type: 'textarea',
        hidden: false
      },
      {
        question: 'What color car do you drive',
        required: true,
        displayOrder: 2,
        type: 'options',
        hidden: false,
        optionValues: [
          { value: 'Red', displayOrder: 0 },
          { value: 'White', displayOrder: 1 },
          { value: 'Yellow', displayOrder: 2 },
          { value: 'Purple', displayOrder: 3 }
        ]
      }
    ]
  }

  beforeAll(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )

    await createCollectionViaApi(testCollectionAlias).then(
      (collectionPayload: CollectionPayload) => (testCollectionId = collectionPayload.id)
    )
    await publishCollectionViaApi(testCollectionAlias)
  })

  afterAll(async () => {
    await deleteCollectionViaApi(testCollectionAlias)
  })

  describe('createGuestbook', () => {
    test('should create guestbook for collection', async () => {
      const actual = await sut.createGuestbook(testCollectionId, createGuestbookDTO)
      expect(actual).toEqual(expect.any(Number))
      expect(actual).toBeGreaterThan(0)

      const getGuestbookResponse = await sut.getGuestbook(actual)
      expect(getGuestbookResponse.name).toBe(createGuestbookDTO.name)
    })

    test('should create guestbook for collection by collection alias', async () => {
      const actual = await sut.createGuestbook(testCollectionAlias, createGuestbookDTO)
      expect(actual).toEqual(expect.any(Number))
      expect(actual).toBeGreaterThan(0)

      const getGuestbookResponse = await sut.getGuestbook(actual)
      expect(getGuestbookResponse.name).toBe(createGuestbookDTO.name)
    })

    test('should return error when collection does not exist', async () => {
      await expect(sut.createGuestbook(999999, createGuestbookDTO)).rejects.toThrow(WriteError)
    })
  })

  describe('getGuestbooksByCollectionId', () => {
    test('should list guestbooks for collection', async () => {
      createdGuestbookId = await sut.createGuestbook(testCollectionId, createGuestbookDTO)
      const actual = await sut.getGuestbooksByCollectionId(testCollectionId)
      expect(actual.length).toBeGreaterThan(0)
      const createdGuestbook = actual.find((guestbook) => guestbook.id === createdGuestbookId)
      expect(createdGuestbook).toBeDefined()
      expect(createdGuestbook?.usageCount).toBeUndefined()
      expect(createdGuestbook?.responseCount).toBeUndefined()
    })

    test('should list guestbooks for collection by collection alias', async () => {
      const createdByAliasGuestbookId = await sut.createGuestbook(
        testCollectionAlias,
        createGuestbookDTO
      )
      const actual = await sut.getGuestbooksByCollectionId(testCollectionAlias)
      expect(actual.length).toBeGreaterThan(0)
      expect(actual.some((guestbook) => guestbook.id === createdByAliasGuestbookId)).toBe(true)
    })

    test('should list guestbooks for collection with stats', async () => {
      const createdGuestbookIdWithStats = await sut.createGuestbook(
        testCollectionAlias,
        createGuestbookDTO
      )
      const actual = await sut.getGuestbooksByCollectionId(testCollectionAlias, true)
      const createdGuestbookWithStats = actual.find(
        (guestbook) => guestbook.id === createdGuestbookIdWithStats
      )

      expect(createdGuestbookWithStats).toBeDefined()
      expect(createdGuestbookWithStats?.usageCount).toEqual(expect.any(Number))
      expect(createdGuestbookWithStats?.responseCount).toEqual(expect.any(Number))
    })

    test('should increment usageCount when assigned by the dataset admin and responseCount only when a guest submits a response', async () => {
      let statsDatasetIds: CreatedDatasetIdentifiers | undefined
      let statsDatasetPublished = false
      const guestbookResponse: GuestbookResponseDTO = {
        guestbookResponse: {
          name: 'Guestbook Stats Test',
          email: 'guestbook-stats@example.edu'
        }
      }
      const statsGuestbookId = await sut.createGuestbook(testCollectionAlias, {
        ...createGuestbookDTO,
        name: 'guestbook stats test',
        customQuestions: []
      })

      try {
        const initialStats = await getGuestbookStats(statsGuestbookId)
        statsDatasetIds = await createDataset.execute(
          TestConstants.TEST_NEW_DATASET_DTO,
          testCollectionAlias
        )
        await uploadFileViaApi(statsDatasetIds.numericId, testTextFile1Name)
        const datasetFiles = await filesRepository.getDatasetFiles(
          statsDatasetIds.numericId,
          DatasetNotNumberedVersion.LATEST,
          false,
          FileOrderCriteria.NAME_AZ
        )
        const fileId = datasetFiles.files[0].id

        await sut.assignDatasetGuestbook(statsDatasetIds.numericId, statsGuestbookId)

        const statsAfterAssignment = await getGuestbookStats(statsGuestbookId)
        expect(statsAfterAssignment.usageCount).toBe((initialStats.usageCount ?? 0) + 1)
        expect(statsAfterAssignment.responseCount).toBe(initialStats.responseCount ?? 0)

        await publishDatasetViaApi(statsDatasetIds.numericId)
        statsDatasetPublished = true
        await waitForNoLocks(statsDatasetIds.numericId, 10)

        ApiConfig.init(
          TestConstants.TEST_API_URL,
          DataverseApiAuthMechanism.BEARER_TOKEN,
          undefined,
          undefined,
          () => null
        )
        await accessRepository.submitGuestbookForDatafileDownload(fileId, guestbookResponse)

        ApiConfig.init(
          TestConstants.TEST_API_URL,
          DataverseApiAuthMechanism.API_KEY,
          process.env.TEST_API_KEY
        )
        const statsAfterResponse = await getGuestbookStats(statsGuestbookId)
        expect(statsAfterResponse.usageCount).toBe(statsAfterAssignment.usageCount)
        expect(statsAfterResponse.responseCount).toBe((statsAfterAssignment.responseCount ?? 0) + 1)
      } finally {
        ApiConfig.init(
          TestConstants.TEST_API_URL,
          DataverseApiAuthMechanism.API_KEY,
          process.env.TEST_API_KEY
        )
        if (statsDatasetIds !== undefined) {
          if (statsDatasetPublished) {
            await deletePublishedDatasetViaApi(statsDatasetIds.persistentId)
          } else {
            await deleteUnpublishedDatasetViaApi(statsDatasetIds.numericId)
          }
        }
      }
    })

    test('should include hierarchical owner guestbooks when includeInherited is true', async () => {
      const uniqueSuffix = Date.now().toString()
      const childCollectionAlias = `testGuestbooksInheritedChild${uniqueSuffix}`
      const parentGuestbookName = `parent inherited guestbook ${uniqueSuffix}`
      const childGuestbookName = `child inherited guestbook ${uniqueSuffix}`

      let childCollectionId: number | undefined

      try {
        await createCollectionViaApi(childCollectionAlias, testCollectionAlias).then(
          (collectionPayload: CollectionPayload) => (childCollectionId = collectionPayload.id)
        )
        await publishCollectionViaApi(childCollectionAlias)

        const parentGuestbookId = await sut.createGuestbook(testCollectionAlias, {
          ...createGuestbookDTO,
          name: parentGuestbookName,
          customQuestions: []
        })
        const childGuestbookId = await sut.createGuestbook(childCollectionAlias, {
          ...createGuestbookDTO,
          name: childGuestbookName,
          customQuestions: []
        })

        const withoutInherited = await sut.getGuestbooksByCollectionId(childCollectionAlias)
        const withInherited = await sut.getGuestbooksByCollectionId(
          childCollectionAlias,
          false,
          true
        )

        expect(childCollectionId).toBeDefined()
        expect(withoutInherited.some((guestbook) => guestbook.id === childGuestbookId)).toBe(true)
        expect(withoutInherited.some((guestbook) => guestbook.id === parentGuestbookId)).toBe(false)

        expect(withInherited.some((guestbook) => guestbook.id === childGuestbookId)).toBe(true)
        expect(withInherited.some((guestbook) => guestbook.id === parentGuestbookId)).toBe(true)

        const inheritedGuestbook = withInherited.find(
          (guestbook) => guestbook.id === parentGuestbookId
        )
        expect(inheritedGuestbook?.name).toBe(parentGuestbookName)
      } finally {
        if (childCollectionId !== undefined) {
          await deleteCollectionViaApi(childCollectionAlias)
        }
      }
    })

    test('should not include hierarchical owner guestbooks when includeInherited is false', async () => {
      const uniqueSuffix = Date.now().toString()
      const childCollectionAlias = `testGuestbooksNoInheritedChild${uniqueSuffix}`
      const parentGuestbookName = `parent non inherited guestbook ${uniqueSuffix}`
      const childGuestbookName = `child non inherited guestbook ${uniqueSuffix}`

      let childCollectionId: number | undefined

      try {
        await createCollectionViaApi(childCollectionAlias, testCollectionAlias).then(
          (collectionPayload: CollectionPayload) => (childCollectionId = collectionPayload.id)
        )
        await publishCollectionViaApi(childCollectionAlias)

        const parentGuestbookId = await sut.createGuestbook(testCollectionAlias, {
          ...createGuestbookDTO,
          name: parentGuestbookName,
          customQuestions: []
        })
        const childGuestbookId = await sut.createGuestbook(childCollectionAlias, {
          ...createGuestbookDTO,
          name: childGuestbookName,
          customQuestions: []
        })

        const withoutInherited = await sut.getGuestbooksByCollectionId(
          childCollectionAlias,
          false,
          false
        )

        expect(childCollectionId).toBeDefined()
        expect(withoutInherited.some((guestbook) => guestbook.id === childGuestbookId)).toBe(true)
        expect(withoutInherited.some((guestbook) => guestbook.id === parentGuestbookId)).toBe(false)
      } finally {
        if (childCollectionId !== undefined) {
          await deleteCollectionViaApi(childCollectionAlias)
        }
      }
    })

    test('should return inherited guestbooks for unpublished child collection when includeInherited is true', async () => {
      const uniqueSuffix = Date.now().toString()
      const unpublishedChildCollectionAlias = `testGuestbooksUnpublishedChild${uniqueSuffix}`
      const parentGuestbookName = `parent unpublished child guestbook ${uniqueSuffix}`
      let childCollectionId: number | undefined
      let parentGuestbookId: number | undefined

      try {
        await createCollectionViaApi(unpublishedChildCollectionAlias, testCollectionAlias).then(
          (collectionPayload: CollectionPayload) => (childCollectionId = collectionPayload.id)
        )

        parentGuestbookId = await sut.createGuestbook(testCollectionAlias, {
          ...createGuestbookDTO,
          name: parentGuestbookName,
          customQuestions: []
        })

        const actual = await sut.getGuestbooksByCollectionId(
          unpublishedChildCollectionAlias,
          false,
          true
        )

        expect(childCollectionId).toBeDefined()
        expect(parentGuestbookId).toBeDefined()
        expect(actual.some((guestbook) => guestbook.id === parentGuestbookId)).toBe(true)
        expect(actual.some((guestbook) => guestbook.name === parentGuestbookName)).toBe(true)
      } finally {
        if (childCollectionId !== undefined) {
          await deleteCollectionViaApi(unpublishedChildCollectionAlias)
        }
      }
    })

    test('should return error when collection does not exist', async () => {
      await expect(sut.getGuestbooksByCollectionId(999999)).rejects.toThrow(ReadError)
    })
  })

  const getGuestbookStats = async (guestbookId: number) => {
    const guestbooks = await sut.getGuestbooksByCollectionId(testCollectionAlias, true)
    const guestbook = guestbooks.find((guestbook) => guestbook.id === guestbookId)

    if (guestbook === undefined) {
      throw new Error(`Guestbook ${guestbookId} was not found in collection stats.`)
    }

    return guestbook
  }

  describe('getGuestbook', () => {
    test('should get guestbook by id', async () => {
      createdGuestbookId = await sut.createGuestbook(testCollectionId, createGuestbookDTO)
      const actual = await sut.getGuestbook(createdGuestbookId)
      expect(actual.id).toBe(createdGuestbookId)
      expect(actual.name).toBe(createGuestbookDTO.name)
    })

    test('should return error when guestbook does not exist', async () => {
      await expect(sut.getGuestbook(999999)).rejects.toThrow(ReadError)
    })
  })

  describe('downloadGuestbookResponsesByDataverseId', () => {
    test('should download all guestbook responses for a dataverse collection', async () => {
      const setup = await createGuestbookDownloadSetup('all responses export test')

      try {
        const actual = await sut.downloadGuestbookResponsesByDataverseId(testCollectionAlias)

        expect(actual).toContain('Guestbook, Dataset, Dataset PID, Date, Type, File Name')
        expect(actual).toContain(setup.guestbookName)
        expect(actual).toContain(setup.datasetPersistentId)
        expect(actual).toContain(setup.email)
        expect(actual).toContain(testTextFile1Name)
      } finally {
        await cleanupGuestbookDownloadSetup(setup)
      }
    })

    test('should download responses only for the specified guestbook', async () => {
      const setup = await createGuestbookDownloadSetup('single guestbook export test')

      try {
        const actual = await sut.downloadGuestbookResponsesByDataverseId(
          testCollectionAlias,
          setup.guestbookId
        )

        expect(actual).toContain('Guestbook, Dataset, Dataset PID, Date, Type, File Name')
        expect(actual).toContain(setup.guestbookName)
        expect(actual).toContain(setup.datasetPersistentId)
        expect(actual).toContain(setup.email)
        expect(actual).toContain(testTextFile1Name)
      } finally {
        await cleanupGuestbookDownloadSetup(setup)
      }
    })
  })

  describe('setGuestbookEnabled', () => {
    test('should disable guestbook', async () => {
      createdGuestbookId = await sut.createGuestbook(testCollectionId, createGuestbookDTO)

      await sut.setGuestbookEnabled(testCollectionId, createdGuestbookId, false)
      const actual = await sut.getGuestbook(createdGuestbookId)

      expect(actual.enabled).toBe(false)
    })

    test('should enable guestbook', async () => {
      await sut.setGuestbookEnabled(testCollectionId, createdGuestbookId, true)
      const actual = await sut.getGuestbook(createdGuestbookId)

      expect(actual.enabled).toBe(true)
    })

    test('should return error when guestbook does not exist', async () => {
      await expect(sut.setGuestbookEnabled(testCollectionId, 999999, false)).rejects.toThrow(
        WriteError
      )
    })
  })

  describe('assignDatasetGuestbook / removeDatasetGuestbook', () => {
    let testDatasetIds: CreatedDatasetIdentifiers
    let assignableGuestbookId: number

    beforeAll(async () => {
      assignableGuestbookId = await sut.createGuestbook(testCollectionId, {
        ...createGuestbookDTO,
        name: 'assign/remove guestbook test'
      })

      testDatasetIds = await createDataset.execute(
        TestConstants.TEST_NEW_DATASET_DTO,
        testCollectionAlias
      )
    })

    afterAll(async () => {
      await deleteUnpublishedDatasetViaApi(testDatasetIds.numericId)
    })

    describe('assignDatasetGuestbook', () => {
      test('should assign guestbook to dataset by numeric id', async () => {
        const actual = await sut.assignDatasetGuestbook(
          testDatasetIds.numericId,
          assignableGuestbookId
        )
        expect(actual).toBeUndefined()
      })

      test('should return guestbookId in dataset response after assigning guestbook', async () => {
        await sut.assignDatasetGuestbook(testDatasetIds.numericId, assignableGuestbookId)

        const dataset = await getDataset.execute(
          testDatasetIds.numericId,
          DatasetNotNumberedVersion.LATEST
        )

        expect(dataset.guestbookId).toBe(assignableGuestbookId)
      })

      test('should assign guestbook to dataset by persistent id', async () => {
        const actual = await sut.assignDatasetGuestbook(
          testDatasetIds.persistentId,
          assignableGuestbookId
        )
        expect(actual).toBeUndefined()
      })

      test('should return error when assigning guestbook to non-existent dataset', async () => {
        await expect(sut.assignDatasetGuestbook(999999, assignableGuestbookId)).rejects.toThrow(
          WriteError
        )
      })
    })

    describe('removeDatasetGuestbook', () => {
      test('should remove guestbook from dataset by numeric id', async () => {
        await sut.assignDatasetGuestbook(testDatasetIds.numericId, assignableGuestbookId)
        const actual = await sut.removeDatasetGuestbook(testDatasetIds.numericId)
        expect(actual).toBeUndefined()
      })

      test('should remove guestbook from dataset by persistent id', async () => {
        await sut.assignDatasetGuestbook(testDatasetIds.numericId, assignableGuestbookId)
        const actual = await sut.removeDatasetGuestbook(testDatasetIds.persistentId)
        expect(actual).toBeUndefined()
      })

      test('should return error when removing guestbook from non-existent dataset', async () => {
        await expect(sut.removeDatasetGuestbook(999999)).rejects.toThrow(WriteError)
      })
    })
  })

  const createGuestbookDownloadSetup = async (guestbookName: string) => {
    const uniqueSuffix = Date.now().toString()
    const guestbookId = await sut.createGuestbook(testCollectionAlias, {
      ...createGuestbookDTO,
      name: `${guestbookName}-${uniqueSuffix}`,
      customQuestions: []
    })
    const datasetIds = await createDataset.execute(
      TestConstants.TEST_NEW_DATASET_DTO,
      testCollectionAlias
    )
    await uploadFileViaApi(datasetIds.numericId, testTextFile1Name)
    const datasetFiles = await filesRepository.getDatasetFiles(
      datasetIds.numericId,
      DatasetNotNumberedVersion.LATEST,
      false,
      FileOrderCriteria.NAME_AZ
    )
    const fileId = datasetFiles.files[0].id
    const email = `guestbook-download-${uniqueSuffix}@example.edu`

    await sut.assignDatasetGuestbook(datasetIds.numericId, guestbookId)
    await publishDatasetViaApi(datasetIds.numericId)
    await waitForNoLocks(datasetIds.numericId, 10)

    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.BEARER_TOKEN,
      undefined,
      undefined,
      () => null
    )
    await accessRepository.submitGuestbookForDatafileDownload(fileId, {
      guestbookResponse: {
        name: `Guestbook Download ${uniqueSuffix}`,
        email
      }
    })

    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )

    return {
      guestbookId,
      guestbookName: `${guestbookName}-${uniqueSuffix}`,
      datasetNumericId: datasetIds.numericId,
      datasetPersistentId: datasetIds.persistentId,
      email
    }
  }

  const cleanupGuestbookDownloadSetup = async (setup: {
    datasetNumericId: number
    datasetPersistentId: string
  }) => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
    await deletePublishedDatasetViaApi(setup.datasetPersistentId)
  }
})
