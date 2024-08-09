import { UseCase } from '../../../core/domain/useCases/UseCase'
import { MetadataBlock } from '../..'
import { IMetadataBlocksRepository } from '../repositories/IMetadataBlocksRepository'

export class GetAllMetadataBlocks implements UseCase<MetadataBlock[]> {
  private metadataBlocksRepository: IMetadataBlocksRepository

  constructor(metadataBlocksRepository: IMetadataBlocksRepository) {
    this.metadataBlocksRepository = metadataBlocksRepository
  }

  /**
   * Returns a MetadataBlock array containing the metadata blocks defined in the installation.
   *
   * @returns {Promise<MetadataBlock[]>}
   */
  async execute(): Promise<MetadataBlock[]> {
    return await this.metadataBlocksRepository.getAllMetadataBlocks()
  }
}
