import { TemplatesRepository } from './infra/repositories/TemplatesRepository'
import { CreateDatasetTemplate } from './domain/useCases/CreateDatasetTemplate'
import { DeleteTemplate } from './domain/useCases/DeleteTemplate'
import { GetDatasetTemplates } from './domain/useCases/GetDatasetTemplates'
import { GetTemplate } from './domain/useCases/GetTemplate'

const templatesRepository = new TemplatesRepository()

const createDatasetTemplate = new CreateDatasetTemplate(templatesRepository)
const deleteTemplate = new DeleteTemplate(templatesRepository)
const getDatasetTemplates = new GetDatasetTemplates(templatesRepository)
const getTemplate = new GetTemplate(templatesRepository)

export { createDatasetTemplate, deleteTemplate, getDatasetTemplates, getTemplate }
export {
  CreateDatasetTemplateDTO,
  TemplateFieldDTO,
  TemplateFieldValueDTO,
  TemplateFieldValuePrimitiveDTO,
  TemplateFieldValueCompoundDTO,
  TemplateFieldValueControlledVocabularyDTO,
  TemplateInstructionDTO
} from './domain/dtos/CreateDatasetTemplateDTO'
export { DatasetTemplate, DatasetTemplateInstruction } from './domain/models/DatasetTemplate'
