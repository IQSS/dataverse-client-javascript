// TODO:ME - Adding custom terms makes the get dataset templates endpoint throw internal server error

export interface CollectionDatasetTemplatePayload {
  id: number
  name: string
  isDefault: boolean
  usageCount: number
  createTime: string
  createDate: string
  termsOfUseAndAccess: TermsOfUseAndAccess
  datasetFields: DatasetFields
  instructions: Instruction[]
  dataverseAlias: string
}

export interface TermsOfUseAndAccess {
  id: number
  license: License
  // Below fields are going to be present if are added in "Restricted Files + Terms of Access"
  termsOfAccess?: string // This is terms of access for restricted files in the JSF UI
  dataAccessPlace?: string
  originalArchive?: string
  availabilityStatus?: string
  sizeOfCollection?: string
  studyCompletion?: string
  // Below fields are going to be present if custom terms are added in the JSF UI
  termsOfUse?: string
  confidentialityDeclaration?: string
  specialPermissions?: string
  restrictions?: string
  citationRequirements?: string
  depositorRequirements?: string
  conditions?: string
  disclaimer?: string
}

export interface License {
  id: number
  name: string
  shortDescription: string
  uri: string
  iconUrl: string
  active: boolean
  isDefault: boolean
  sortOrder: number
  rightsIdentifier: string
  rightsIdentifierScheme: string
  schemeUri: string
  languageCode: string
}

export interface DatasetFields {
  citation: Citation
}

export interface Citation {
  displayName: string
  name: string
  fields: Field[]
}

export interface Field {
  typeName: string
  multiple: boolean
  typeClass: string
  value: string
}

export interface Instruction {
  instructionField: string
  instructionText: string
}
