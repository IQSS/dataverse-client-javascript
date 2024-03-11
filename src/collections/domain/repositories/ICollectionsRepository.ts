import { Collection } from "../models/Collection"
export interface ICollectionsRepository {
  getCollection(
    collectionId: string,
    // parentCollection: number | string,
  ): Promise<Collection>
  // getCollectionRoles()
  // getCollectionIsRoot()
  // getCollectionFacets()
  // getCollectionMetadata()
  // getCollectionStorageSize()
  // getCollectionMetadataBlocks()
  // getCollectionRolesAssignments()
  /*
   * https://guides.dataverse.org/en/6.1/api/native-api.html#retrieve-a-dataset-json-schema-for-a-collection
   *
  */
  // getCollectionSchema()
}