import { UseCase } from '../../../core/domain/useCases/UseCase'
import { ICollectionsRepository } from '../repositories/ICollectionsRepository'
import { CollectionSummary } from '../models/CollectionSummary'

export type LinkingObjectType = 'collection' | 'dataset'

export class GetCollectionsForLinking implements UseCase<CollectionSummary[]> {
  private collectionsRepository: ICollectionsRepository

  constructor(collectionsRepository: ICollectionsRepository) {
    this.collectionsRepository = collectionsRepository
  }

  /**
   * Returns an array of CollectionSummary (id, alias, displayName) to which the given Dataverse collection or Dataset may be linked.
   * @param objectType - 'dataverse' when providing a collection identifier/alias; 'dataset' when providing a dataset persistentId.
   * @param id - For objectType 'dataverse', a numeric id or alias string. For 'dataset', the persistentId string (e.g., doi:...)
   * @param searchTerm - Optional search term to filter by collection name. Defaults to empty string (no filtering).
   */
  async execute(
    objectType: LinkingObjectType,
    id: number | string,
    searchTerm = ''
  ): Promise<CollectionSummary[]> {
    return await this.collectionsRepository.getCollectionsForLinking(objectType, id, searchTerm)
  }
}
