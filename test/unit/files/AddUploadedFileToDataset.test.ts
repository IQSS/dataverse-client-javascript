import { createSinglepartFileBlob } from '../../testHelpers/files/filesHelper'
import { IDirectUploadClient } from '../../../src/files/domain/clients/IDirectUploadClient'
import { DirectUploadClientError } from '../../../src/files/domain/clients/DirectUploadClientError'
import { AddUploadedFileToDataset } from '../../../src/files/domain/useCases/AddUploadedFileToDataset'

describe('execute', () => {
  let testFile: File
  const testStorageId = 'test'

  beforeAll(async () => {
    testFile = await createSinglepartFileBlob()
  })

  test('should return undefined on client success', async () => {
    const directUploadClientStub: IDirectUploadClient = {} as IDirectUploadClient
    directUploadClientStub.addUploadedFileToDataset = jest.fn().mockResolvedValue(undefined)

    const sut = new AddUploadedFileToDataset(directUploadClientStub)

    const actual = await sut.execute(1, testFile, testStorageId)

    expect(actual).toEqual(undefined)
  })

  test('should return error on client error', async () => {
    const directUploadClientStub: IDirectUploadClient = {} as IDirectUploadClient
    directUploadClientStub.addUploadedFileToDataset = jest
      .fn()
      .mockRejectedValue(new DirectUploadClientError('test', 'test', 'test'))

    const sut = new AddUploadedFileToDataset(directUploadClientStub)

    await expect(sut.execute(1, testFile, testStorageId)).rejects.toThrow(DirectUploadClientError)
  })
})
