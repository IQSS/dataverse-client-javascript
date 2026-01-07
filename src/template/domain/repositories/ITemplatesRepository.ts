import { CreateDatasetTemplateDTO } from '../dtos/CreateDatasetTemplateDTO'
import { DatasetTemplate } from '../models/DatasetTemplate'

export interface ITemplatesRepository {
  createDatasetTemplate(
    collectionIdOrAlias: number | string,
    template: CreateDatasetTemplateDTO
  ): Promise<void>
  getTemplate(templateId: number): Promise<DatasetTemplate>
  getDatasetTemplates(collectionIdOrAlias: number | string): Promise<DatasetTemplate[]>
  deleteTemplate(templateId: number): Promise<void>
}
