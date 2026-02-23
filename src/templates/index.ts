import { TemplatesRepository } from './infra/repositories/TemplatesRepository'
import { CreateTemplate } from './domain/useCases/CreateTemplate'
import { DeleteTemplate } from './domain/useCases/DeleteTemplate'
import { GetTemplatesByCollectionId } from './domain/useCases/GetTemplatesByCollectionId'
import { GetTemplate } from './domain/useCases/GetTemplate'
import { UpdateTemplateMetadata } from './domain/useCases/UpdateTemplateMetadata'
import { UpdateTemplateLicenseTerms } from './domain/useCases/UpdateTemplateLicenseTerms'
import { UpdateTemplateTermsOfAccess } from './domain/useCases/UpdateTemplateTermsOfAccess'

const templatesRepository = new TemplatesRepository()

const createTemplate = new CreateTemplate(templatesRepository)
const deleteTemplate = new DeleteTemplate(templatesRepository)
const getTemplatesByCollectionId = new GetTemplatesByCollectionId(templatesRepository)
const getTemplate = new GetTemplate(templatesRepository)
const updateTemplateMetadata = new UpdateTemplateMetadata(templatesRepository)
const updateTemplateLicenseTerms = new UpdateTemplateLicenseTerms(templatesRepository)
const updateTemplateTermsOfAccess = new UpdateTemplateTermsOfAccess(templatesRepository)

export {
  createTemplate,
  deleteTemplate,
  getTemplatesByCollectionId,
  getTemplate,
  updateTemplateMetadata,
  updateTemplateLicenseTerms,
  updateTemplateTermsOfAccess
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
export { UpdateTemplateMetadataDTO } from './domain/dtos/UpdateTemplateMetadataDTO'
export { UpdateTemplateLicenseTermsDTO } from './domain/dtos/UpdateTemplateLicenseTermsDTO'
export { Template, TemplateInstruction } from './domain/models/Template'
