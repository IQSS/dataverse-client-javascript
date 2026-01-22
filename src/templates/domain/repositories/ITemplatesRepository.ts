import { CreateTemplateDTO } from '../dtos/CreateTemplateDTO'
import { Template } from '../models/Template'

export interface ITemplatesRepository {
  createTemplate(collectionIdOrAlias: number | string, template: CreateTemplateDTO): Promise<void>
  getTemplate(templateId: number): Promise<Template>
  getTemplatesByCollectionId(collectionIdOrAlias: number | string): Promise<Template[]>
  deleteTemplate(templateId: number): Promise<void>
  setTemplateAsDefault(collectionIdOrAlias: number | string, templateId: number): Promise<void>
  unsetTemplateAsDefault(collectionIdOrAlias: number | string): Promise<void>
}
