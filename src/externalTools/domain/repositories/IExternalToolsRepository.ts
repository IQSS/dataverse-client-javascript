import { GetExternalToolDTO } from '../dtos/GetExternalToolDTO'
import { DatasetExternalToolUrl, ExternalTool, FileExternalToolUrl } from '../models/ExternalTool'

export interface IExternalToolsRepository {
  getExternalTools(): Promise<ExternalTool[]>
  getDatasetExternalToolUrl(
    datasetId: number | string,
    toolId: number,
    getExternalToolDTO: GetExternalToolDTO
  ): Promise<DatasetExternalToolUrl>
  getFileExternalToolUrl(
    fileId: number | string,
    toolId: number,
    getExternalToolDTO: GetExternalToolDTO
  ): Promise<FileExternalToolUrl>
}
