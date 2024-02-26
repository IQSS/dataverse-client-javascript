import { UseCase } from '../../../core/domain/useCases/UseCase';
import { IDatasetsRepository } from '../repositories/IDatasetsRepository';
import { NewDatasetDTO, NewDatasetMetadataBlockValuesDTO } from '../dtos/NewDatasetDTO';
import { NewResourceValidator } from '../../../core/domain/useCases/validators/NewResourceValidator';
import { IMetadataBlocksRepository } from '../../../metadataBlocks/domain/repositories/IMetadataBlocksRepository';
import { MetadataBlock } from '../../../metadataBlocks';
import { CreatedDatasetIdentifiers } from '../models/CreatedDatasetIdentifiers';

export class CreateDataset implements UseCase<CreatedDatasetIdentifiers> {
  private datasetsRepository: IDatasetsRepository;
  private metadataBlocksRepository: IMetadataBlocksRepository;
  private newDatasetValidator: NewResourceValidator;

  constructor(
    datasetsRepository: IDatasetsRepository,
    metadataBlocksRepository: IMetadataBlocksRepository,
    newDatasetValidator: NewResourceValidator,
  ) {
    this.datasetsRepository = datasetsRepository;
    this.metadataBlocksRepository = metadataBlocksRepository;
    this.newDatasetValidator = newDatasetValidator;
  }

  /**
   * Creates a new Dataset in a collection, given a NewDatasetDTO object and an optional collection identifier, which defaults to root.
   *
   * @param {NewDatasetDTO} [newDataset] - NewDatasetDTO object including the new dataset metadata field values for each metadata block.
   * @param {string} [collectionId] - Specifies the collection identifier where the new dataset should be created (optional, defaults to root).
   * @returns {Promise<CreatedDatasetIdentifiers>}
   * @throws {ResourceValidationError} - If there are validation errors related to the provided information.
   * @throws {ReadError} - If there are errors while reading data.
   * @throws {WriteError} - If there are errors while writing data.
   */
  async execute(newDataset: NewDatasetDTO, collectionId: string = 'root'): Promise<CreatedDatasetIdentifiers> {
    const metadataBlocks = await this.getNewDatasetMetadataBlocks(newDataset);
    this.newDatasetValidator.validate(newDataset, metadataBlocks);
    return this.datasetsRepository.createDataset(newDataset, metadataBlocks, collectionId);
  }

  async getNewDatasetMetadataBlocks(newDataset: NewDatasetDTO): Promise<MetadataBlock[]> {
    let metadataBlocks: MetadataBlock[] = [];
    await Promise.all(
      newDataset.metadataBlockValues.map(async (metadataBlockValue: NewDatasetMetadataBlockValuesDTO) => {
        metadataBlocks.push(await this.metadataBlocksRepository.getMetadataBlockByName(metadataBlockValue.name));
      }),
    );
    return metadataBlocks;
  }
}
