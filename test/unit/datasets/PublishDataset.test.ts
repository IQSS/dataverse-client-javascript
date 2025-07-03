import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository'
import { PublishDataset } from '../../../src/datasets/domain/useCases/PublishDataset'
import { VersionUpdateType } from '../../../src/datasets/domain/models/Dataset'
import { WriteError } from '../../../src'

describe('execute', () => {
  test('should return undefined on repository success', async () => {
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.publishDataset = jest.fn().mockResolvedValue(undefined)
    const sut = new PublishDataset(datasetsRepositoryStub)

    const actual = await sut.execute(1, VersionUpdateType.MAJOR)

    expect(actual).toEqual(undefined)
  })

  test('should return error result on repository error', async () => {
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.publishDataset = jest.fn().mockRejectedValue(new WriteError())
    const sut = new PublishDataset(datasetsRepositoryStub)

    await expect(sut.execute(1, VersionUpdateType.MAJOR)).rejects.toThrow(WriteError)
  })
})
