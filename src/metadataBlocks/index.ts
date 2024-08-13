import { GetMetadataBlockByName } from './domain/useCases/GetMetadataBlockByName'
import { MetadataBlocksRepository } from './infra/repositories/MetadataBlocksRepository'
import { GetCollectionMetadataBlocks } from './domain/useCases/GetCollectionMetadataBlocks'
import { GetAllFacetableMetadataFields } from './domain/useCases/GetAllFacetableMetadataFields'
import { MetadataFieldInfosRepository } from './infra/repositories/MetadataFieldInfosRepository'
import { GetAllMetadataBlocks } from './domain/useCases/GetAllMetadataBlocks'

const metadataBlocksRepository = new MetadataBlocksRepository()
const metadataFieldInfosRepository = new MetadataFieldInfosRepository()

const getMetadataBlockByName = new GetMetadataBlockByName(metadataBlocksRepository)
const getCollectionMetadataBlocks = new GetCollectionMetadataBlocks(metadataBlocksRepository)
const getAllFacetableMetadataFields = new GetAllFacetableMetadataFields(
  metadataFieldInfosRepository
)
const getAllMetadataBlocks = new GetAllMetadataBlocks(metadataBlocksRepository)

export {
  getMetadataBlockByName,
  getCollectionMetadataBlocks,
  getAllFacetableMetadataFields,
  getAllMetadataBlocks
}

export {
  MetadataBlock,
  MetadataFieldInfo,
  MetadataFieldType,
  MetadataFieldTypeClass
} from './domain/models/MetadataBlock'
