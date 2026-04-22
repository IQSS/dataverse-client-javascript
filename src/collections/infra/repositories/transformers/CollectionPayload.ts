import { OwnerNodePayload } from '../../../../core/infra/repositories/transformers/OwnerNodePayload'

export interface CollectionPayload {
  id: number
  alias: string
  name: string
  affiliation?: string
  isReleased: boolean
  description?: string
  isPartOf: OwnerNodePayload
  inputLevels?: CollectionInputLevelPayload[]
  dataverseContacts?: CollectionContactPayload[]
  allowedDatasetTypes?: AllowedDatasetTypePayload[]
  dataverseType: string
  isMetadataBlockRoot: boolean
  isFacetRoot: boolean
  childCount: number
}

export interface CollectionInputLevelPayload {
  datasetFieldTypeName: string
  required: boolean
  include: boolean
}

export interface CollectionContactPayload {
  contactEmail: string
  displayOrder: number
}

export interface AllowedDatasetTypePayload {
  id: number
  name: string
  displayName: string
  description?: string
  linkedMetadataBlocks?: string[]
  availableLicenses?: string[]
}
