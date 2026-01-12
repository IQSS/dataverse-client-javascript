import { CreateTemplateDTO } from '../dtos/CreateTemplateDTO'
import { Template } from '../models/Template'

export interface ITemplatesRepository {
  createDatasetTemplate(
    collectionIdOrAlias: number | string,
    template: CreateTemplateDTO
  ): Promise<void>
  getTemplate(templateId: number): Promise<Template>
  getTemplatesByCollectionId(collectionIdOrAlias: number | string): Promise<Template[]>
  deleteTemplate(templateId: number): Promise<void>
}
