import { AxiosResponse } from 'axios'
import { ApiRepository } from '../../../core/infra/repositories/ApiRepository'
import { ExternalVocabularyConfig } from '../../domain/models/ExternalVocabularyConfig'
import { ExternalVocabularyTerm } from '../../domain/models/ExternalVocabularyTerm'
import { IExternalVocabulariesRepository } from '../../domain/repositories/IExternalVocabulariesRepository'

export class ExternalVocabulariesRepository
  extends ApiRepository
  implements IExternalVocabulariesRepository
{
  private readonly externalVocabulariesResourceName: string = 'external-vocabularies'

  public async getConfiguredExternalVocabularies(): Promise<ExternalVocabularyConfig[]> {
    return this.doGet(this.buildApiEndpoint(this.externalVocabulariesResourceName))
      .then((response: AxiosResponse<{ data: ExternalVocabularyConfig[] }>) => response.data.data)
      .catch((error) => {
        throw error
      })
  }

  public async getExternalVocabularyConfig(fieldName: string): Promise<ExternalVocabularyConfig> {
    return this.doGet(this.buildApiEndpoint(this.externalVocabulariesResourceName, fieldName))
      .then((response: AxiosResponse<{ data: ExternalVocabularyConfig }>) => response.data.data)
      .catch((error) => {
        throw error
      })
  }

  public async searchExternalVocabularyTerms(
    fieldName: string,
    query: string,
    vocabulary?: string,
    language?: string
  ): Promise<ExternalVocabularyTerm[]> {
    return this.doGet(
      this.buildApiEndpoint(this.externalVocabulariesResourceName, `${fieldName}/search`),
      false,
      {
        q: query,
        ...(vocabulary ? { vocabulary } : {}),
        ...(language ? { language } : {})
      }
    )
      .then((response: AxiosResponse<{ data: ExternalVocabularyTerm[] }>) => response.data.data)
      .catch((error) => {
        throw error
      })
  }

  public async resolveExternalVocabularyTerm(
    fieldName: string,
    uri: string,
    language?: string
  ): Promise<ExternalVocabularyTerm | null> {
    return this.doGet(
      this.buildApiEndpoint(this.externalVocabulariesResourceName, `${fieldName}/resolve`),
      false,
      {
        uri,
        ...(language ? { language } : {})
      }
    )
      .then((response: AxiosResponse<{ data: ExternalVocabularyTerm }>) => response.data.data)
      .catch((error) => {
        throw error
      })
  }

  public async validateExternalVocabularyValue(fieldName: string, value: string): Promise<boolean> {
    return this.doGet(
      this.buildApiEndpoint(this.externalVocabulariesResourceName, `${fieldName}/validate`),
      false,
      {
        value
      }
    )
      .then((response: AxiosResponse<{ data: { valid: boolean } }>) => response.data.data.valid)
      .catch((error) => {
        throw error
      })
  }
}
