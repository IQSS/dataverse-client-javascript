/**
 * @jest-environment jsdom
 */

import { AccessRepository } from '../../../src/access/infra/repositories/AccessRepository'
import { GuestbookResponseDTO } from '../../../src/access/domain/dtos/GuestbookResponseDTO'
import {
  ApiConfig,
  DataverseApiAuthMechanism
} from '../../../src/core/infra/repositories/ApiConfig'
import { TestConstants } from '../../testHelpers/TestConstants'

describe('AccessRepository', () => {
  const sut = new AccessRepository()
  const guestbookResponse: GuestbookResponseDTO = {
    guestbookResponse: {
      answers: [{ id: 1, value: 'question 1' }]
    }
  }

  beforeEach(() => {
    window.localStorage.setItem(
      TestConstants.TEST_BEARER_TOKEN_LOCAL_STORAGE_KEY,
      JSON.stringify(TestConstants.TEST_DUMMY_BEARER_TOKEN)
    )
  })

  afterEach(() => {
    window.localStorage.clear()
  })

  test('uses fetch with credentials omit for bearer token auth', async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.BEARER_TOKEN,
      undefined,
      TestConstants.TEST_BEARER_TOKEN_LOCAL_STORAGE_KEY
    )

    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: jest.fn().mockResolvedValue({
        data: {
          signedUrl: 'https://signed.dataset'
        }
      })
    } as unknown as Response)

    global.fetch = fetchMock as typeof fetch

    const actual = await sut.submitGuestbookForDatasetDownload(123, guestbookResponse, 'original')

    expect(fetchMock).toHaveBeenCalledWith(
      `${TestConstants.TEST_API_URL}/access/dataset/123?signed=true&format=original`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${TestConstants.TEST_DUMMY_BEARER_TOKEN}`
        },
        credentials: 'omit',
        body: JSON.stringify(guestbookResponse)
      }
    )
    expect(actual).toBe('https://signed.dataset')
  })
})
