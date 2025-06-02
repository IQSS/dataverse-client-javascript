import { UseCase } from '../../../core/domain/useCases/UseCase'
import { MyDataCollectionItemSubset } from '../models/MyDataCollectionItemSubset'
import { ICollectionsRepository } from '../repositories/ICollectionsRepository'
import { CollectionItemType } from '../../../../src/collections/domain/models/CollectionItemType'
import { PublicationStatus } from '../../../../src/core/domain/models/PublicationStatus'

export class GetMyDataCollectionItems implements UseCase<MyDataCollectionItemSubset> {
  private collectionsRepository: ICollectionsRepository

  constructor(collectionsRepository: ICollectionsRepository) {
    this.collectionsRepository = collectionsRepository
  }

  /**
   * Returns an instance of  MyDataCollectionItemSubset that contains the items for which the user has the specified role or roles
   *
   * @param {number[]} [roleIds] - the ids of the roles to filter the items by.
   * @param {CollectionItemType[]} [collectionItemTypes] - the types of items to filter by.
   * @param {PublicationStatus[]} [publicationStatuses] - the publication statuses to filter by.
   * @param {number} [limit] - Limit number of items to return for pagination (optional).
   * @param {number} [selectedPage] - Offset (starting point) for pagination (optional).
   * @param {string} [searchText] - filter by searching for this text in the results (optional).
   * @param {string} [otherUserName] - filter by searching for this text in the results (optional).
   * * @returns {Promise<CollectionItemSubset>}
   */
  async execute(
    roleIds: number[],
    collectionItemTypes: CollectionItemType[],
    publicationStatuses: PublicationStatus[],
    limit?: number,
    selectedPage?: number,
    searchText?: string,
    otherUserName?: string
  ): Promise<MyDataCollectionItemSubset> {
    return this.collectionsRepository.getMyDataCollectionItems(
      roleIds,
      collectionItemTypes,
      publicationStatuses,
      limit,
      selectedPage,
      searchText,
      otherUserName
    )
  }
}
