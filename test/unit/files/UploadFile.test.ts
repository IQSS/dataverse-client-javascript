import { createSinglepartFileBlob } from '../../testHelpers/files/filesHelper'
import { UploadFile } from '../../../src/files/domain/useCases/UploadFile'
import { IDirectUploadClient } from '../../../src/files/domain/clients/IDirectUploadClient'
import { DirectUploadClientError } from '../../../src/files/domain/clients/DirectUploadClientError'

describe('execute', () => {
  let testFile: File

  beforeAll(async () => {
    testFile = await createSinglepartFileBlob()
  })

  test('should return undefined on client success', async () => {
    const directUploadClientStub: IDirectUploadClient = {} as IDirectUploadClient
    directUploadClientStub.uploadFile = jest.fn().mockResolvedValue(undefined)

    const sut = new UploadFile(directUploadClientStub)

    const progressMock = jest.fn()
    const abortController = new AbortController()

    const actual = await sut.execute(1, testFile, progressMock, abortController)

    expect(actual).toEqual(undefined)
  })

  test('should return error on client error', async () => {
    const directUploadClientStub: IDirectUploadClient = {} as IDirectUploadClient
    directUploadClientStub.uploadFile = jest
      .fn()
      .mockRejectedValue(new DirectUploadClientError('test', 'test', 'test'))

    const sut = new UploadFile(directUploadClientStub)

    const progressMock = jest.fn()
    const abortController = new AbortController()

    await expect(sut.execute(1, testFile, progressMock, abortController)).rejects.toThrow(
      DirectUploadClientError
    )
  })
})
