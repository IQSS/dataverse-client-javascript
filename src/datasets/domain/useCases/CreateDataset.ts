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

  async execute(newDataset: NewDatasetDTO, collectionId: string = 'root'): Promise<CreatedDatasetIdentifiers> {
    const metadataBlocks = await this.getNewDatasetMetadataBlocks(newDataset);
    return await this.newDatasetValidator.validate(newDataset, metadataBlocks).then(async () => {
      return await this.datasetsRepository.createDataset(newDataset, metadataBlocks, collectionId);
    });
  }

  async getNewDatasetMetadataBlocks(newDataset: NewDatasetDTO): Promise<MetadataBlock[]> {
    let metadataBlocks: MetadataBlock[] = [];
    for (const metadataBlockValue in newDataset.metadataBlockValues) {
      metadataBlocks.push(
        await this.metadataBlocksRepository.getMetadataBlockByName(
          (metadataBlockValue as unknown as NewDatasetMetadataBlockValuesDTO).name,
        ),
      );
    }
    return metadataBlocks;
  }
}
