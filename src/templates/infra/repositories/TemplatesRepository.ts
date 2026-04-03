import { AxiosResponse } from 'axios'
import { ApiRepository } from '../../../core/infra/repositories/ApiRepository'
import { TermsOfAccess } from '../../../datasets/domain/models/Dataset'
import { CreateTemplateDTO } from '../../domain/dtos/CreateTemplateDTO'
import { UpdateTemplateLicenseTermsDTO } from '../../domain/dtos/UpdateTemplateLicenseTermsDTO'
import { UpdateTemplateMetadataDTO } from '../../domain/dtos/UpdateTemplateMetadataDTO'
import { Template } from '../../domain/models/Template'
import { ITemplatesRepository } from '../../domain/repositories/ITemplatesRepository'
import { TemplatePayload } from './transformers/TemplatePayload'
import { transformTemplateTermsOfAccessToUpdatePayload } from './transformers/templateTermsOfAccessTransformers'
import {
  transformTemplatePayloadToTemplate,
  transformTemplatePayloadsToTemplates
} from './transformers/templateTransformers'

export class TemplatesRepository extends ApiRepository implements ITemplatesRepository {
  private readonly collectionsResourceName: string = 'dataverses'

  public async createTemplate(
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

  public async updateTemplateMetadata(
    templateId: number,
    payload: UpdateTemplateMetadataDTO,
    replace = false
  ): Promise<void> {
    return this.updateTemplate(templateId, 'metadata', payload, { replace })
  }

  public async updateTemplateLicenseTerms(
    templateId: number,
    payload: UpdateTemplateLicenseTermsDTO
  ): Promise<void> {
    return this.updateTemplate(templateId, 'licenseTerms', payload)
  }

  public async updateTemplateTermsOfAccess(
    templateId: number,
    termsOfAccess: TermsOfAccess
  ): Promise<void> {
    return this.updateTemplate(
      templateId,
      'access',
      transformTemplateTermsOfAccessToUpdatePayload(termsOfAccess)
    )
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

  private async updateTemplate(
    templateId: number,
    operation: 'metadata' | 'licenseTerms' | 'access',
    payload: object,
    queryParams: object = {}
  ): Promise<void> {
    return this.doPut(`/dataverses/${templateId}/${operation}`, payload, queryParams)
      .then(() => undefined)
      .catch((error) => {
        throw error
      })
  }

  public async setTemplateAsDefault(
    collectionIdOrAlias: number | string,
    templateId: number
  ): Promise<void> {
    return this.doPost(
      `/${this.collectionsResourceName}/${collectionIdOrAlias}/template/default/${templateId}`,
      {}
    )
      .then(() => undefined)
      .catch((error) => {
        throw error
      })
  }

  public async unsetTemplateAsDefault(collectionIdOrAlias: number | string): Promise<void> {
    return this.doDelete(`/${this.collectionsResourceName}/${collectionIdOrAlias}/template/default`)
      .then(() => undefined)
      .catch((error) => {
        throw error
      })
  }
}
