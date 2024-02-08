import { GetFileUserPermissions } from '../../../src/files/domain/useCases/GetFileUserPermissions'
import { IFilesRepository } from '../../../src/files/domain/repositories/IFilesRepository'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'
import { createFileUserPermissionsModel } from '../../testHelpers/files/fileUserPermissionsHelper'

describe('execute', () => {
  const testFileId = 1

  test('should return file user permissions on repository success', async () => {
    const testFileUserPermissions = createFileUserPermissionsModel()
    const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
    filesRepositoryStub.getFileUserPermissions = jest
      .fn()
      .mockResolvedValue(testFileUserPermissions)

    const sut = new GetFileUserPermissions(filesRepositoryStub)

    const actual = await sut.execute(testFileId)

    expect(actual).toEqual(testFileUserPermissions)
    expect(filesRepositoryStub.getFileUserPermissions).toHaveBeenCalledWith(testFileId)
  })

  test('should return error result on repository error', async () => {
    const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
    filesRepositoryStub.getFileUserPermissions = jest.fn().mockRejectedValue(new ReadError())
    const sut = new GetFileUserPermissions(filesRepositoryStub)

    await expect(sut.execute(testFileId)).rejects.toThrow(ReadError)
  })
})
