import { GetPrivateUrlDataset } from '../../../src/datasets/domain/useCases/GetPrivateUrlDataset'
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository'
import { createDatasetModel } from '../../testHelpers/datasets/datasetHelper'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'

describe('execute', () => {
  const testPrivateUrlToken = 'token'

  test('should return dataset on repository success', async () => {
    const testDataset = createDatasetModel()
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.getPrivateUrlDataset = jest.fn().mockResolvedValue(testDataset)
    const sut = new GetPrivateUrlDataset(datasetsRepositoryStub)

    const actual = await sut.execute(testPrivateUrlToken)

    expect(actual).toEqual(testDataset)
    expect(datasetsRepositoryStub.getPrivateUrlDataset).toHaveBeenCalledWith(
      testPrivateUrlToken,
      false
    )
  })

  test('should return error result on repository error', async () => {
    const testReadError = new ReadError()
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.getPrivateUrlDataset = jest.fn().mockRejectedValue(testReadError)
    const sut = new GetPrivateUrlDataset(datasetsRepositoryStub)

    await expect(sut.execute(testPrivateUrlToken)).rejects.toThrow(testReadError)
  })
})
