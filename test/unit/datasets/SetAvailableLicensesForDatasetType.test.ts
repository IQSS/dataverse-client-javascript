import { SetAvailableLicensesForDatasetType } from '../../../src/datasets/domain/useCases/SetAvailableLicensesForDatasetType'
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository'
import { WriteError } from '../../../src'

describe('execute', () => {
  test('should return undefined on set available licenses for dataset type success', async () => {
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.setAvailableLicensesForDatasetType = jest
      .fn()
      .mockResolvedValue(undefined)
    const sut = new SetAvailableLicensesForDatasetType(datasetsRepositoryStub)

    const actual = await sut.execute(1, ['geospatial'])
    expect(actual).toEqual(undefined)
  })

  test('should return error result on set available licenses for dataset type error', async () => {
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.setAvailableLicensesForDatasetType = jest
      .fn()
      .mockRejectedValue(new WriteError())
    const sut = new SetAvailableLicensesForDatasetType(datasetsRepositoryStub)

    const nonExistentDatasetTypeId = 111
    await expect(sut.execute(nonExistentDatasetTypeId, ['geospatial'])).rejects.toThrow(WriteError)
  })
})
