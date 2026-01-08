import { CreateDatasetTemplateDTO } from '../dtos/CreateDatasetTemplateDTO'
import { Template } from '../models/Template'

export interface ITemplatesRepository {
  createDatasetTemplate(
    collectionIdOrAlias: number | string,
    template: CreateDatasetTemplateDTO
  ): Promise<void>
  getTemplate(templateId: number): Promise<Template>
  getDatasetTemplates(collectionIdOrAlias: number | string): Promise<Template[]>
  deleteTemplate(templateId: number): Promise<void>
}
