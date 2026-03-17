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
import { deleteUnpublishedDatasetViaApi } from '../../testHelpers/datasets/datasetHelper'
import {
  createCollectionViaApi,
  deleteCollectionViaApi
} from '../../testHelpers/collections/collectionHelper'
import { CollectionPayload } from '../../../src/collections/infra/repositories/transformers/CollectionPayload'

describe('GuestbooksRepository', () => {
  const sut = new GuestbooksRepository()
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
      expect(actual.some((guestbook) => guestbook.id === createdGuestbookId)).toBe(true)
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

    test('should return error when collection does not exist', async () => {
      await expect(sut.getGuestbooksByCollectionId(999999)).rejects.toThrow(ReadError)
    })
  })

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
})
