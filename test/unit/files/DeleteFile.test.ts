import { IFilesRepository } from '../../../src/files/domain/repositories/IFilesRepository'
import { WriteError } from '../../../src'
import { DeleteFile } from '../../../src/files/domain/useCases/DeleteFile'

describe('execute', () => {
  test('should return undefined when repository call is successful', async () => {
    const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
    filesRepositoryStub.deleteFile = jest.fn().mockResolvedValue(undefined)

    const sut = new DeleteFile(filesRepositoryStub)

    const actual = await sut.execute(1)

    expect(actual).toEqual(undefined)
  })

  test('should return error result on repository error', async () => {
    const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
    filesRepositoryStub.deleteFile = jest.fn().mockRejectedValue(new WriteError())

    const sut = new DeleteFile(filesRepositoryStub)

    await expect(sut.execute(1)).rejects.toThrow(WriteError)
  })
})
