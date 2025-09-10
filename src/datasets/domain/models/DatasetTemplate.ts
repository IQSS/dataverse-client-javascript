import { DatasetMetadataBlock, TermsOfUse } from './Dataset'
import { License } from '../../../licenses/domain/models/License'

export interface DatasetTemplate {
  id: number
  name: string
  collectionAlias: string
  isDefault: boolean
  usageCount: number
  createTime: string
  createDate: string
  // 👇 From Edit Template Metadata
  datasetMetadataBlocks: DatasetMetadataBlock[]
  instructions: DatasetTemplateInstruction[]
  // 👇 From Edit Template Terms
  termsOfUse: TermsOfUse
  license?: License // This license property is going to be present if not custom terms are added in the UI
}

export interface DatasetTemplateInstruction {
  instructionField: string
  instructionText: string
}
