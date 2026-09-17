import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository'
import { WriteError } from '../../../src'
import { UnassignRoleOnDataset } from '../../../src/datasets/domain/useCases/UnassignRoleOnDataset'

describe('execute', () => {
  test('should unassign role successfully on repository success', async () => {
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.unassignRoleOnDataset = jest.fn().mockResolvedValue(undefined)

    const testUnassignRoleOnDataset = new UnassignRoleOnDataset(datasetsRepositoryStub)

    await expect(testUnassignRoleOnDataset.execute(1, 2)).resolves.toBeUndefined()
    expect(datasetsRepositoryStub.unassignRoleOnDataset).toHaveBeenCalledWith(1, 2)
  })

  test('should throw error on repository failure', async () => {
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.unassignRoleOnDataset = jest.fn().mockRejectedValue(new WriteError())

    const testUnassignRoleOnDataset = new UnassignRoleOnDataset(datasetsRepositoryStub)

    await expect(testUnassignRoleOnDataset.execute(1, 2)).rejects.toThrow(WriteError)
    expect(datasetsRepositoryStub.unassignRoleOnDataset).toHaveBeenCalledWith(1, 2)
  })
})
