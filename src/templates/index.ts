import { TemplatesRepository } from './infra/repositories/TemplatesRepository'
import { CreateTemplate } from './domain/useCases/CreateTemplate'
import { DeleteTemplate } from './domain/useCases/DeleteTemplate'
import { GetDatasetTemplates } from './domain/useCases/GetDatasetTemplates'
import { GetTemplate } from './domain/useCases/GetTemplate'

const templatesRepository = new TemplatesRepository()

const createTemplate = new CreateTemplate(templatesRepository)
const deleteTemplate = new DeleteTemplate(templatesRepository)
const getDatasetTemplates = new GetDatasetTemplates(templatesRepository)
const getTemplate = new GetTemplate(templatesRepository)

export { createTemplate, deleteTemplate, getDatasetTemplates, getTemplate }
export {
  CreateTemplateDTO,
  TemplateFieldDTO,
  TemplateFieldValueDTO,
  TemplateFieldValuePrimitiveDTO,
  TemplateFieldValueCompoundDTO,
  TemplateFieldValueControlledVocabularyDTO,
  TemplateInstructionDTO
} from './domain/dtos/CreateTemplateDTO'
export { Template, TemplateInstruction } from './domain/models/Template'
