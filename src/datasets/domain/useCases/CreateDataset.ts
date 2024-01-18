import { UseCase } from '../../../core/domain/useCases/UseCase';
import { IDatasetsRepository } from '../repositories/IDatasetsRepository';
import { NewDataset, NewDatasetMetadataBlockValues } from '../models/NewDataset';
import { NewResourceValidator } from '../../../core/domain/useCases/validators/NewResourceValidator';
import { IMetadataBlocksRepository } from '../../../metadataBlocks/domain/repositories/IMetadataBlocksRepository';
import { MetadataBlock } from '../../../metadataBlocks';

export class CreateDataset implements UseCase<void> {
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

  async execute(newDataset: NewDataset): Promise<void> {
    const metadataBlocks = await this.getNewDatasetMetadataBlocks(newDataset);
    return await this.newDatasetValidator.validate(newDataset, metadataBlocks).then(async () => {
      return await this.datasetsRepository.createDataset(newDataset, metadataBlocks);
    });
  }

  async getNewDatasetMetadataBlocks(newDataset: NewDataset): Promise<MetadataBlock[]> {
    let metadataBlocks: MetadataBlock[] = [];
    for (const metadataBlockValue in newDataset.metadataBlockValues) {
      metadataBlocks.push(
        await this.metadataBlocksRepository.getMetadataBlockByName(
          (metadataBlockValue as unknown as NewDatasetMetadataBlockValues).name,
        ),
      );
    }
    return metadataBlocks;
  }
}
