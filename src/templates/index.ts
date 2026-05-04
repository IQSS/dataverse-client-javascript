import { TemplatesRepository } from './infra/repositories/TemplatesRepository'
import { CreateTemplate } from './domain/useCases/CreateTemplate'
import { DeleteTemplate } from './domain/useCases/DeleteTemplate'
import { GetTemplatesByCollectionId } from './domain/useCases/GetTemplatesByCollectionId'
import { GetTemplate } from './domain/useCases/GetTemplate'
import { SetTemplateAsDefault } from './domain/useCases/SetTemplateAsDefault'
import { UnsetTemplateAsDefault } from './domain/useCases/UnsetTemplateAsDefault'

const templatesRepository = new TemplatesRepository()

const createTemplate = new CreateTemplate(templatesRepository)
const deleteTemplate = new DeleteTemplate(templatesRepository)
const getTemplatesByCollectionId = new GetTemplatesByCollectionId(templatesRepository)
const getTemplate = new GetTemplate(templatesRepository)
const setTemplateAsDefault = new SetTemplateAsDefault(templatesRepository)
const unsetTemplateAsDefault = new UnsetTemplateAsDefault(templatesRepository)

export {
  createTemplate,
  deleteTemplate,
  getTemplatesByCollectionId,
  getTemplate,
  setTemplateAsDefault,
  unsetTemplateAsDefault
}
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
