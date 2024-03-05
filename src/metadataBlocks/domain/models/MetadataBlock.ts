export interface MetadataBlock {
  id: number
  name: string
  displayName: string
  metadataFields: Record<string, MetadataFieldInfo>
}

export interface MetadataFieldInfo {
  name: string
  displayName: string
  title: string
  type: string
  typeClass: string
  watermark: string
  description: string
  multiple: boolean
  isControlledVocabulary: boolean
  controlledVocabularyValues?: string[]
  displayFormat: string
  childMetadataFields?: Record<string, MetadataFieldInfo>
  isRequired: boolean
  displayOrder: number
}
