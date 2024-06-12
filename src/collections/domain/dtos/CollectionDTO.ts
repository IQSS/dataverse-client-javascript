export interface CollectionDTO {
  alias: string
  name: string
  contacts: string[]
  type: CollectionType
}

export enum CollectionType {
  RESEARCHERS,
  RESEARCH_PROJECTS,
  JOURNALS,
  ORGANIZATIONS_INSTITUTIONS,
  TEACHING_COURSES,
  UNCATEGORIZED,
  LABORATORY,
  RESEARCH_GROUP,
  DEPARTMENT
}
