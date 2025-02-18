import { WriteError } from '../../../src'
import { IFilesRepository } from '../../../src/files/domain/repositories/IFilesRepository'
import { RestrictFile } from '../../../src/files/domain/useCases/RestrictFile'

describe('execute', () => {
  test('should return undefined when repository call is successful', async () => {
    const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
    filesRepositoryStub.restrictFile = jest.fn().mockResolvedValue(undefined)

    const sut = new RestrictFile(filesRepositoryStub)

    const actual = await sut.execute(1)

    expect(actual).toEqual(undefined)
  })

  test('should return error result on repository error', async () => {
    const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
    filesRepositoryStub.restrictFile = jest.fn().mockRejectedValue(new WriteError())

    const sut = new RestrictFile(filesRepositoryStub)

    await expect(sut.execute(1)).rejects.toThrow(WriteError)
  })
})
