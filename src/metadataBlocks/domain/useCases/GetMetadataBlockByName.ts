import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IMetadataBlocksRepository } from '../repositories/IMetadataBlocksRepository'
import { MetadataBlock } from '../models/MetadataBlock'

export class GetMetadataBlockByName implements UseCase<MetadataBlock> {
  private metadataBlocksRepository: IMetadataBlocksRepository

  constructor(metadataBlocksRepository: IMetadataBlocksRepository) {
    this.metadataBlocksRepository = metadataBlocksRepository
  }

  /**
   * Returns a MetadataBlock instance, given its name.
   *
   * @param {string} [metadataBlockName] - The requested metadata block name.
   * @returns {Promise<MetadataBlock>}
   */
  async execute(metadataBlockName: string): Promise<MetadataBlock> {
    return await this.metadataBlocksRepository.getMetadataBlockByName(metadataBlockName)
  }
}
