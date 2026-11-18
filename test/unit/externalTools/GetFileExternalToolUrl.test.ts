import axios from 'axios'
import {
  ApiConfig,
  getFileExternalToolResolved,
  GetFileExternalToolDTO,
  WriteError
} from '../../../src'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import { IExternalToolsRepository } from '../../../src/externalTools/domain/repositories/IExternalToolsRepository'
import { GetFileExternalToolResolved } from '../../../src/externalTools/domain/useCases/GetFileExternalToolResolved'
import { createFileExternalToolResolvedModel } from '../../testHelpers/externalTools/externalToolsHelper'

describe('execute', () => {
  test('should return file external tool resolved on repository success', async () => {
    const testFileExternalToolResolved = createFileExternalToolResolvedModel()
    const externalToolsRepositoryStub: IExternalToolsRepository = {} as IExternalToolsRepository
    externalToolsRepositoryStub.getFileExternalToolResolved = jest
      .fn()
      .mockResolvedValue(testFileExternalToolResolved)
    const sut = new GetFileExternalToolResolved(externalToolsRepositoryStub)

    const actual = await sut.execute(123, 3, { preview: true, locale: 'en' })

    expect(actual).toEqual(testFileExternalToolResolved)
  })

  test('should return error result on repository error', async () => {
    const externalToolsRepositoryStub: IExternalToolsRepository = {} as IExternalToolsRepository
    externalToolsRepositoryStub.getFileExternalToolResolved = jest
      .fn()
      .mockRejectedValue(new WriteError())
    const sut = new GetFileExternalToolResolved(externalToolsRepositoryStub)

    await expect(sut.execute(123, 3, { preview: true, locale: 'en' })).rejects.toThrow(WriteError)
  })
})

test('sends the guestbook response to the file tool URL endpoint', async () => {
  const options: GetFileExternalToolDTO = {
    preview: true,
    locale: 'en',
    guestbookResponse: {
      name: 'Example Reader',
      email: 'reader@example.org',
      answers: [{ id: 1, value: 'Research' }]
    }
  }
  const {
    dataverseApiUrl,
    dataverseApiAuthMechanism,
    dataverseApiKey,
    bearerTokenLocalStorageKey,
    bearerTokenGetFunction
  } = ApiConfig
  ApiConfig.init('https://example.org/api/v1', DataverseApiAuthMechanism.API_KEY)
  const post = jest.spyOn(axios, 'post').mockResolvedValue({
    data: {
      data: {
        toolUrl: 'https://example.org/text-tool?preview=true',
        displayName: 'Text File Tool',
        fileId: 123,
        preview: true
      }
    }
  })

  try {
    await getFileExternalToolResolved.execute(123, 3, options)

    expect(post).toHaveBeenCalledWith(
      'https://example.org/api/v1/files/123/externalTool/3/toolUrl',
      JSON.stringify(options),
      expect.objectContaining({ headers: { 'Content-Type': 'application/json' } })
    )
  } finally {
    post.mockRestore()
    ApiConfig.init(
      dataverseApiUrl,
      dataverseApiAuthMechanism,
      dataverseApiKey,
      bearerTokenLocalStorageKey,
      bearerTokenGetFunction
    )
  }
})
