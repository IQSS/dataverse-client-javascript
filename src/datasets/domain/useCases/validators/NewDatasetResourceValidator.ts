import { NewDatasetDTO, NewDatasetMetadataBlockValuesDTO } from '../../dtos/NewDatasetDTO'
import { NewResourceValidator } from '../../../../core/domain/useCases/validators/NewResourceValidator'
import { MetadataBlock } from '../../../../metadataBlocks'
import { BaseMetadataFieldValidator } from './BaseMetadataFieldValidator'

export class NewDatasetResourceValidator implements NewResourceValidator {
  constructor(private metadataFieldValidator: BaseMetadataFieldValidator) {}

  public validate(resource: NewDatasetDTO, metadataBlocks: MetadataBlock[]) {
    for (const metadataBlockValues of resource.metadataBlockValues) {
      this.validateMetadataBlock(metadataBlockValues, metadataBlocks)
    }
  }

  private validateMetadataBlock(
    metadataBlockValues: NewDatasetMetadataBlockValuesDTO,
    metadataBlocks: MetadataBlock[]
  ) {
    const metadataBlockName = metadataBlockValues.name
    const metadataBlock: MetadataBlock = metadataBlocks.find(
      (metadataBlock) => metadataBlock.name === metadataBlockName
    )
    for (const metadataFieldKey of Object.keys(metadataBlock.metadataFields)) {
      this.metadataFieldValidator.validate({
        metadataFieldInfo: metadataBlock.metadataFields[metadataFieldKey],
        metadataFieldKey: metadataFieldKey,
        metadataFieldValue: metadataBlockValues.fields[metadataFieldKey],
        metadataBlockName: metadataBlockName
      })
    }
  }
}
