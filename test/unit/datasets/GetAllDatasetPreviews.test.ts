import { GetAllDatasetPreviews } from '../../../src/datasets/domain/useCases/GetAllDatasetPreviews'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'
import { DatasetPreview } from '../../../src/datasets/domain/models/DatasetPreview'
import { createDatasetPreviewModel } from '../../testHelpers/datasets/datasetPreviewHelper'
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository'

describe('execute', () => {
  test('should return dataset previews on repository success', async () => {
    const testDatasetPreviews: DatasetPreview[] = [createDatasetPreviewModel()]
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.getAllDatasetPreviews = jest.fn().mockResolvedValue(testDatasetPreviews)
    const sut = new GetAllDatasetPreviews(datasetsRepositoryStub)

    const actual = await sut.execute()

    expect(actual).toEqual(testDatasetPreviews)
    expect(datasetsRepositoryStub.getAllDatasetPreviews).toHaveBeenCalledWith(
      undefined,
      undefined,
      undefined
    )
  })

  test('should return dataset previews with limit and offset on repository success', async () => {
    const testDatasetPreviews: DatasetPreview[] = [createDatasetPreviewModel()]
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.getAllDatasetPreviews = jest.fn().mockResolvedValue(testDatasetPreviews)
    const sut = new GetAllDatasetPreviews(datasetsRepositoryStub)

    const actual = await sut.execute(10, 20)

    expect(actual).toEqual(testDatasetPreviews)
    expect(datasetsRepositoryStub.getAllDatasetPreviews).toHaveBeenCalledWith(10, 20, undefined)
  })

  test('should return dataset previews with limit, offset, and collectionId on repository success', async () => {
    const testDatasetPreviews: DatasetPreview[] = [createDatasetPreviewModel()]
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.getAllDatasetPreviews = jest.fn().mockResolvedValue(testDatasetPreviews)
    const sut = new GetAllDatasetPreviews(datasetsRepositoryStub)

    const actual = await sut.execute(10, 20, 'collectionId')

    expect(actual).toEqual(testDatasetPreviews)
    expect(datasetsRepositoryStub.getAllDatasetPreviews).toHaveBeenCalledWith(
      10,
      20,
      'collectionId'
    )
  })

  test('should return error result on repository error', async () => {
    const datasetsRepositoryStub: IDatasetsRepository = {} as IDatasetsRepository
    datasetsRepositoryStub.getAllDatasetPreviews = jest.fn().mockRejectedValue(new ReadError())
    const sut = new GetAllDatasetPreviews(datasetsRepositoryStub)

    await expect(sut.execute()).rejects.toThrow(ReadError)
  })
})
