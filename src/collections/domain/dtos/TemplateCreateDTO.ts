import { MetadataFieldTypeClass } from '../../../metadataBlocks/domain/models/MetadataBlock'

export interface TemplateCreateDTO {
  name: string
  isDefault: boolean | false // defaults to false if not provided
  fields?: TemplateFieldDTO[]
  instructions?: TemplateInstructionDTO[]
}

export interface TemplateFieldDTO {
  typeName: string
  multiple: boolean
  typeClass: MetadataFieldTypeClass
  value: TemplateFieldValueDTO[]
}

export interface TemplateFieldValueDTO {
  [key: string]:
    | TemplateFieldValuePrimitiveDTO
    | TemplateFieldValueCompoundDTO
    | TemplateFieldValueControlledVocabularyDTO
}

export interface TemplateFieldValuePrimitiveDTO {
  typeName: string
  typeClass: MetadataFieldTypeClass.Primitive
  value: string | string[]
}

export interface TemplateFieldValueCompoundDTO {
  typeName: string
  typeClass: MetadataFieldTypeClass.Compound
  value: TemplateFieldValueDTO[]
}

export interface TemplateFieldValueControlledVocabularyDTO {
  typeName: string
  typeClass: MetadataFieldTypeClass.ControlledVocabulary
  value: string
}

export interface TemplateInstructionDTO {
  instructionField: string
  instructionText: string
}
