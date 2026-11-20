import { DatasetDTO, DatasetMetadataBlockValuesDTO } from '../../dtos/DatasetDTO'
import { ResourceValidator } from '../../../../core/domain/useCases/validators/ResourceValidator'
import { MetadataBlock } from '../../../../metadataBlocks'
import { BaseMetadataFieldValidator } from './BaseMetadataFieldValidator'

export class DatasetResourceValidator implements ResourceValidator {
  constructor(
    private metadataFieldValidator: BaseMetadataFieldValidator,
    private onlyValidateProvidedFields = false
  ) {}

  public validate(resource: DatasetDTO, metadataBlocks: MetadataBlock[]) {
    for (const metadataBlockValues of resource.metadataBlockValues) {
      this.validateMetadataBlock(metadataBlockValues, metadataBlocks)
    }
  }

  private validateMetadataBlock(
    metadataBlockValues: DatasetMetadataBlockValuesDTO,
    metadataBlocks: MetadataBlock[]
  ) {
    const metadataBlockName = metadataBlockValues.name
    const metadataBlock = metadataBlocks.find(
      (metadataBlock) => metadataBlock.name === metadataBlockName
    ) as MetadataBlock

    for (const metadataFieldKey of Object.keys(metadataBlock.metadataFields)) {
      if (
        this.onlyValidateProvidedFields &&
        !Object.prototype.hasOwnProperty.call(metadataBlockValues.fields, metadataFieldKey)
      ) {
        continue
      }
      this.metadataFieldValidator.validate({
        metadataFieldInfo: metadataBlock.metadataFields[metadataFieldKey],
        metadataFieldKey: metadataFieldKey,
        metadataFieldValue: metadataBlockValues.fields[metadataFieldKey],
        metadataBlockName: metadataBlockName
      })
    }
  }
}
