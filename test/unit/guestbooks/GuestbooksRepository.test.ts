import axios from 'axios'
import {
  ApiConfig,
  DataverseApiAuthMechanism
} from '../../../src/core/infra/repositories/ApiConfig'
import { GuestbooksRepository } from '../../../src/guestbooks/infra/repositories/GuestbooksRepository'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'
import { TestConstants } from '../../testHelpers/TestConstants'

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
          guestbookId: 12,
          dataverseId: 10,
          name: 'Guest User',
          email: 'guest@example.edu'
        }
      ]
    }
  }
  const guestbookResponsesCsv =
    'Guestbook,Dataset,Dataset PID,Date,Type,File Name,File Id,File PID,User Name,Email,Institution,Position,Custom Questions'

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

    test('should return error result on error response', async () => {
      jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

      await expect(sut.getGuestbooksByCollectionId(collectionIdOrAlias, true)).rejects.toThrow(
        ReadError
      )
    })
  })

  describe('getGuestbookResponsesByDataverseId', () => {
    test('should list guestbook responses for dataverse', async () => {
      jest.spyOn(axios, 'get').mockResolvedValue(guestbookResponsesResponse)

      const actual = await sut.getGuestbookResponsesByDataverseId(collectionIdOrAlias)

      expect(axios.get).toHaveBeenCalledWith(
        `${TestConstants.TEST_API_URL}/dataverses/${collectionIdOrAlias}/guestbookResponses`,
        TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
      )
      expect(actual).toStrictEqual(guestbookResponsesResponse.data.data)
    })

    test('should list guestbook responses filtered by guestbook id', async () => {
      jest.spyOn(axios, 'get').mockResolvedValue(guestbookResponsesResponse)

      const actual = await sut.getGuestbookResponsesByDataverseId(collectionIdOrAlias, 12)

      expect(axios.get).toHaveBeenCalledWith(
        `${TestConstants.TEST_API_URL}/dataverses/${collectionIdOrAlias}/guestbookResponses`,
        {
          params: {
            guestbookId: 12
          },
          headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY.headers
        }
      )
      expect(actual).toStrictEqual(guestbookResponsesResponse.data.data)
    })

    test('should return error result on error response', async () => {
      jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

      await expect(sut.getGuestbookResponsesByDataverseId(collectionIdOrAlias)).rejects.toThrow(
        ReadError
      )
    })
  })

  describe('downloadGuestbookResponsesByDataverseId', () => {
    test('should download guestbook responses for dataverse', async () => {
      jest.spyOn(axios, 'get').mockResolvedValue({ data: guestbookResponsesCsv })

      const actual = await sut.downloadGuestbookResponsesByDataverseId(collectionIdOrAlias)

      expect(axios.get).toHaveBeenCalledWith(
        `${TestConstants.TEST_API_URL}/dataverses/${collectionIdOrAlias}/guestbookResponses`,
        TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
      )
      expect(actual).toStrictEqual(guestbookResponsesCsv)
    })

    test('should download guestbook responses filtered by guestbook id', async () => {
      jest.spyOn(axios, 'get').mockResolvedValue({ data: guestbookResponsesCsv })

      const actual = await sut.downloadGuestbookResponsesByDataverseId(collectionIdOrAlias, 12)

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
        sut.downloadGuestbookResponsesByDataverseId(collectionIdOrAlias)
      ).rejects.toThrow(ReadError)
    })
  })
})
