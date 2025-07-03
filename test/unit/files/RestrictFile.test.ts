import { WriteError } from '../../../src'
import { RestrictFileDTO } from '../../../src/files/domain/dtos/RestrictFileDTO'
import { IFilesRepository } from '../../../src/files/domain/repositories/IFilesRepository'
import { RestrictFile } from '../../../src/files/domain/useCases/RestrictFile'

describe('execute', () => {
  const restrictFileDTO: RestrictFileDTO = {
    restrict: true,
    enableAccessRequest: true,
    termsOfAccess: 'This file is restricted for testing purposes'
  }

  test('should return undefined when repository call is successful', async () => {
    const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
    filesRepositoryStub.restrictFile = jest.fn().mockResolvedValue(undefined)

    const sut = new RestrictFile(filesRepositoryStub)

    const actual = await sut.execute(1, restrictFileDTO)

    expect(actual).toEqual(undefined)
  })

  test('should return error result on repository error', async () => {
    const filesRepositoryStub: IFilesRepository = {} as IFilesRepository
    filesRepositoryStub.restrictFile = jest.fn().mockRejectedValue(new WriteError())

    const sut = new RestrictFile(filesRepositoryStub)

    await expect(sut.execute(1, restrictFileDTO)).rejects.toThrow(WriteError)
  })
})
