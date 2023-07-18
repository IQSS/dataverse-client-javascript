import { ApiRepository } from '../../../core/infra/repositories/ApiRepository';
import { IMetadataBlocksRepository } from '../../domain/repositories/IMetadataBlocksRepository';
import { MetadataBlock } from '../../domain/models/MetadataBlock';
import { transformMetadataBlockResponseToMetadataBlock } from './transformers/metadataBlockTransformers';

export class MetadataBlocksRepository extends ApiRepository implements IMetadataBlocksRepository {
  public async getMetadataBlockByName(metadataBlockName: string): Promise<MetadataBlock> {
    return this.doGet(`/metadatablocks/${metadataBlockName}`)
      .then((response) => transformMetadataBlockResponseToMetadataBlock(response))
      .catch((error) => {
        throw error;
      });
  }
}
