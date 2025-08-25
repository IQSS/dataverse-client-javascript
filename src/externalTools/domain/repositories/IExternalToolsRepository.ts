import { GetExternalToolDTO } from '../dtos/GetExternalToolDTO'
import {
  DatasetExternalToolResolved,
  ExternalTool,
  FileExternalToolResolved
} from '../models/ExternalTool'

export interface IExternalToolsRepository {
  getExternalTools(): Promise<ExternalTool[]>
  getDatasetExternalToolResolved(
    datasetId: number | string,
    toolId: number,
    getExternalToolDTO: GetExternalToolDTO
  ): Promise<DatasetExternalToolResolved>
  getFileExternalToolResolved(
    fileId: number | string,
    toolId: number,
    getExternalToolDTO: GetExternalToolDTO
  ): Promise<FileExternalToolResolved>
}
