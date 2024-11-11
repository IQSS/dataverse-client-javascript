import { CollectionType } from '../models/CollectionType'

export interface CollectionDTO {
  alias: string
  name: string
  contacts: string[]
  type: CollectionType
  affiliation?: string
  description?: string
  metadataBlockNames?: string[]
  facetIds?: string[]
  inputLevels?: CollectionInputLevelDTO[]
}

export interface CollectionInputLevelDTO {
  datasetFieldName: string
  include: boolean
  required: boolean
}
