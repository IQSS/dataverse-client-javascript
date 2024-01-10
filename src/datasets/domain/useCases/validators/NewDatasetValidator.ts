import { NewDataset } from '../../models/NewDataset';
import { NewResourceValidator } from '../../../../core/domain/useCases/validators/NewResourceValidator';
import { IMetadataBlocksRepository } from '../../../../metadataBlocks/domain/repositories/IMetadataBlocksRepository';
import { MetadataBlock } from '../../../../metadataBlocks';
import { ResourceValidationError } from '../../../../core/domain/useCases/validators/errors/ResourceValidationError';

export class NewDatasetValidator implements NewResourceValidator<NewDataset> {
  private metadataBlockRepository: IMetadataBlocksRepository;

  constructor(metadataBlockRepository: IMetadataBlocksRepository) {
    this.metadataBlockRepository = metadataBlockRepository;
  }

  async validate(resource: NewDataset): Promise<void | ResourceValidationError> {
    console.log(resource);
    return await this.metadataBlockRepository
      .getMetadataBlockByName('citation')
      .then((citationMetadataBlock: MetadataBlock) => {
        console.log(citationMetadataBlock);
        // TODO apply validation based on citation metadata block info
        // missing field -> throw
      })
      .catch((error) => {
        throw new ResourceValidationError(error);
      });
  }
}
