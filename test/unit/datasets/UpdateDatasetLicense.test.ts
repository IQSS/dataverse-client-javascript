import { UpdateDatasetLicense } from '../../../src/datasets/domain/useCases/UpdateDatasetLicense'
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository'
import { DatasetLicenseUpdateRequest } from '../../../src/datasets/domain/dtos/DatasetLicenseUpdateRequest'
import { WriteError } from '../../../src'

describe('execute', () => {
  test('should return undefined when success', async () => {
    const repo: IDatasetsRepository = {} as IDatasetsRepository
    repo.updateDatasetLicense = jest.fn().mockResolvedValue(undefined)
    const sut = new UpdateDatasetLicense(repo)

    const payload: DatasetLicenseUpdateRequest = { name: 'CC BY 4.0' }
    const actual = await sut.execute(1, payload)

    expect(repo.updateDatasetLicense).toHaveBeenCalledWith(1, payload)
    expect(actual).toBeUndefined()
  })

  test('should throw WriteError when repository raises an error', async () => {
    const repo: IDatasetsRepository = {} as IDatasetsRepository
    repo.updateDatasetLicense = jest.fn().mockRejectedValue(new WriteError())
    const sut = new UpdateDatasetLicense(repo)

    const payload: DatasetLicenseUpdateRequest = { name: 'CC BY 4.0' }
    await expect(sut.execute(999, payload)).rejects.toThrow(WriteError)
    expect(repo.updateDatasetLicense).toHaveBeenCalledWith(999, payload)
  })
})
