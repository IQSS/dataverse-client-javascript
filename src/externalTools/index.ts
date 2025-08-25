import { GetDatasetExternalToolResolved } from './domain/useCases/GetDatasetExternalToolResolved'
import { GetExternalTools } from './domain/useCases/GetExternalTools'
import { GetFileExternalToolResolved } from './domain/useCases/GetFileExternalToolResolved'
import { ExternalToolsRepository } from './infra/ExternalToolsRepository'

const externalToolsRepository = new ExternalToolsRepository()

const getExternalTools = new GetExternalTools(externalToolsRepository)
const getDatasetExternalToolResolved = new GetDatasetExternalToolResolved(externalToolsRepository)
const getFileExternalToolResolved = new GetFileExternalToolResolved(externalToolsRepository)

export {
  getExternalTools,
  getDatasetExternalToolResolved,
  getFileExternalToolResolved,
  externalToolsRepository
}

export {
  ExternalTool,
  ToolScope,
  ToolType,
  DatasetExternalToolResolved,
  FileExternalToolResolved
} from './domain/models/ExternalTool'
