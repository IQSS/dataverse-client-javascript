/**
 * @jest-environment jsdom
 */

import { AccessRepository } from '../../../src/access/infra/repositories/AccessRepository'
import { GuestbookResponseDTO } from '../../../src/access/domain/dtos/GuestbookResponseDTO'
import { WriteError } from '../../../src/core/domain/repositories/WriteError'
import {
  ApiConfig,
  DataverseApiAuthMechanism
} from '../../../src/core/infra/repositories/ApiConfig'
import { TestConstants } from '../../testHelpers/TestConstants'

describe('AccessRepository', () => {
  const sut = new AccessRepository()
  const originalFetch = global.fetch
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
    global.fetch = originalFetch
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

  test('parses signed url from a JSON body when content-type is incorrect', async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.BEARER_TOKEN,
      undefined,
      TestConstants.TEST_BEARER_TOKEN_LOCAL_STORAGE_KEY
    )

    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'text/plain' }),
      text: jest
        .fn()
        .mockResolvedValue(JSON.stringify({ data: { signedUrl: 'https://signed.text' } }))
    } as unknown as Response)

    global.fetch = fetchMock as typeof fetch

    await expect(sut.submitGuestbookForDatasetDownload(123, guestbookResponse)).resolves.toBe(
      'https://signed.text'
    )
  })

  test('throws WriteError when signedUrl is missing from a successful response', async () => {
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
        data: {}
      })
    } as unknown as Response)

    global.fetch = fetchMock as typeof fetch

    await expect(sut.submitGuestbookForDatasetDownload(123, guestbookResponse)).rejects.toThrow(
      new WriteError('Missing signedUrl in access download response.')
    )
  })
})
