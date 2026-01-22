import { CreateTemplateDTO } from '../dtos/CreateTemplateDTO'
import { Template } from '../models/Template'

export interface ITemplatesRepository {
  createTemplate(collectionIdOrAlias: number | string, template: CreateTemplateDTO): Promise<void>
  getTemplate(templateId: number): Promise<Template>
  getTemplatesByCollectionId(collectionIdOrAlias: number | string): Promise<Template[]>
  deleteTemplate(templateId: number): Promise<void>
  setDefaultTemplate(collectionIdOrAlias: number | string, templateId: number): Promise<void>
  unsetDefaultTemplate(collectionIdOrAlias: number | string): Promise<void>
}
