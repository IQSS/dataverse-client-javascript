import { ReadError } from '../../../src'
import { DatasetType } from '../../../src'
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository'
import { GetDatasetAvailableDatasetTypes } from '../../../src/datasets/domain/useCases/GetDatasetAvailableDatasetTypes'

describe('GetDatasetAvailableDatasetTypes', () => {
  describe('execute', () => {
    test('should return datasetTypes array on repository success', async () => {
      const datasetTypesRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository

      const testDatasetTypes: DatasetType[] = [
        {
          id: 1,
          name: 'dataset',
          linkedMetadataBlocks: [],
          availableLicenses: []
        },
        {
          id: 2,
          name: 'software',
          linkedMetadataBlocks: ['codeMeta20'],
          availableLicenses: ['MIT', 'Apache-2.0']
        }
      ]

      datasetTypesRepositoryStub.getDatasetAvailableDatasetTypes = jest
        .fn()
        .mockResolvedValue(testDatasetTypes)
      const sut = new GetDatasetAvailableDatasetTypes(datasetTypesRepositoryStub)

      const actual = await sut.execute()

      expect(actual).toEqual(testDatasetTypes)
      expect(datasetTypesRepositoryStub.getDatasetAvailableDatasetTypes).toHaveBeenCalledTimes(1)
    })

    test('should return error result on repository error', async () => {
      const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
      const expectedError = new ReadError('Failed to fetch dataset types')
      datasetsRepositoryStub.getDatasetAvailableDatasetTypes = jest
        .fn()
        .mockRejectedValue(expectedError)
      const sut = new GetDatasetAvailableDatasetTypes(datasetsRepositoryStub)

      await expect(sut.execute()).rejects.toThrow(ReadError)
      expect(datasetsRepositoryStub.getDatasetAvailableDatasetTypes).toHaveBeenCalledTimes(1)
    })
  })
})
