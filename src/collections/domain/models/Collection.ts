export interface Collection {
  id: number
  name: string
  alias: string
  ownerId: number
  affiliation: string
  description?: string
  creationDate: Date
  collectionType: CollectionType
  permissionRoot: boolean
  // NOTE: Changed from Dataverse => Collection
  collectionContacts: CollectionContacts
}

export interface CollectionContacts {
  displayOrder?: number
  contactEmail: string
}

export enum CollectionType {
  DEPARTMENT = "DEPARTMENT",
  JOURNALS = "JOURNALS",
  LABORATORY = "LABORATORY",
  ORGANIZATIONS_INSTITUTIONS = "ORGANIZATIONS_INSTITUTIONS",
  RESEARCHERS = "RESEARCHERS",
  RESEARCH_GROUP = "RESEARCH_GROUP",
  RESEARCH_PROJECTS = "RESEARCH_PROJECTS",
  TEACHING_COURSES = "TEACHING_COURSES",
  UNCATEGORIZED = "UNCATEGORIZED",
}

export type CollectionMetadataBlocks = [CollectionMetadataBlock, ...CollectionMetadataBlock[]]

export interface CollectionMetadataBlock {
  name: string
  fields: CollectionMetadataFields
}

export type CollectionMetadataFields = Record<string, DatasetMetadataFieldValue>

export type DatasetMetadataFieldValue = string

// TODO: Do we need this later?
// export interface CollectionMetadataBlock extends CollectionMetadataBlock {
//   name:
//   fields: {

//   }
// }
