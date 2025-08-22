import { IExternalToolsRepository } from '../domain/repositories/IExternalToolsRepository'
import { ApiRepository } from '../../core/infra/repositories/ApiRepository'
import {
  DatasetExternalToolUrl,
  ExternalTool,
  FileExternalToolUrl
} from '../domain/models/ExternalTool'
import { GetExternalToolDTO } from '../domain/dtos/GetExternalToolDTO'
import { datasetExternalToolTransformer } from './transformers/datasetExternalToolTransformer'
import { fileExternalToolTransformer } from './transformers/fileExternalToolTransformer'
import { externalToolsTransformer } from './transformers/externalToolsTransformer'

export class ExternalToolsRepository extends ApiRepository implements IExternalToolsRepository {
  private readonly externalToolsResourceName: string = 'externalTools'

  public async getExternalTools(): Promise<ExternalTool[]> {
    return this.doGet(this.buildApiEndpoint(this.externalToolsResourceName))
      .then((response) => externalToolsTransformer(response))
      .catch((error) => {
        throw error
      })
  }

  public async getDatasetExternalToolUrl(
    datasetId: number | string,
    toolId: number,
    getExternalToolDTO: GetExternalToolDTO
  ): Promise<DatasetExternalToolUrl> {
    return this.doPost(
      this.buildApiEndpoint('datasets', `externalTool/${toolId}/toolUrl`, datasetId),
      getExternalToolDTO
    )
      .then((response) => datasetExternalToolTransformer(response))
      .catch((error) => {
        throw error
      })
  }

  public async getFileExternalToolUrl(
    fileId: number | string,
    toolId: number,
    getExternalToolDTO: GetExternalToolDTO
  ): Promise<FileExternalToolUrl> {
    return this.doPost(
      this.buildApiEndpoint('files', `externalTool/${toolId}/toolUrl`, fileId),
      getExternalToolDTO
    )
      .then((response) => fileExternalToolTransformer(response))
      .catch((error) => {
        throw error
      })
  }
}
