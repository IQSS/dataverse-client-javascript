import { CreateTemplateDTO } from '../dtos/CreateTemplateDTO'
import { UpdateTemplateLicenseTermsDTO } from '../dtos/UpdateTemplateLicenseTermsDTO'
import { UpdateTemplateMetadataDTO } from '../dtos/UpdateTemplateMetadataDTO'
import { Template } from '../models/Template'
import { TermsOfAccess } from '../../../datasets/domain/models/Dataset'

export interface ITemplatesRepository {
  createTemplate(collectionIdOrAlias: number | string, template: CreateTemplateDTO): Promise<void>
  updateTemplateMetadata(
    templateId: number,
    payload: UpdateTemplateMetadataDTO,
    replace?: boolean
  ): Promise<void>
  updateTemplateLicenseTerms(
    templateId: number,
    payload: UpdateTemplateLicenseTermsDTO
  ): Promise<void>
  updateTemplateTermsOfAccess(templateId: number, termsOfAccess: TermsOfAccess): Promise<void>
  getTemplate(templateId: number): Promise<Template>
  getTemplatesByCollectionId(collectionIdOrAlias: number | string): Promise<Template[]>
  deleteTemplate(templateId: number): Promise<void>
  setTemplateAsDefault(collectionIdOrAlias: number | string, templateId: number): Promise<void>
  unsetTemplateAsDefault(collectionIdOrAlias: number | string): Promise<void>
}
