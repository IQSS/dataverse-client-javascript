export interface CollectionPayload {
  id: number
  alias: string
  name: string
  // ownerId: number
  // creationDate: Date
  affiliation: string
  // description?: string
  // permissionRoot: boolean
  // dataverseType: CollectionType
  // dataverseContacts?: CollectionContactsPayload
}

export interface CollectionContactsPayload {
  displayOrder?: number
  contactEmail: string
}

export enum CollectionType {
  DEPARTMENT = 'DEPARTMENT',
  JOURNALS = 'JOURNALS',
  LABORATORY = 'LABORATORY',
  ORGANIZATIONS_INSTITUTIONS = 'ORGANIZATIONS_INSTITUTIONS',
  RESEARCHERS = 'RESEARCHERS',
  RESEARCH_GROUP = 'RESEARCH_GROUP',
  RESEARCH_PROJECTS = 'RESEARCH_PROJECTS',
  TEACHING_COURSES = 'TEACHING_COURSES',
  UNCATEGORIZED = 'UNCATEGORIZED'
}
