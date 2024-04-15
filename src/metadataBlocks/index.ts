import { GetMetadataBlockByName } from './domain/useCases/GetMetadataBlockByName'
import { MetadataBlocksRepository } from './infra/repositories/MetadataBlocksRepository'
import { GetCollectionMetadataBlocks } from './domain/useCases/GetCollectionMetadataBlocks'

const metadataBlocksRepository = new MetadataBlocksRepository()

const getMetadataBlockByName = new GetMetadataBlockByName(metadataBlocksRepository)
const getCollectionMetadataBlocks = new GetCollectionMetadataBlocks(metadataBlocksRepository)

export { getMetadataBlockByName, getCollectionMetadataBlocks }
export {
  MetadataBlock,
  MetadataFieldInfo,
  MetadataFieldType,
  MetadataFieldTypeClass
} from './domain/models/MetadataBlock'
