import { NewDatasetDTO, NewDatasetMetadataBlockValuesDTO } from '../../dtos/NewDatasetDTO';
import { NewResourceValidator } from '../../../../core/domain/useCases/validators/NewResourceValidator';
import { MetadataBlock } from '../../../../metadataBlocks';
import { ResourceValidationError } from '../../../../core/domain/useCases/validators/errors/ResourceValidationError';
import { BaseMetadataFieldValidator } from './BaseMetadataFieldValidator';

export class NewDatasetValidator implements NewResourceValidator {
  constructor(private metadataFieldValidator: BaseMetadataFieldValidator) {}

  async validate(resource: NewDatasetDTO, metadataBlocks: MetadataBlock[]): Promise<void | ResourceValidationError> {
    for (const metadataBlockValues of resource.metadataBlockValues) {
      await this.validateMetadataBlock(metadataBlockValues, metadataBlocks);
    }
  }

  private async validateMetadataBlock(
    metadataBlockValues: NewDatasetMetadataBlockValuesDTO,
    metadataBlocks: MetadataBlock[],
  ) {
    const metadataBlockName = metadataBlockValues.name;
    const metadataBlock: MetadataBlock = metadataBlocks.find(
      (metadataBlock) => metadataBlock.name === metadataBlockName,
    );
    for (const metadataFieldKey of Object.keys(metadataBlock.metadataFields)) {
      this.metadataFieldValidator.validate({
        metadataFieldInfo: metadataBlock.metadataFields[metadataFieldKey],
        metadataFieldKey: metadataFieldKey,
        metadataFieldValue: metadataBlockValues.fields[metadataFieldKey],
        metadataBlockName: metadataBlockName,
      });
    }
  }
}
