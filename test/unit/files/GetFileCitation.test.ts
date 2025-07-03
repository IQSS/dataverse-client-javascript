import { DatasetNotNumberedVersion, ReadError } from '../../../src'
import { IFilesRepository } from '../../../src/files/domain/repositories/IFilesRepository'
import { GetFileCitation } from '../../../src/files/domain/useCases/GetFileCitation'

describe('execute', () => {
  const testId = 1

  test('should return successful result with file citation on repository success', async () => {
    const testCitation = 'test citation'
    const filesRepositoryStub = <IFilesRepository>{}
    filesRepositoryStub.getFileCitation = jest.fn().mockResolvedValue(testCitation)

    const sut = new GetFileCitation(filesRepositoryStub)

    const actual = await sut.execute(testId)

    expect(actual).toEqual(testCitation)
    expect(filesRepositoryStub.getFileCitation).toHaveBeenCalledWith(
      testId,
      DatasetNotNumberedVersion.LATEST,
      false
    )
  })

  test('should return error result on repository error', async () => {
    const filesRepositoryStub = <IFilesRepository>{}
    filesRepositoryStub.getFileCitation = jest.fn().mockRejectedValue(new ReadError())

    const sut = new GetFileCitation(filesRepositoryStub)

    await expect(sut.execute(testId)).rejects.toThrow(ReadError)
  })
})
