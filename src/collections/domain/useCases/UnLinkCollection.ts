import { UseCase } from '../../../core/domain/useCases/UseCase'
import { ICollectionsRepository } from '../repositories/ICollectionsRepository'

export class UnLinkCollection implements UseCase<void> {
  private collectionsRepository: ICollectionsRepository

  constructor(collectionsRepository: ICollectionsRepository) {
    this.collectionsRepository = collectionsRepository
  }

  /**
   * Unlinks a collection from the collection that links to it
   *
   * @param {number| string} [linkedCollectionIdOrAlias] - The collection that is linked. Can be either a string (collection alias), or a number (collection id)
   * @param { number | string} [linkingCollectionIdOrAlias] - The collection that links to the linked collection.  Can be either a  string (collection alias), or a number (collection id)
   * @returns {Promise<void>} -This method does not return anything upon successful completion.
   */
  async execute(
    linkedCollectionIdOrAlias: number | string,
    linkingCollectionIdOrAlias: number | string
  ): Promise<void> {
    return await this.collectionsRepository.unlinkCollection(
      linkedCollectionIdOrAlias,
      linkingCollectionIdOrAlias
    )
  }
}
