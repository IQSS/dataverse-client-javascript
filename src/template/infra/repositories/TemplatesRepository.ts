import { AxiosResponse } from 'axios'
import { ApiRepository } from '../../../core/infra/repositories/ApiRepository'
import { CreateDatasetTemplateDTO } from '../../domain/dtos/CreateDatasetTemplateDTO'
import { DatasetTemplate } from '../../domain/models/DatasetTemplate'
import { ITemplatesRepository } from '../../domain/repositories/ITemplatesRepository'
import { DatasetTemplatePayload } from './transformers/DatasetTemplatePayload'
import {
  transformTemplatePayloadToTemplate,
  transformTemplatePayloadsToTemplates
} from './transformers/datasetTemplateTransformers'

export class TemplatesRepository extends ApiRepository implements ITemplatesRepository {
  private readonly collectionsResourceName: string = 'dataverses'

  public async createDatasetTemplate(
    collectionIdOrAlias: number | string,
    template: CreateDatasetTemplateDTO
  ): Promise<void> {
    return this.doPost(
      `/${this.collectionsResourceName}/${collectionIdOrAlias}/templates`,
      template
    )
      .then(() => undefined)
      .catch((error) => {
        throw error
      })
  }

  public async getTemplate(templateId: number): Promise<DatasetTemplate> {
    return this.doGet(`/dataverses/${templateId}/template`, true)
      .then((response: AxiosResponse<{ data: DatasetTemplatePayload }>) =>
        transformTemplatePayloadToTemplate(response.data.data)
      )
      .catch((error) => {
        throw error
      })
  }

  public async getDatasetTemplates(
    collectionIdOrAlias: number | string
  ): Promise<DatasetTemplate[]> {
    return this.doGet(`/${this.collectionsResourceName}/${collectionIdOrAlias}/templates`, true)
      .then((response: AxiosResponse<{ data: DatasetTemplatePayload[] }>) =>
        transformTemplatePayloadsToTemplates(response.data.data)
      )
      .catch((error) => {
        throw error
      })
  }

  public async deleteTemplate(templateId: number): Promise<void> {
    return this.doDelete(`/dataverses/${templateId}/template`)
      .then(() => undefined)
      .catch((error) => {
        throw error
      })
  }
}
