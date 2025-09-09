import { ReadError } from '../../../src'
// import { DatasetType } from '../../../src/datasetTypes/models/DatasetType'
import { DatasetType } from '../../../src/datasetTypes/domain/models/DatasetType'
import { IDatasetTypesRepository } from '../../../src/datasetTypes/domain/repositories/IDatasetTypesRepository'
import { GetAvailableDatasetTypes } from '../../../src/datasetTypes/domain/useCases/GetAvailableDatasetTypes'

describe('GetAvailableDatasetTypes', () => {
  describe('execute', () => {
    test('should return datasetTypes array on repository success', async () => {
      const datasetTypesRepositoryStub: IDatasetTypesRepository = {} as IDatasetTypesRepository

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

      datasetTypesRepositoryStub.getAvailableDatasetTypes = jest
        .fn()
        .mockResolvedValue(testDatasetTypes)
      const sut = new GetAvailableDatasetTypes(datasetTypesRepositoryStub)

      const actual = await sut.execute()

      expect(actual).toEqual(testDatasetTypes)
      expect(datasetTypesRepositoryStub.getAvailableDatasetTypes).toHaveBeenCalledTimes(1)
    })

    test('should return error result on repository error', async () => {
      const datasetTypesRepositoryStub: IDatasetTypesRepository = {} as IDatasetTypesRepository
      const expectedError = new ReadError('Failed to fetch dataset types')
      datasetTypesRepositoryStub.getAvailableDatasetTypes = jest
        .fn()
        .mockRejectedValue(expectedError)
      const sut = new GetAvailableDatasetTypes(datasetTypesRepositoryStub)

      await expect(sut.execute()).rejects.toThrow(ReadError)
      expect(datasetTypesRepositoryStub.getAvailableDatasetTypes).toHaveBeenCalledTimes(1)
    })
  })
})
