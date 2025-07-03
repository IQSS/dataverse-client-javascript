import { GetDatasetLocks } from '../../../src/datasets/domain/useCases/GetDatasetLocks'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository'
import { createDatasetLockModel } from '../../testHelpers/datasets/datasetLockHelper'

describe('execute', () => {
  const testDatasetId = 1

  test('should return dataset locks on repository success', async () => {
    const testDatasetLocks = [createDatasetLockModel()]
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.getDatasetLocks = jest.fn().mockResolvedValue(testDatasetLocks)
    const sut = new GetDatasetLocks(datasetsRepositoryStub)

    const actual = await sut.execute(testDatasetId)

    expect(actual).toEqual(testDatasetLocks)
  })

  test('should return error result on repository error', async () => {
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.getDatasetLocks = jest.fn().mockRejectedValue(new ReadError())
    const sut = new GetDatasetLocks(datasetsRepositoryStub)

    await expect(sut.execute(testDatasetId)).rejects.toThrow(ReadError)
  })
})
