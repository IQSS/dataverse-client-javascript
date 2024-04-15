import { UseCase } from '../../../core/domain/useCases/UseCase'
import { MetadataBlock } from '../..'
import { ROOT_COLLECTION_ALIAS } from '../../../collections/domain/models/Collection'
import { IMetadataBlocksRepository } from '../repositories/IMetadataBlocksRepository'

export class GetCollectionMetadataBlocks implements UseCase<MetadataBlock[]> {
  private metadataBlocksRepository: IMetadataBlocksRepository

  constructor(metadataBlocksRepository: IMetadataBlocksRepository) {
    this.metadataBlocksRepository = metadataBlocksRepository
  }

  /**
   * Returns a MetadataBlock array containing the metadata blocks from the requested collection.
   *
   * @param {number | string} [collectionIdOrAlias = 'root'] - A generic collection identifier, which can be either a string (for queries by CollectionAlias), or a number (for queries by CollectionId)
   * If this parameter is not set, the default value is: 'root'
   * @param {boolean} [onlyDisplayedOnCreate=false] - Indicates whether or not to return only the metadata blocks that are displayed on dataset creation. The default value is false.
   * @returns {Promise<MetadataBlock[]>}
   */
  async execute(
    collectionIdOrAlias: number | string = ROOT_COLLECTION_ALIAS,
    onlyDisplayedOnCreate = false
  ): Promise<MetadataBlock[]> {
    return await this.metadataBlocksRepository.getCollectionMetadataBlocks(
      collectionIdOrAlias,
      onlyDisplayedOnCreate
    )
  }
}
