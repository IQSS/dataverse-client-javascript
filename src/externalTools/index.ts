import { GetDatasetExternalToolUrl } from './domain/useCases/GetDatasetExternalToolUrl'
import { GetExternalTools } from './domain/useCases/GetExternalTools'
import { GetFileExternalToolUrl } from './domain/useCases/GetFileExternalToolUrl'
import { ExternalToolsRepository } from './infra/ExternalToolsRepository'

const externalToolsRepository = new ExternalToolsRepository()

const getExternalTools = new GetExternalTools(externalToolsRepository)
const getDatasetExternalToolUrl = new GetDatasetExternalToolUrl(externalToolsRepository)
const getFileExternalToolUrl = new GetFileExternalToolUrl(externalToolsRepository)

export {
  getExternalTools,
  getDatasetExternalToolUrl,
  getFileExternalToolUrl,
  externalToolsRepository
}

export {
  ExternalTool,
  ToolScope,
  ToolType,
  DatasetExternalToolUrl,
  FileExternalToolUrl
} from './domain/models/ExternalTool'
