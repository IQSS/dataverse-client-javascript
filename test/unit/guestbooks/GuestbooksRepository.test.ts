import axios from 'axios'
import {
  ApiConfig,
  DataverseApiAuthMechanism
} from '../../../src/core/infra/repositories/ApiConfig'
import { GuestbooksRepository } from '../../../src/guestbooks/infra/repositories/GuestbooksRepository'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'
import { TestConstants } from '../../testHelpers/TestConstants'
import { EventType } from '../../../src/guestbooks/domain/models/GuestbookResponse'
import { EditGuestbookDTO } from '../../../src/guestbooks/domain/dtos/EditGuestbookDTO'

describe('GuestbooksRepository', () => {
  const sut = new GuestbooksRepository()
  const collectionIdOrAlias = 'collectionAlias'
  const guestbooksResponseWithoutStats = {
    data: {
      status: 'OK',
      data: [
        {
          id: 12,
          name: 'test',
          enabled: true,
          emailRequired: true,
          nameRequired: true,
          institutionRequired: false,
          positionRequired: false,
          customQuestions: [],
          createTime: '2024-01-01T00:00:00Z',
          dataverseId: 10
        }
      ]
    }
  }
  const guestbooksResponse = {
    data: {
      status: 'OK',
      data: [
        {
          id: 12,
          name: 'test',
          enabled: true,
          emailRequired: true,
          nameRequired: true,
          institutionRequired: false,
          positionRequired: false,
          customQuestions: [],
          createTime: '2024-01-01T00:00:00Z',
          dataverseId: 10,
          usageCount: 3,
          responseCount: 2
        }
      ]
    }
  }
  const guestbookResponsesResponse = {
    data: {
      status: 'OK',
      data: [
        {
          id: 13,
          dataset: 'Replication Data for:',
          datasetPid: 'FK2/BQEPWW',
          date: '2026-06-08T23:50:49Z',
          type: EventType.DOWNLOAD,
          fileName: 'dp_statistics_for_grade_grouped_by_student_id.html',
          fileId: 3,
          name: 'Guest',
          email: 'guest@example.edu'
        }
      ]
    }
  }
  const guestbookResponsesOfAGuestbookResponse = {
    data: {
      status: 'OK',
      data: {
        guestbook: guestbooksResponse.data.data[0],
        responses: guestbookResponsesResponse.data.data,
        pagination: {
          next: `${TestConstants.TEST_API_URL}/guestbooks/12/responses?limit=10&offset=10`,
          totalResponses: 1
        }
      }
    }
  }
  const guestbookResponsesCsv =
    'Guestbook,Dataset,Dataset PID,Date,Type,File Name,File Id,File PID,User Name,Email,Institution,Position,Custom Questions'
  const editGuestbookDTO: EditGuestbookDTO = {
    name: 'edited test',
    enabled: true,
    emailRequired: true,
    nameRequired: true,
    institutionRequired: false,
    positionRequired: false,
    createTime: '2026-06-12T00:00:00Z',
    customQuestions: [
      {
        id: 1,
        question: "how's your day",
        required: true,
        displayOrder: 0,
        type: 'text',
        hidden: false
      },
      {
        question: 'What color car do you drive',
        required: true,
        displayOrder: 1,
        type: 'options',
        hidden: false,
        optionValues: [
          { id: 10, value: 'Red', displayOrder: 0 },
          { value: 'White', displayOrder: 1 }
        ]
      }
    ]
  }

  beforeEach(() => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      TestConstants.TEST_DUMMY_API_KEY
    )

    jest.clearAllMocks()
  })

  describe('getGuestbooksByCollectionId', () => {
    test('should list guestbooks without stats by default', async () => {
      jest.spyOn(axios, 'get').mockResolvedValue(guestbooksResponseWithoutStats)

      const actual = await sut.getGuestbooksByCollectionId(collectionIdOrAlias)

      expect(axios.get).toHaveBeenCalledWith(
        `${TestConstants.TEST_API_URL}/guestbooks/${collectionIdOrAlias}/list`,
        TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
      )
      expect(actual).toStrictEqual(guestbooksResponseWithoutStats.data.data)
      expect(actual[0].usageCount).toBeUndefined()
      expect(actual[0].responseCount).toBeUndefined()
    })

    test('should list guestbooks with stats when includeStats is true', async () => {
      jest.spyOn(axios, 'get').mockResolvedValue(guestbooksResponse)

      const actual = await sut.getGuestbooksByCollectionId(collectionIdOrAlias, true)

      expect(axios.get).toHaveBeenCalledWith(
        `${TestConstants.TEST_API_URL}/guestbooks/${collectionIdOrAlias}/list`,
        {
          params: {
            includeStats: true
          },
          headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY.headers
        }
      )
      expect(actual[0].usageCount).toBe(3)
      expect(actual[0].responseCount).toBe(2)
    })

    test('should list guestbooks with inherited guestbooks when includeInherited is true', async () => {
      jest.spyOn(axios, 'get').mockResolvedValue(guestbooksResponseWithoutStats)

      const actual = await sut.getGuestbooksByCollectionId(collectionIdOrAlias, false, true)

      expect(axios.get).toHaveBeenCalledWith(
        `${TestConstants.TEST_API_URL}/guestbooks/${collectionIdOrAlias}/list`,
        {
          params: {
            includeInherited: true
          },
          headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY.headers
        }
      )
      expect(actual).toStrictEqual(guestbooksResponseWithoutStats.data.data)
    })

    test('should list guestbooks with stats and inherited guestbooks when both options are true', async () => {
      jest.spyOn(axios, 'get').mockResolvedValue(guestbooksResponse)

      const actual = await sut.getGuestbooksByCollectionId(collectionIdOrAlias, true, true)

      expect(axios.get).toHaveBeenCalledWith(
        `${TestConstants.TEST_API_URL}/guestbooks/${collectionIdOrAlias}/list`,
        {
          params: {
            includeStats: true,
            includeInherited: true
          },
          headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY.headers
        }
      )
      expect(actual).toStrictEqual(guestbooksResponse.data.data)
    })

    test('should return error result on error response', async () => {
      jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

      await expect(sut.getGuestbooksByCollectionId(collectionIdOrAlias, true)).rejects.toThrow(
        ReadError
      )
    })
  })

  describe('editGuestbook', () => {
    test('should edit guestbook', async () => {
      jest.spyOn(axios, 'put').mockResolvedValue({ data: { status: 'OK' } })

      const actual = await sut.editGuestbook(12, editGuestbookDTO)

      expect(axios.put).toHaveBeenCalledWith(
        `${TestConstants.TEST_API_URL}/guestbooks/12`,
        JSON.stringify(editGuestbookDTO),
        TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
      )
      const requestPayload = JSON.parse(
        (axios.put as jest.Mock).mock.calls[0][1] as string
      ) as EditGuestbookDTO & { id?: number }
      expect(requestPayload.id).toBeUndefined()
      expect(requestPayload?.customQuestions?.[0].id).toBe(1)
      expect(requestPayload?.customQuestions?.[1].optionValues?.[0].id).toBe(10)
      expect(actual).toBeUndefined()
    })

    test('should edit guestbook without custom questions in payload', async () => {
      jest.spyOn(axios, 'put').mockResolvedValue({ data: { status: 'OK' } })
      const editGuestbookDTOWithoutCustomQuestions: EditGuestbookDTO = {
        name: editGuestbookDTO.name,
        enabled: editGuestbookDTO.enabled,
        emailRequired: editGuestbookDTO.emailRequired,
        nameRequired: editGuestbookDTO.nameRequired,
        institutionRequired: editGuestbookDTO.institutionRequired,
        positionRequired: editGuestbookDTO.positionRequired,
        createTime: editGuestbookDTO.createTime
      }

      const actual = await sut.editGuestbook(12, editGuestbookDTOWithoutCustomQuestions)

      expect(axios.put).toHaveBeenCalledWith(
        `${TestConstants.TEST_API_URL}/guestbooks/12`,
        JSON.stringify(editGuestbookDTOWithoutCustomQuestions),
        TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
      )
      const requestPayload = JSON.parse(
        (axios.put as jest.Mock).mock.calls[0][1] as string
      ) as EditGuestbookDTO
      expect(requestPayload.customQuestions).toBeUndefined()
      expect(actual).toBeUndefined()
    })

    test('should return error result on error response', async () => {
      jest.spyOn(axios, 'put').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

      await expect(sut.editGuestbook(12, editGuestbookDTO)).rejects.toThrow()
    })
  })

  describe('getGuestbookResponsesByGuestbookId', () => {
    test('should list guestbook responses for a guestbook', async () => {
      jest.spyOn(axios, 'get').mockResolvedValue(guestbookResponsesOfAGuestbookResponse)

      const actual = await sut.getGuestbookResponsesByGuestbookId(12)

      expect(axios.get).toHaveBeenCalledWith(
        `${TestConstants.TEST_API_URL}/guestbooks/12/responses`,
        {
          params: {
            limit: 10,
            offset: 0
          },
          headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY.headers
        }
      )
      expect(actual).toStrictEqual({
        guestbookResponses: guestbookResponsesOfAGuestbookResponse.data.data.responses,
        totalGuestbookResponseCount:
          guestbookResponsesOfAGuestbookResponse.data.data.pagination.totalResponses
      })
    })

    test('should list guestbook responses with pagination', async () => {
      jest.spyOn(axios, 'get').mockResolvedValue(guestbookResponsesOfAGuestbookResponse)

      const actual = await sut.getGuestbookResponsesByGuestbookId(12, 25, 50)

      expect(axios.get).toHaveBeenCalledWith(
        `${TestConstants.TEST_API_URL}/guestbooks/12/responses`,
        {
          params: {
            limit: 25,
            offset: 50
          },
          headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY.headers
        }
      )
      expect(actual).toStrictEqual({
        guestbookResponses: guestbookResponsesOfAGuestbookResponse.data.data.responses,
        totalGuestbookResponseCount:
          guestbookResponsesOfAGuestbookResponse.data.data.pagination.totalResponses
      })
    })

    test('should return error result on error response', async () => {
      jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

      await expect(sut.getGuestbookResponsesByGuestbookId(12)).rejects.toThrow(ReadError)
    })
  })

  describe('downloadGuestbookResponsesByCollectionId', () => {
    test('should download guestbook responses for collection', async () => {
      jest.spyOn(axios, 'get').mockResolvedValue({ data: guestbookResponsesCsv })

      const actual = await sut.downloadGuestbookResponsesByCollectionId(collectionIdOrAlias)

      expect(axios.get).toHaveBeenCalledWith(
        `${TestConstants.TEST_API_URL}/dataverses/${collectionIdOrAlias}/guestbookResponses`,
        TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
      )
      expect(actual).toStrictEqual(guestbookResponsesCsv)
    })

    test('should download guestbook responses filtered by guestbook id', async () => {
      jest.spyOn(axios, 'get').mockResolvedValue({ data: guestbookResponsesCsv })

      const actual = await sut.downloadGuestbookResponsesByCollectionId(collectionIdOrAlias, 12)

      expect(axios.get).toHaveBeenCalledWith(
        `${TestConstants.TEST_API_URL}/dataverses/${collectionIdOrAlias}/guestbookResponses`,
        {
          params: {
            guestbookId: 12
          },
          headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY.headers
        }
      )
      expect(actual).toStrictEqual(guestbookResponsesCsv)
    })

    test('should return error result on error response', async () => {
      jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

      await expect(
        sut.downloadGuestbookResponsesByCollectionId(collectionIdOrAlias)
      ).rejects.toThrow(ReadError)
    })
  })
})
