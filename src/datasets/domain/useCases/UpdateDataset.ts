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
   * @returns {Promise<void>} - This method does not return anything upon successful completion.
   * @throws {ResourceValidationError} - If there are validation errors related to the provided information.
   * @throws {ReadError} - If there are errors while reading data.
   * @throws {WriteError} - If there are errors while writing data.
   */
  async execute(datasetId: number | string, updatedDataset: DatasetDTO): Promise<void> {
    const metadataBlocks = await this.getNewDatasetMetadataBlocks(updatedDataset)
    this.getNewDatasetValidator().validate(updatedDataset, metadataBlocks)
    return this.getDatasetsRepository().updateDataset(datasetId, updatedDataset, metadataBlocks)
  }
}
