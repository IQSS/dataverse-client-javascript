import {
  BaseMetadataFieldValidator,
  NewDatasetMetadataFieldAndValueInfo,
} from './BaseMetadataFieldValidator';
import { MultipleMetadataFieldValidator } from './MultipleMetadataFieldValidator';
import { SingleMetadataFieldValidator } from './SingleMetadataFieldValidator';
import { EmptyFieldError } from './errors/EmptyFieldError';
import { NewDatasetMetadataFieldValueDTO } from '../../dtos/NewDatasetDTO';

export class MetadataFieldValidator extends BaseMetadataFieldValidator {
  validate(newDatasetMetadataFieldAndValueInfo: NewDatasetMetadataFieldAndValueInfo): void {
    const metadataFieldValue = newDatasetMetadataFieldAndValueInfo.metadataFieldValue;
    const metadataFieldInfo = newDatasetMetadataFieldAndValueInfo.metadataFieldInfo;
    if (
      metadataFieldValue == undefined ||
      metadataFieldValue == null ||
      this.isEmptyString(metadataFieldValue) ||
      this.isEmptyArray(metadataFieldValue)
    ) {
      if (metadataFieldInfo.isRequired) {
        throw new EmptyFieldError(
          newDatasetMetadataFieldAndValueInfo.metadataFieldKey,
          newDatasetMetadataFieldAndValueInfo.metadataBlockName,
          newDatasetMetadataFieldAndValueInfo.metadataParentFieldKey,
          newDatasetMetadataFieldAndValueInfo.metadataFieldPosition,
        );
      } else {
        return;
      }
    }
    if (newDatasetMetadataFieldAndValueInfo.metadataFieldInfo.multiple) {
      this.executeMetadataFieldValidator(
        new MultipleMetadataFieldValidator(),
        newDatasetMetadataFieldAndValueInfo,
      );
    } else {
      this.executeMetadataFieldValidator(new SingleMetadataFieldValidator(), newDatasetMetadataFieldAndValueInfo);
    }
  }

  private isEmptyString(metadataFieldValue: NewDatasetMetadataFieldValueDTO): boolean {
    return typeof metadataFieldValue == 'string' && metadataFieldValue.trim() === '';
  }

  private isEmptyArray(metadataFieldValue: NewDatasetMetadataFieldValueDTO): boolean {
    return (
      Array.isArray(metadataFieldValue) && (metadataFieldValue as Array<NewDatasetMetadataFieldValueDTO>).length == 0
    );
  }
}
