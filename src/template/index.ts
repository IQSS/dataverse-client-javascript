import { TemplatesRepository } from './infra/repositories/TemplatesRepository'
import { CreateDatasetTemplate } from './domain/useCases/CreateDatasetTemplate'
import { GetDatasetTemplates } from './domain/useCases/GetDatasetTemplates'

const templatesRepository = new TemplatesRepository()

const createDatasetTemplate = new CreateDatasetTemplate(templatesRepository)
const getDatasetTemplates = new GetDatasetTemplates(templatesRepository)

export { createDatasetTemplate, getDatasetTemplates }
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
