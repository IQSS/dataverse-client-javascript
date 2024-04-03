export interface MetadataBlock {
  id: number
  name: string
  displayName: string
  metadataFields: Record<string, MetadataFieldInfo>
  displayOnCreate: boolean
}

export interface MetadataFieldInfo {
  name: string
  displayName: string
  title: string
  type: MetadataFieldType
  typeClass: MetadataFieldTypeClass
  watermark: MetadataFieldWatermark
  description: string
  multiple: boolean
  isControlledVocabulary: boolean
  controlledVocabularyValues?: string[]
  displayFormat: string
  childMetadataFields?: Record<string, MetadataFieldInfo>
  isRequired: boolean
  displayOrder: number
  displayOnCreate: boolean
}

export enum MetadataFieldType {
  Date = 'DATE',
  Email = 'EMAIL',
  Float = 'FLOAT',
  Int = 'INT',
  None = 'NONE',
  Text = 'TEXT',
  Textbox = 'TEXTBOX',
  URL = 'URL'
}

export enum MetadataFieldTypeClass {
  Compound = 'compound',
  ControlledVocabulary = 'controlledVocabulary',
  Primitive = 'primitive'
}

export enum MetadataFieldWatermark {
  Empty = '',
  EnterAFloatingPointNumber = 'Enter a floating-point number.',
  EnterAnInteger = 'Enter an integer.',
  FamilyNameGivenNameOrOrganization = 'FamilyName, GivenName or Organization',
  HTTPS = 'https://',
  NameEmailXyz = 'name@email.xyz',
  OrganizationXYZ = 'Organization XYZ',
  The1FamilyNameGivenNameOr2Organization = '1) FamilyName, GivenName or 2) Organization',
  The1FamilyNameGivenNameOr2OrganizationXYZ = '1) Family Name, Given Name or 2) Organization XYZ',
  WatermarkEnterAnInteger = 'Enter an integer...',
  YYYYOrYYYYMMOrYYYYMMDD = 'YYYY or YYYY-MM or YYYY-MM-DD',
  YyyyMmDD = 'YYYY-MM-DD'
}
