import { GetMetadataBlockByName } from './domain/useCases/GetMetadataBlockByName'
import { MetadataBlocksRepository } from './infra/repositories/MetadataBlocksRepository'
import { GetCollectionMetadataBlocks } from './domain/useCases/GetCollectionMetadataBlocks'
import { GetAllFacetableDatasetFields } from './domain/useCases/GetAllFacetableDatasetFields'
import { MetadataFieldInfosRepository } from './infra/repositories/MetadataFieldInfosRepository'

const metadataBlocksRepository = new MetadataBlocksRepository()
const metadataFieldInfosRepository = new MetadataFieldInfosRepository()

const getMetadataBlockByName = new GetMetadataBlockByName(metadataBlocksRepository)
const getCollectionMetadataBlocks = new GetCollectionMetadataBlocks(metadataBlocksRepository)
const getAllFacetableDatasetFields = new GetAllFacetableDatasetFields(metadataFieldInfosRepository)

export { getMetadataBlockByName, getCollectionMetadataBlocks, getAllFacetableDatasetFields }
export {
  MetadataBlock,
  MetadataFieldInfo,
  MetadataFieldType,
  MetadataFieldTypeClass
} from './domain/models/MetadataBlock'
