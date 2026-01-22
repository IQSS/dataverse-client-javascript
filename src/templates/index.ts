import { TemplatesRepository } from './infra/repositories/TemplatesRepository'
import { CreateTemplate } from './domain/useCases/CreateTemplate'
import { DeleteTemplate } from './domain/useCases/DeleteTemplate'
import { GetTemplatesByCollectionId } from './domain/useCases/GetTemplatesByCollectionId'
import { GetTemplate } from './domain/useCases/GetTemplate'
import { SetDefaultTemplate } from './domain/useCases/SetDefaultTemplate'
import { RemoveDefaultTemplate } from './domain/useCases/RemoveDefaultTemplate'

const templatesRepository = new TemplatesRepository()

const createTemplate = new CreateTemplate(templatesRepository)
const deleteTemplate = new DeleteTemplate(templatesRepository)
const getTemplatesByCollectionId = new GetTemplatesByCollectionId(templatesRepository)
const getTemplate = new GetTemplate(templatesRepository)
const setDefaultTemplate = new SetDefaultTemplate(templatesRepository)
const removeDefaultTemplate = new RemoveDefaultTemplate(templatesRepository)

export {
  createTemplate,
  deleteTemplate,
  getTemplatesByCollectionId,
  getTemplate,
  setDefaultTemplate,
  removeDefaultTemplate
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
