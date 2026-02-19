import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import { ApiConfig, ReadError, WriteError } from '../../../src'
import { GuestbooksRepository } from '../../../src/guestbooks/infra/repositories/GuestbooksRepository'
import { CreateGuestbookDTO } from '../../../src/guestbooks/domain/dtos/CreateGuestbookDTO'
import { TestConstants } from '../../testHelpers/TestConstants'
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
      expect(actual).toBeUndefined()
    })

    test('should create guestbook for collection by collection alias', async () => {
      const actual = await sut.createGuestbook(testCollectionAlias, createGuestbookDTO)
      expect(actual).toBeUndefined()
    })

    test('should return error when collection does not exist', async () => {
      await expect(sut.createGuestbook(999999, createGuestbookDTO)).rejects.toThrow(WriteError)
    })
  })

  describe('getGuestbooksBycollectionId', () => {
    test('should list guestbooks for collection', async () => {
      await sut.createGuestbook(testCollectionId, createGuestbookDTO)
      const actual = await sut.getGuestbooksBycollectionId(testCollectionId)
      console.log('actual guestbooks: ', actual)
      expect(actual.length).toBeGreaterThan(0)
      createdGuestbookId = actual[0].id as number
    })

    test('should list guestbooks for collection by collection alias', async () => {
      await sut.createGuestbook(testCollectionAlias, createGuestbookDTO)
      const actual = await sut.getGuestbooksBycollectionId(testCollectionAlias)
      console.log('actual guestbooks: ', actual)
      expect(actual.length).toBeGreaterThan(0)
    })

    test('should return error when collection does not exist', async () => {
      await expect(sut.getGuestbooksBycollectionId(999999)).rejects.toThrow(ReadError)
    })
  })

  describe('getGuestbook', () => {
    test('should get guestbook by id', async () => {
      await sut.createGuestbook(testCollectionId, createGuestbookDTO)
      const actual = await sut.getGuestbook(createdGuestbookId as number)
      console.log('getGuestbook guestbooks: ', actual)
      expect(actual.id).toBe(createdGuestbookId)
      expect(actual.name).toBe(createGuestbookDTO.name)
    })

    test('should return error when guestbook does not exist', async () => {
      await expect(sut.getGuestbook(999999)).rejects.toThrow(ReadError)
    })
  })

  describe('setGuestbookEnabled', () => {
    test('should disable guestbook', async () => {
      await sut.createGuestbook(testCollectionId, createGuestbookDTO)

      await sut.setGuestbookEnabled(testCollectionId, createdGuestbookId as number, false)
      const actual = await sut.getGuestbook(createdGuestbookId as number)

      expect(actual.enabled).toBe(false)
    })

    test('should enable guestbook', async () => {
      await sut.setGuestbookEnabled(testCollectionId, createdGuestbookId as number, true)
      const actual = await sut.getGuestbook(createdGuestbookId as number)

      expect(actual.enabled).toBe(true)
    })

    test('should return error when guestbook does not exist', async () => {
      await expect(sut.setGuestbookEnabled(testCollectionId, 999999, false)).rejects.toThrow(
        WriteError
      )
    })
  })
})
