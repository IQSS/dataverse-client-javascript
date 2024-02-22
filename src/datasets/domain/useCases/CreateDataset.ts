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

  async execute(newDataset: NewDatasetDTO, collectionId = 'root'): Promise<CreatedDatasetIdentifiers> {
    const metadataBlocks = await this.getNewDatasetMetadataBlocks(newDataset);
    this.newDatasetValidator.validate(newDataset, metadataBlocks);
    return this.datasetsRepository.createDataset(newDataset, metadataBlocks, collectionId);
  }

  async getNewDatasetMetadataBlocks(newDataset: NewDatasetDTO): Promise<MetadataBlock[]> {
    const metadataBlocks: MetadataBlock[] = [];
    await Promise.all(
      newDataset.metadataBlockValues.map(async (metadataBlockValue: NewDatasetMetadataBlockValuesDTO) => {
        metadataBlocks.push(await this.metadataBlocksRepository.getMetadataBlockByName(metadataBlockValue.name));
      }),
    );
    return metadataBlocks;
  }
}
