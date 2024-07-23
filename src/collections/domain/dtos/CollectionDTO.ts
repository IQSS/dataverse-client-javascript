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

export enum CollectionType {
  RESEARCHERS = 'RESEARCHERS',
  RESEARCH_PROJECTS = 'RESEARCH_PROJECTS',
  JOURNALS = 'JOURNALS',
  ORGANIZATIONS_INSTITUTIONS = 'ORGANIZATIONS_INSTITUTIONS',
  TEACHING_COURSES = 'TEACHING_COURSES',
  UNCATEGORIZED = 'UNCATEGORIZED',
  LABORATORY = 'LABORATORY',
  RESEARCH_GROUP = 'RESEARCH_GROUP',
  DEPARTMENT = 'DEPARTMENT'
}
