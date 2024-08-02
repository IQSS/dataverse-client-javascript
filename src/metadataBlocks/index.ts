import { GetMetadataBlockByName } from './domain/useCases/GetMetadataBlockByName'
import { MetadataBlocksRepository } from './infra/repositories/MetadataBlocksRepository'
import { GetCollectionMetadataBlocks } from './domain/useCases/GetCollectionMetadataBlocks'
import { GetAllMetadataBlocks } from './domain/useCases/GetAllMetadataBlocks'

const metadataBlocksRepository = new MetadataBlocksRepository()

const getMetadataBlockByName = new GetMetadataBlockByName(metadataBlocksRepository)
const getCollectionMetadataBlocks = new GetCollectionMetadataBlocks(metadataBlocksRepository)
const getAllMetadataBlocks = new GetAllMetadataBlocks(metadataBlocksRepository)

export { getMetadataBlockByName, getCollectionMetadataBlocks, getAllMetadataBlocks }
export {
  MetadataBlock,
  MetadataFieldInfo,
  MetadataFieldType,
  MetadataFieldTypeClass
} from './domain/models/MetadataBlock'
