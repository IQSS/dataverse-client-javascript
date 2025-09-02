import { MetadataFieldPayload } from '../../../../datasets/infra/repositories/transformers/DatasetPayload'

export interface CollectionDatasetTemplatePayload {
  id: number
  name: string
  dataverseAlias: string
  isDefault: boolean
  usageCount: number
  createTime: string
  createDate: string
  // 👇 From Edit Template Metadata
  datasetFields: DatasetFieldsPayload
  instructions: Instruction[]
  // 👇 From Edit Template Terms
  termsOfUseAndAccess: {
    id: number
    fileAccessRequest: boolean
    // This license property is going to be present if not custom terms are added in the UI
    license?: {
      id: number
      name: string
      shortDescription: string
      uri: string
      iconUrl?: string
      active: boolean
      isDefault: boolean
      sortOrder: number
      rightsIdentifier: string
      rightsIdentifierScheme?: string
      schemeUri: string
      languageCode: string
    }
    // Below fields are going to be present if are added in "Restricted Files + Terms of Access"
    termsOfAccess?: string // This is terms of access for restricted files in the JSF UI
    dataAccessPlace?: string
    originalArchive?: string
    availabilityStatus?: string
    sizeOfCollection?: string
    studyCompletion?: string
    contactForAccess?: string
    // Below fields are going to be present if custom terms are added in the UI, they will be mapped and grouped under customTerms
    termsOfUse?: string
    confidentialityDeclaration?: string
    specialPermissions?: string
    restrictions?: string
    citationRequirements?: string
    depositorRequirements?: string
    conditions?: string
    disclaimer?: string
  }
}

type DatasetFieldsPayload = Record<string, DatasetFieldInfoPayload>

interface DatasetFieldInfoPayload {
  displayName: string
  name: string
  fields: MetadataFieldPayload[]
}

interface Instruction {
  instructionField: string
  instructionText: string
}
