import { DeaccessionDataset } from '../../../src/datasets/domain/useCases/DeaccessionDataset'
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository'
import { WriteError, DatasetDeaccessionDTO } from '../../../src'

const deaccessionDatasetDTO: DatasetDeaccessionDTO = {
  deaccessionReason: 'Deaccessioning the dataset for testing purposes'
}

describe('execute', () => {
  test('should return undefined on repository success', async () => {
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.deaccessionDataset = jest.fn().mockResolvedValue(undefined)
    const sut = new DeaccessionDataset(datasetsRepositoryStub)

    const actual = await sut.execute(1, '1.0', deaccessionDatasetDTO)

    expect(actual).toEqual(undefined)
  })

  test('should return error result on repository error', async () => {
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.deaccessionDataset = jest.fn().mockRejectedValue(new WriteError())
    const sut = new DeaccessionDataset(datasetsRepositoryStub)

    await expect(sut.execute(111, '1.0', deaccessionDatasetDTO)).rejects.toThrow(WriteError)
  })
})
