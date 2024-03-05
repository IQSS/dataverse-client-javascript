import { GetDatasetUserPermissions } from '../../../src/datasets/domain/useCases/GetDatasetUserPermissions'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'
import { createDatasetUserPermissionsModel } from '../../testHelpers/datasets/datasetUserPermissionsHelper'
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository'

const testDatasetId = 1
describe('execute', () => {
  test('should return dataset user permissions on repository success', async () => {
    const testDatasetUserPermissions = createDatasetUserPermissionsModel()
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.getDatasetUserPermissions = jest
      .fn()
      .mockResolvedValue(testDatasetUserPermissions)
    const sut = new GetDatasetUserPermissions(datasetsRepositoryStub)

    const actual = await sut.execute(testDatasetId)

    expect(actual).toEqual(testDatasetUserPermissions)
    expect(datasetsRepositoryStub.getDatasetUserPermissions).toHaveBeenCalledWith(testDatasetId)
  })

  test('should return error result on repository error', async () => {
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.getDatasetUserPermissions = jest.fn().mockRejectedValue(new ReadError())
    const sut = new GetDatasetUserPermissions(datasetsRepositoryStub)

    await expect(sut.execute(testDatasetId)).rejects.toThrow(ReadError)
  })
})
