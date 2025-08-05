import { UseCase } from '../../../core/domain/useCases/UseCase'
import { ICollectionsRepository } from '../repositories/ICollectionsRepository'

export class LinkCollection implements UseCase<void> {
  private collectionsRepository: ICollectionsRepository

  constructor(collectionsRepository: ICollectionsRepository) {
    this.collectionsRepository = collectionsRepository
  }

  /**
   * Deletes the Dataverse collection whose database ID or alias is given:
   *
   * @param {number| string} [linkedCollectionIdOrAlias] - The collection to be linked. Can be either a string (collection alias), or a number (collection id)
   * @param { number | string} [linkingCollectionIdOrAlias] - The collection that will be linking to the linked collection.  Can be either a  string (collection alias), or a number (collection id)
   * @returns {Promise<void>} -This method does not return anything upon successful completion.
   */
  async execute(
    linkedCollectionIdOrAlias: number | string,
    linkingCollectionIdOrAlias: number | string
  ): Promise<void> {
    return await this.collectionsRepository.linkCollection(
      linkedCollectionIdOrAlias,
      linkingCollectionIdOrAlias
    )
  }
}
