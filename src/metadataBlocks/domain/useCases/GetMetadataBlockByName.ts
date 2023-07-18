import { UseCase } from '../../../core/domain/useCases/UseCase';
import { IMetadataBlocksRepository } from '../repositories/IMetadataBlocksRepository';
import { MetadataBlock } from '../models/MetadataBlock';

export class GetMetadataBlockByName implements UseCase<MetadataBlock> {
  private metadataBlocksRepository: IMetadataBlocksRepository;

  constructor(metadataBlocksRepository: IMetadataBlocksRepository) {
    this.metadataBlocksRepository = metadataBlocksRepository;
  }

  async execute(metadataBlockName: string): Promise<MetadataBlock> {
    return await this.metadataBlocksRepository.getMetadataBlockByName(metadataBlockName);
  }
}
