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
  isMetadataBlockRoot: boolean
  isFacetRoot: boolean
  childCount: number
  theme?: CollectionThemePayload
}

export interface CollectionThemePayload {
  id: number
  logo?: string
  tagline?: string
  linkUrl?: string
  linkColor?: string
  textColor?: string
  backgroundColor?: string
  logoBackgroundColor?: string
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
