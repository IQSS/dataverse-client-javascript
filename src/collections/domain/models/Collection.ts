// https://demo.dataverse.org/api/dataverses/root
// {
//   "status": "OK",
//   "data": {
//     "id": 2007368,
//     "alias": "root",
//     "name": "Oscar Moreno Dataverse",
//     "dataverseContacts": [
//       {
//         "displayOrder": 0,
//         "contactEmail": "dev.oscar.acmo@gmail.com"
//       }
//     ],
//     "permissionRoot": true,
//     "dataverseType": "LABORATORY",
//     "ownerId": 1,
//     "creationDate": "2022-09-20T17:27:43Z",
        // "theme": {
        //         "backgroundColor" : "gray",
        //         "linkColor" : "red",
        //         "linkUrl" : "http://www.cnn.com",
        //         "logo" : "lion",
        //         "logoAlignment" : "center",
        //         "logoBackgroundColor" : "navy",
        //         "logoFormat" : "square",
        //         "tagline" : "The Real Thing",
        //         "textColor" : "black"
        //     }
//   }
// }
import { DvObjectOwnerNode } from '../../../core/domain/models/DvObjectOwnerNode'

export interface Collection {
  id: number
  ownerId: number
  name: string
  alias: string
  dataverseContacts: DataverseContacts //TODO: Rename to Collection
  permissionRoot: boolean
  affiliation: string
  description: string
  collectionType: CollectionType
  createTime: string
  // metadataBlocks: CollectionMetadataBlocks
  // roles: Set<DataverseRole>  // From: DataverseModel-current
  // isPartOf: DvObjectOwnerNode // Previously 'Owner'?
  //
  // Taken from doc/Architecture/DataverseModel
  // hasRelesedDescendant: boolean
  // content: Set<DataverseObject>
  // add( Dataset )
  // add( Dataverse )
  // getContent() Set<DvObject>
}

export interface DataverseContacts {
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

export type DatasetMetadataBlocks = [CitationMetadataBlock, ...DatasetMetadataBlock[]]

export interface DatasetMetadataBlock {
  name: string
  fields: DatasetMetadataFields
}

export const ANONYMIZED_FIELD_VALUE = 'withheld'
type AnonymizedField = typeof ANONYMIZED_FIELD_VALUE

export type DatasetMetadataFields = Record<string, DatasetMetadataFieldValue>

export type DatasetMetadataFieldValue =
  | string
  | string[]
  | DatasetMetadataSubField
  | DatasetMetadataSubField[]
  | AnonymizedField

export type DatasetMetadataSubField = Record<string, string>

export interface CitationMetadataBlock extends DatasetMetadataBlock {
  name: 'citation'
  fields: {
// TODO
  }
}