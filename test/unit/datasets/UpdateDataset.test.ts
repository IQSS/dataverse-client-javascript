import { UpdateDataset } from '../../../src/datasets/domain/useCases/UpdateDataset'
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository'
import { ResourceValidator } from '../../../src/core/domain/useCases/validators/ResourceValidator'
import {
  createDatasetDTO,
  createDatasetMetadataBlockModel
} from '../../testHelpers/datasets/datasetHelper'
import { IMetadataBlocksRepository } from '../../../src/metadataBlocks/domain/repositories/IMetadataBlocksRepository'
import { ResourceValidationError } from '../../../src/core/domain/useCases/validators/errors/ResourceValidationError'
import { WriteError, ReadError } from '../../../src'

describe('execute', () => {
  const testDataset = createDatasetDTO()
  const testMetadataBlocks = [createDatasetMetadataBlockModel()]

  test('should return undefined when validation is successful and repository call is successful', async () => {
    const datasetsRepositoryStub = <IDatasetsRepository>{}
    datasetsRepositoryStub.updateDataset = jest.fn().mockResolvedValue(undefined)

    const datasetValidatorStub = <ResourceValidator>{}
    datasetValidatorStub.validate = jest.fn().mockResolvedValue(undefined)

    const metadataBlocksRepositoryStub = <IMetadataBlocksRepository>{}
    metadataBlocksRepositoryStub.getMetadataBlockByName = jest
      .fn()
      .mockResolvedValue(testMetadataBlocks[0])

    const sut = new UpdateDataset(
      datasetsRepositoryStub,
      metadataBlocksRepositoryStub,
      datasetValidatorStub
    )

    const actual = await sut.execute(1, testDataset)

    expect(actual).toEqual(undefined)

    expect(metadataBlocksRepositoryStub.getMetadataBlockByName).toHaveBeenCalledWith(
      testMetadataBlocks[0].name
    )
    expect(datasetValidatorStub.validate).toHaveBeenCalledWith(testDataset, testMetadataBlocks)
    expect(datasetsRepositoryStub.updateDataset).toHaveBeenCalledWith(
      1,
      testDataset,
      testMetadataBlocks
    )
  })

  test('should throw ResourceValidationError and not call repository when validation is unsuccessful', async () => {
    const datasetsRepositoryMock = <IDatasetsRepository>{}
    datasetsRepositoryMock.updateDataset = jest.fn().mockResolvedValue(undefined)

    const datasetValidatorStub = <ResourceValidator>{}
    datasetValidatorStub.validate = jest.fn().mockImplementation(() => {
      throw new ResourceValidationError('Test error')
    })

    const metadataBlocksRepositoryStub = <IMetadataBlocksRepository>{}
    metadataBlocksRepositoryStub.getMetadataBlockByName = jest
      .fn()
      .mockResolvedValue(testMetadataBlocks[0])

    const sut = new UpdateDataset(
      datasetsRepositoryMock,
      metadataBlocksRepositoryStub,
      datasetValidatorStub
    )

    await expect(sut.execute(1, testDataset)).rejects.toThrow(ResourceValidationError)

    expect(metadataBlocksRepositoryStub.getMetadataBlockByName).toHaveBeenCalledWith(
      testMetadataBlocks[0].name
    )
    expect(datasetValidatorStub.validate).toHaveBeenCalledWith(testDataset, testMetadataBlocks)
    expect(datasetsRepositoryMock.updateDataset).not.toHaveBeenCalled()
  })

  test('should throw WriteError when validation is successful and repository raises an error', async () => {
    const datasetsRepositoryStub = <IDatasetsRepository>{}
    const testWriteError = new WriteError('Test error')
    datasetsRepositoryStub.updateDataset = jest.fn().mockRejectedValue(testWriteError)

    const datasetValidatorStub = <ResourceValidator>{}
    datasetValidatorStub.validate = jest.fn().mockResolvedValue(undefined)

    const metadataBlocksRepositoryStub = <IMetadataBlocksRepository>{}
    metadataBlocksRepositoryStub.getMetadataBlockByName = jest
      .fn()
      .mockResolvedValue(testMetadataBlocks[0])

    const sut = new UpdateDataset(
      datasetsRepositoryStub,
      metadataBlocksRepositoryStub,
      datasetValidatorStub
    )
    await expect(sut.execute(1, testDataset)).rejects.toThrow(testWriteError)

    expect(metadataBlocksRepositoryStub.getMetadataBlockByName).toHaveBeenCalledWith(
      testMetadataBlocks[0].name
    )
    expect(datasetValidatorStub.validate).toHaveBeenCalledWith(testDataset, testMetadataBlocks)
    expect(datasetsRepositoryStub.updateDataset).toHaveBeenCalledWith(
      1,
      testDataset,
      testMetadataBlocks
    )
  })

  test('should throw ReadError when metadata blocks repository raises an error', async () => {
    const datasetsRepositoryMock = <IDatasetsRepository>{}
    datasetsRepositoryMock.updateDataset = jest.fn().mockResolvedValue(undefined)

    const datasetValidatorMock = <ResourceValidator>{}
    datasetValidatorMock.validate = jest.fn().mockResolvedValue(undefined)

    const metadataBlocksRepositoryStub = <IMetadataBlocksRepository>{}
    const testReadError = new ReadError('Test error')
    metadataBlocksRepositoryStub.getMetadataBlockByName = jest.fn().mockRejectedValue(testReadError)

    const sut = new UpdateDataset(
      datasetsRepositoryMock,
      metadataBlocksRepositoryStub,
      datasetValidatorMock
    )
    await expect(sut.execute(1, testDataset)).rejects.toThrow(testReadError)

    expect(datasetValidatorMock.validate).not.toHaveBeenCalled()
    expect(datasetsRepositoryMock.updateDataset).not.toHaveBeenCalled()

    expect(metadataBlocksRepositoryStub.getMetadataBlockByName).toHaveBeenCalledWith(
      testMetadataBlocks[0].name
    )
  })
})
