import { CreateDataset } from '../../../src/datasets/domain/useCases/CreateDataset'
import { CreatedDatasetIdentifiers } from '../../../src/datasets/domain/models/CreatedDatasetIdentifiers'
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository'
import { NewResourceValidator } from '../../../src/core/domain/useCases/validators/NewResourceValidator'
import {
  createNewDatasetDTO,
  createNewDatasetMetadataBlockModel
} from '../../testHelpers/datasets/newDatasetHelper'
import { ResourceValidationError } from '../../../src/core/domain/useCases/validators/errors/ResourceValidationError'
import { WriteError, ReadError } from '../../../src'
import { IMetadataBlocksRepository } from '../../../src/metadataBlocks/domain/repositories/IMetadataBlocksRepository'
import { ROOT_COLLECTION_ALIAS } from '../../../src/collections/domain/models/Collection'

describe('execute', () => {
  const testDataset = createNewDatasetDTO()
  const testMetadataBlocks = [createNewDatasetMetadataBlockModel()]

  test('should return new dataset identifiers when validation is successful and repository call is successful', async () => {
    const testCreatedDatasetIdentifiers: CreatedDatasetIdentifiers = {
      persistentId: 'test',
      numericId: 1
    }

    const datasetsRepositoryStub = <IDatasetsRepository>{}
    datasetsRepositoryStub.createDataset = jest
      .fn()
      .mockResolvedValue(testCreatedDatasetIdentifiers)

    const newDatasetValidatorStub = <NewResourceValidator>{}
    newDatasetValidatorStub.validate = jest.fn().mockResolvedValue(undefined)

    const metadataBlocksRepositoryStub = <IMetadataBlocksRepository>{}
    metadataBlocksRepositoryStub.getMetadataBlockByName = jest
      .fn()
      .mockResolvedValue(testMetadataBlocks[0])

    const sut = new CreateDataset(
      datasetsRepositoryStub,
      metadataBlocksRepositoryStub,
      newDatasetValidatorStub
    )

    const actual = await sut.execute(testDataset)

    expect(actual).toEqual(testCreatedDatasetIdentifiers)

    expect(metadataBlocksRepositoryStub.getMetadataBlockByName).toHaveBeenCalledWith(
      testMetadataBlocks[0].name
    )
    expect(newDatasetValidatorStub.validate).toHaveBeenCalledWith(testDataset, testMetadataBlocks)
    expect(datasetsRepositoryStub.createDataset).toHaveBeenCalledWith(
      testDataset,
      testMetadataBlocks,
      ROOT_COLLECTION_ALIAS
    )
  })

  test('should throw ResourceValidationError and not call repository when validation is unsuccessful', async () => {
    const datasetsRepositoryMock = <IDatasetsRepository>{}
    datasetsRepositoryMock.createDataset = jest.fn().mockResolvedValue(undefined)

    const newDatasetValidatorStub = <NewResourceValidator>{}
    newDatasetValidatorStub.validate = jest.fn().mockImplementation(() => {
      throw new ResourceValidationError('Test error')
    })

    const metadataBlocksRepositoryStub = <IMetadataBlocksRepository>{}
    metadataBlocksRepositoryStub.getMetadataBlockByName = jest
      .fn()
      .mockResolvedValue(testMetadataBlocks[0])

    const sut = new CreateDataset(
      datasetsRepositoryMock,
      metadataBlocksRepositoryStub,
      newDatasetValidatorStub
    )

    await expect(sut.execute(testDataset)).rejects.toThrow(ResourceValidationError)

    expect(metadataBlocksRepositoryStub.getMetadataBlockByName).toHaveBeenCalledWith(
      testMetadataBlocks[0].name
    )
    expect(newDatasetValidatorStub.validate).toHaveBeenCalledWith(testDataset, testMetadataBlocks)
    expect(datasetsRepositoryMock.createDataset).not.toHaveBeenCalled()
  })

  test('should throw WriteError when validation is successful and repository raises an error', async () => {
    const datasetsRepositoryStub = <IDatasetsRepository>{}
    const testWriteError = new WriteError('Test error')
    datasetsRepositoryStub.createDataset = jest.fn().mockRejectedValue(testWriteError)

    const newDatasetValidatorStub = <NewResourceValidator>{}
    newDatasetValidatorStub.validate = jest.fn().mockResolvedValue(undefined)

    const metadataBlocksRepositoryStub = <IMetadataBlocksRepository>{}
    metadataBlocksRepositoryStub.getMetadataBlockByName = jest
      .fn()
      .mockResolvedValue(testMetadataBlocks[0])

    const sut = new CreateDataset(
      datasetsRepositoryStub,
      metadataBlocksRepositoryStub,
      newDatasetValidatorStub
    )
    await expect(sut.execute(testDataset)).rejects.toThrow(testWriteError)

    expect(metadataBlocksRepositoryStub.getMetadataBlockByName).toHaveBeenCalledWith(
      testMetadataBlocks[0].name
    )
    expect(newDatasetValidatorStub.validate).toHaveBeenCalledWith(testDataset, testMetadataBlocks)
    expect(datasetsRepositoryStub.createDataset).toHaveBeenCalledWith(
      testDataset,
      testMetadataBlocks,
      ROOT_COLLECTION_ALIAS
    )
  })

  test('should throw ReadError when metadata blocks repository raises an error', async () => {
    const datasetsRepositoryMock = <IDatasetsRepository>{}
    datasetsRepositoryMock.createDataset = jest.fn().mockResolvedValue(undefined)

    const newDatasetValidatorMock = <NewResourceValidator>{}
    newDatasetValidatorMock.validate = jest.fn().mockResolvedValue(undefined)

    const metadataBlocksRepositoryStub = <IMetadataBlocksRepository>{}
    const testReadError = new ReadError('Test error')
    metadataBlocksRepositoryStub.getMetadataBlockByName = jest.fn().mockRejectedValue(testReadError)

    const sut = new CreateDataset(
      datasetsRepositoryMock,
      metadataBlocksRepositoryStub,
      newDatasetValidatorMock
    )
    await expect(sut.execute(testDataset)).rejects.toThrow(testReadError)

    expect(newDatasetValidatorMock.validate).not.toHaveBeenCalled()
    expect(datasetsRepositoryMock.createDataset).not.toHaveBeenCalled()

    expect(metadataBlocksRepositoryStub.getMetadataBlockByName).toHaveBeenCalledWith(
      testMetadataBlocks[0].name
    )
  })
})
