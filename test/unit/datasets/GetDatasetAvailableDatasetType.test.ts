import { GetDatasetAvailableDatasetType } from '../../../src/datasets/domain/useCases/GetDatasetAvailableDatasetType'
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository'
import { DatasetType } from '../../../src/datasets/domain/models/DatasetType'
import { ReadError } from '../../../src'

describe('GetDatasetAvailableDatasetType', () => {
  const datasetTypesRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository

  const datasetTypeId = 1
  const datasetTypeName = 'dataset'
  const expectedDatasetType: DatasetType = {
    id: datasetTypeId,
    name: datasetTypeName,
    displayName: 'Dataset',
    linkedMetadataBlocks: [],
    availableLicenses: [],
    description:
      'A study, experiment, set of observations, or publication. A dataset can comprise a single file or multiple files.'
  }

  it('should get a dataset type by database id', async () => {
    datasetTypesRepositoryStub.getDatasetAvailableDatasetType = jest
      .fn()
      .mockResolvedValue(expectedDatasetType)
    const sut = new GetDatasetAvailableDatasetType(datasetTypesRepositoryStub)

    const actual = await sut.execute(datasetTypeId)

    expect(actual).toEqual(expectedDatasetType)
    expect(datasetTypesRepositoryStub.getDatasetAvailableDatasetType).toHaveBeenCalledTimes(1)
  })

  it('should get a dataset type by name', async () => {
    datasetTypesRepositoryStub.getDatasetAvailableDatasetType = jest
      .fn()
      .mockResolvedValue(expectedDatasetType)
    const sut = new GetDatasetAvailableDatasetType(datasetTypesRepositoryStub)

    const actual = await sut.execute(datasetTypeName)

    expect(actual).toEqual(expectedDatasetType)
    expect(datasetTypesRepositoryStub.getDatasetAvailableDatasetType).toHaveBeenCalledTimes(1)
  })

  test('should return error result on repository error', async () => {
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    const datasetTypeId = 1
    const expectedError = new ReadError('Failed to fetch dataset type')
    datasetsRepositoryStub.getDatasetAvailableDatasetType = jest
      .fn()
      .mockRejectedValue(expectedError)
    const sut = new GetDatasetAvailableDatasetType(datasetsRepositoryStub)

    await expect(sut.execute(datasetTypeId)).rejects.toThrow(ReadError)
    expect(datasetsRepositoryStub.getDatasetAvailableDatasetType).toHaveBeenCalledTimes(1)
  })
})
