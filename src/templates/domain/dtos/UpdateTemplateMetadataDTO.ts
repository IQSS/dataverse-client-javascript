import { TemplateFieldDTO, TemplateInstructionDTO } from './CreateTemplateDTO'

export interface UpdateTemplateMetadataDTO {
  name?: string
  fields?: TemplateFieldDTO[]
  instructions?: TemplateInstructionDTO[]
}
