import { IDatasetsRepository } from '../repositories/IDatasetsRepository'
import { DatasetDTO } from '../dtos/DatasetDTO'
import { ResourceValidator } from '../../../core/domain/useCases/validators/ResourceValidator'
import { IMetadataBlocksRepository } from '../../../metadataBlocks/domain/repositories/IMetadataBlocksRepository'
import { DatasetWriteUseCase } from './DatasetWriteUseCase'

export class UpdateDataset extends DatasetWriteUseCase<void> {
  constructor(
    datasetsRepository: IDatasetsRepository,
    metadataBlocksRepository: IMetadataBlocksRepository,
    newDatasetValidator: ResourceValidator
  ) {
    super(datasetsRepository, metadataBlocksRepository, newDatasetValidator)
  }

  /**
   * Updates a Dataset, given a DatasetDTO object including the updated dataset metadata field values for each metadata block
   *
   * @param {number | string} [datasetId] - The dataset identifier, which can be a string (for persistent identifiers), or a number (for numeric identifiers).
   * @param {DatasetDTO} [updatedDataset] - DatasetDTO object including the updated dataset metadata field values for each metadata block.
   * @param {number} [internalVersionNumber] - The internal version number of the dataset. If another user updates the dataset version metadata before you send the update request, data inconsistencies may occur. To prevent this, you can use the optional internalVersionNumber parameter. This parameter must include the internal version number corresponding to the dataset version being updated. Note that internal version numbers increase sequentially with each version update.
   * @returns {Promise<void>} - This method does not return anything upon successful completion.
   * @throws {ResourceValidationError} - If there are validation errors related to the provided information.
   * @throws {ReadError} - If there are errors while reading data.
   * @throws {WriteError} - If there are errors while writing data.
   */
  async execute(
    datasetId: number | string,
    updatedDataset: DatasetDTO,
    internalVersionNumber?: number
  ): Promise<void> {
    const metadataBlocks = await this.getNewDatasetMetadataBlocks(updatedDataset)
    this.getNewDatasetValidator().validate(updatedDataset, metadataBlocks)
    return this.getDatasetsRepository().updateDataset(
      datasetId,
      updatedDataset,
      metadataBlocks,
      internalVersionNumber
    )
  }
}
