import { GetCollection } from "./domain/useCases/GetCollection";
// TODO
// import { GetCollectionRoles } from "./domain/useCases/getCollectionRoles";
// import { GetCollectionIsRoot } from "./domain/useCases/getCollectionIsRoot";
// import { GetCollectionFacets } from "./domain/useCases/getCollectionFacets";
// import { GetCollectionMetadata } from "./domain/useCases/getCollectionMetadata";
// import { GetCollectionStorageSize } from "./domain/useCases/getCollectionStorageSize";
// import { GetCollectionMetadataBlocks } from "./domain/useCases/getCollectionMetadataBlocks";
// import { GetCollectionRolesAssignments } from "./domain/useCases/getCollectionRolesAssignments";
import { CollectionsRepository } from "./infra/repositories/CollectionsRepository";

const collectionsRepository = new CollectionsRepository()

const getCollection = new GetCollection(collectionsRepository)

// const getCollectionRoles = new GetCollectionRoles(collectionsRepository)
// const getCollectionIsRoot = new GetCollectionIsRoot(collectionsRepository)
// const getCollectionFacets = new GetCollectionFacets(collectionsRepository)
// const getCollectionMetadata = new GetCollectionMetadata(collectionsRepository)
// const getCollectionStorageSize = new GetCollectionStorageSize(collectionsRepository)
// const getCollectionMetadataBlocks = new GetCollectionMetadataBlocks(collectionsRepository)
// const getCollectionRolesAssignments = new GetCollectionRolesAssignments(collectionsRepository)

export {
  getCollection
  // TODO
  // getCollectionRoles()
  // getCollectionIsRoot()
  // getCollectionFacets()
  // getCollectionMetadata()
  // getCollectionStorageSize()
  // getCollectionMetadataBlocks()
  // getCollectionRolesAssignments()
}
export {
  Collection,
  CollectionType,
  CollectionContacts
} from './domain/models/Collection'
