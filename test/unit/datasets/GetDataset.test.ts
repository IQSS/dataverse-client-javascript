import { GetDataset } from '../../../src/datasets/domain/useCases/GetDataset'
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository'
import { createDatasetModel } from '../../testHelpers/datasets/datasetHelper'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'

describe('execute', () => {
  test('should return dataset on repository success', async () => {
    const testDataset = createDatasetModel()
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.getDataset = jest.fn().mockResolvedValue(testDataset)
    const sut = new GetDataset(datasetsRepositoryStub)

    const actual = await sut.execute(1)

    expect(actual).toEqual(testDataset)
  })

  test('should return error result on repository error', async () => {
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.getDataset = jest.fn().mockRejectedValue(new ReadError())
    const sut = new GetDataset(datasetsRepositoryStub)

    await expect(sut.execute(1)).rejects.toThrow(ReadError)
  })
})
