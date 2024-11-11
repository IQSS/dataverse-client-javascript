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
  dataverseType: string
  usesMetadataFieldsFromParent: boolean
  usesBrowseSearchFacetsFromParent: boolean
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
