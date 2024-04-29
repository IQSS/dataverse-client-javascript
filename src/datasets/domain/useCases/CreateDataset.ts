import { IDatasetsRepository } from '../repositories/IDatasetsRepository'
import { DatasetDTO } from '../dtos/DatasetDTO'
import { ResourceValidator } from '../../../core/domain/useCases/validators/ResourceValidator'
import { IMetadataBlocksRepository } from '../../../metadataBlocks/domain/repositories/IMetadataBlocksRepository'
import { CreatedDatasetIdentifiers } from '../models/CreatedDatasetIdentifiers'
import { ROOT_COLLECTION_ALIAS } from '../../../collections/domain/models/Collection'
import { DatasetWriteUseCase } from './DatasetWriteUseCase'

export class CreateDataset extends DatasetWriteUseCase<CreatedDatasetIdentifiers> {
  constructor(
    datasetsRepository: IDatasetsRepository,
    metadataBlocksRepository: IMetadataBlocksRepository,
    newDatasetValidator: ResourceValidator
  ) {
    super(datasetsRepository, metadataBlocksRepository, newDatasetValidator)
  }

  /**
   * Creates a new Dataset in a collection, given a NewDatasetDTO object and an optional collection identifier, which defaults to root.
   *
   * @param {DatasetDTO} [newDataset] - DatasetDTO object including the new dataset metadata field values for each metadata block.
   * @param {string} [collectionId] - Specifies the collection identifier where the new dataset should be created (optional, defaults to root).
   * @returns {Promise<CreatedDatasetIdentifiers>}
   * @throws {ResourceValidationError} - If there are validation errors related to the provided information.
   * @throws {ReadError} - If there are errors while reading data.
   * @throws {WriteError} - If there are errors while writing data.
   */
  async execute(
    newDataset: DatasetDTO,
    collectionId = ROOT_COLLECTION_ALIAS
  ): Promise<CreatedDatasetIdentifiers> {
    const metadataBlocks = await this.getNewDatasetMetadataBlocks(newDataset)
    this.getNewDatasetValidator().validate(newDataset, metadataBlocks)
    return this.getDatasetsRepository().createDataset(newDataset, metadataBlocks, collectionId)
  }
}
