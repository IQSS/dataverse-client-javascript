import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository'
import { WriteError } from '../../../src'
import { AssignRoleOnDataset } from '../../../src/datasets/domain/useCases/AssignRoleOnDataset'

describe('execute', () => {
  test('should assign role successfully on repository success', async () => {
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.assignRoleOnDataset = jest.fn().mockResolvedValue(undefined)

    const testAssignRoleOnDataset = new AssignRoleOnDataset(datasetsRepositoryStub)

    await expect(testAssignRoleOnDataset.execute(1, "@testUser", "curator")).resolves.toBeUndefined()
    expect(datasetsRepositoryStub.assignRoleOnDataset).toHaveBeenCalledWith(1, "@testUser", "curator")
  })

  test('should throw error on repository failure', async () => {
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.assignRoleOnDataset = jest.fn().mockRejectedValue(new WriteError())

    const testAssignRoleOnDataset = new AssignRoleOnDataset(datasetsRepositoryStub)

    await expect(testAssignRoleOnDataset.execute(1, "@testUser", "curator")).rejects.toThrow(WriteError)
    expect(datasetsRepositoryStub.assignRoleOnDataset).toHaveBeenCalledWith(1, "@testUser", "curator")
  })
})
