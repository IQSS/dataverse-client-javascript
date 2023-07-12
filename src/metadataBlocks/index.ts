import { GetMetadataBlockByName } from './domain/useCases/GetMetadataBlockByName';
import { MetadataBlocksRepository } from './infra/repositories/MetadataBlocksRepository';

const metadataBlocksRepository = new MetadataBlocksRepository();

const getMetadataBlockByName = new GetMetadataBlockByName(metadataBlocksRepository);

export { getMetadataBlockByName };
export { MetadataBlock, MetadataFieldInfo } from './domain/models/MetadataBlock';
