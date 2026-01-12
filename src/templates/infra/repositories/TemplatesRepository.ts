import { AxiosResponse } from 'axios'
import { ApiRepository } from '../../../core/infra/repositories/ApiRepository'
import { CreateTemplateDTO } from '../../domain/dtos/CreateTemplateDTO'
import { Template } from '../../domain/models/Template'
import { ITemplatesRepository } from '../../domain/repositories/ITemplatesRepository'
import { TemplatePayload } from './transformers/TemplatePayload'
import {
  transformTemplatePayloadToTemplate,
  transformTemplatePayloadsToTemplates
} from './transformers/templateTransformers'

export class TemplatesRepository extends ApiRepository implements ITemplatesRepository {
  private readonly collectionsResourceName: string = 'dataverses'

  public async createDatasetTemplate(
    collectionIdOrAlias: number | string,
    template: CreateTemplateDTO
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

  public async getTemplate(templateId: number): Promise<Template> {
    return this.doGet(`/dataverses/${templateId}/template`, true)
      .then((response: AxiosResponse<{ data: TemplatePayload }>) =>
        transformTemplatePayloadToTemplate(response.data.data)
      )
      .catch((error) => {
        throw error
      })
  }

  public async getTemplatesByCollectionId(
    collectionIdOrAlias: number | string
  ): Promise<Template[]> {
    return this.doGet(`/${this.collectionsResourceName}/${collectionIdOrAlias}/templates`, true)
      .then((response: AxiosResponse<{ data: TemplatePayload[] }>) =>
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
