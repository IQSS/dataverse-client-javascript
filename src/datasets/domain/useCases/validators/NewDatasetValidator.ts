import { NewDataset, NewDatasetMetadataFieldValue } from '../../models/NewDataset';
import { NewResourceValidator } from '../../../../core/domain/useCases/validators/NewResourceValidator';
import { IMetadataBlocksRepository } from '../../../../metadataBlocks/domain/repositories/IMetadataBlocksRepository';
import { MetadataBlock, MetadataFieldInfo } from '../../../../metadataBlocks';
import { ResourceValidationError } from '../../../../core/domain/useCases/validators/errors/ResourceValidationError';
import { WriteError } from '../../../../core';
import { EmptyFieldError } from '../../../../core/domain/useCases/validators/errors/EmptyFieldError';

export class NewDatasetValidator implements NewResourceValidator<NewDataset> {
  private metadataBlockRepository: IMetadataBlocksRepository;

  constructor(metadataBlockRepository: IMetadataBlocksRepository) {
    this.metadataBlockRepository = metadataBlockRepository;
  }

  async validate(resource: NewDataset): Promise<void | ResourceValidationError> {
    for (const metadataBlockValues of resource.metadataBlockValues) {
      const newDatasetMetadataBlockName = metadataBlockValues.name;
      await this.metadataBlockRepository
        .getMetadataBlockByName(newDatasetMetadataBlockName)
        .then((metadataBlock: MetadataBlock) => {
          Object.keys(metadataBlock.metadataFields).map((metadataFieldKey) => {
            const metadataFieldInfo: MetadataFieldInfo = metadataBlock.metadataFields[metadataFieldKey];
            const newDatasetMetadataFieldValue: NewDatasetMetadataFieldValue =
              metadataBlockValues.fields[metadataFieldKey];
            if (metadataFieldInfo.isRequired && newDatasetMetadataFieldValue == undefined) {
              throw new EmptyFieldError(metadataFieldKey, newDatasetMetadataBlockName);
            }
            if (metadataFieldInfo.childMetadataFields != undefined) {
              // TODO: child fields validation
            }
          });
        })
        .catch((error: WriteError) => {
          throw new ResourceValidationError(error.message);
        });
    }
  }
}
