export interface MetadataFieldInfoPayload {
  name: string
  displayName: string
  displayOnCreate: boolean
  title: string
  type: string
  typeClass: string
  watermark: string
  description: string
  multiple: boolean
  isControlledVocabulary: boolean
  displayFormat: string
  displayOrder: number
  isRequired: boolean
  controlledVocabularyValues?: string[]
  childMetadataFields?: Record<string, MetadataFieldInfoPayload>
}
