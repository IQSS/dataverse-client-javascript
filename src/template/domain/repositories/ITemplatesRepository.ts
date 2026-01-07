import { CreateDatasetTemplateDTO } from '../dtos/CreateDatasetTemplateDTO'
import { DatasetTemplate } from '../models/DatasetTemplate'

export interface ITemplatesRepository {
  createDatasetTemplate(
    collectionIdOrAlias: number | string,
    template: CreateDatasetTemplateDTO
  ): Promise<void>
  getDatasetTemplates(collectionIdOrAlias: number | string): Promise<DatasetTemplate[]>
}
