import {
  NewDataset,
  NewDatasetMetadataBlockValues,
  NewDatasetMetadataFields,
  NewDatasetMetadataFieldValue,
  NewDatasetMetadataChildFieldValue,
} from '../../../domain/models/NewDataset';
import { DatasetLicense } from '../../../domain/models/Dataset';
import { MetadataBlock, MetadataFieldInfo } from '../../../../metadataBlocks';

export interface NewDatasetRequestPayload {
  license?: DatasetLicense;
  metadataBlocks: Record<string, MetadataBlockRequestPayload>;
}

export interface MetadataBlockRequestPayload {
  fields: MetadataFieldRequestPayload[];
  displayName: string;
}

export interface MetadataFieldRequestPayload {
  value: MetadataFieldValueRequestPayload;
  typeClass: string;
  multiple: boolean;
  typeName: string;
}

export type MetadataFieldValueRequestPayload =
  | string
  | string[]
  | Record<string, MetadataFieldRequestPayload>
  | Record<string, MetadataFieldRequestPayload>[];

export const transformNewDatasetModelToRequestPayload = (
  newDataset: NewDataset,
  metadataBlocks: MetadataBlock[],
): NewDatasetRequestPayload => {
  return {
    license: newDataset.license,
    metadataBlocks: transformMetadataBlockModelsToRequestPayload(newDataset.metadataBlockValues, metadataBlocks),
  };
};

export const transformMetadataBlockModelsToRequestPayload = (
  metadataBlockValuesModels: NewDatasetMetadataBlockValues[],
  metadataBlocks: MetadataBlock[],
): Record<string, MetadataBlockRequestPayload> => {
  let metadataBlocksRequestPayload: Record<string, MetadataBlockRequestPayload> = {};
  for (const item in metadataBlockValuesModels) {
    const metadataBlockValuesModel: NewDatasetMetadataBlockValues = item as unknown as NewDatasetMetadataBlockValues;
    const metadataBlock: MetadataBlock = metadataBlocks.find(
      (metadataBlock) => metadataBlock.name === (item as unknown as NewDatasetMetadataBlockValues).name,
    );
    metadataBlocksRequestPayload[metadataBlockValuesModel.name] = {
      displayName: metadataBlock.displayName,
      fields: transformMetadataFieldModelsToRequestPayload(
        metadataBlockValuesModel.fields,
        metadataBlock.metadataFields,
      ),
    };
  }
  return metadataBlocksRequestPayload;
};

export const transformMetadataFieldModelsToRequestPayload = (
  metadataFieldsModel: NewDatasetMetadataFields,
  metadataFields: Record<string, MetadataFieldInfo>,
): MetadataFieldRequestPayload[] => {
  let metadataFieldsRequestPayload: MetadataFieldRequestPayload[] = [];
  for (const metadataFieldKey of Object.keys(metadataFieldsModel)) {
    const metadataFieldValue: NewDatasetMetadataFieldValue = metadataFieldsModel[metadataFieldKey];
    metadataFieldsRequestPayload.push(
      transformMetadataFieldValueToRequestPayload(
        metadataFieldValue,
        metadataFieldKey,
        metadataFields[metadataFieldKey],
      ),
    );
  }
  return metadataFieldsRequestPayload;
};

export const transformMetadataFieldValueToRequestPayload = (
  metadataFieldValue: NewDatasetMetadataFieldValue,
  metadataFieldKey: string,
  metadataFieldInfo: MetadataFieldInfo,
): MetadataFieldRequestPayload => {
  let value: MetadataFieldValueRequestPayload;
  if (Array.isArray(metadataFieldValue)) {
    if (metadataFieldValue.every((item: unknown) => typeof item === 'string')) {
      value = metadataFieldValue as string[];
    } else {
      let value: Record<string, MetadataFieldRequestPayload>[] = [];
      for (const item in metadataFieldValue as NewDatasetMetadataChildFieldValue[]) {
        value.push(
          transformMetadataChildFieldValueToRequestPayload(
            item as unknown as NewDatasetMetadataChildFieldValue,
            metadataFieldInfo,
          ),
        );
      }
    }
  } else if (typeof metadataFieldValue == 'string') {
    value = metadataFieldValue;
  } else {
    value = transformMetadataChildFieldValueToRequestPayload(
      metadataFieldValue as unknown as NewDatasetMetadataChildFieldValue,
      metadataFieldInfo,
    );
  }
  return {
    value: value,
    typeClass: metadataFieldInfo.typeClass,
    multiple: metadataFieldInfo.multiple,
    typeName: metadataFieldKey,
  };
};

export const transformMetadataChildFieldValueToRequestPayload = (
  metadataFieldValue: NewDatasetMetadataChildFieldValue,
  metadataFieldInfo: MetadataFieldInfo,
): Record<string, MetadataFieldRequestPayload> => {
  let metadataChildFieldRequestPayload: Record<string, MetadataFieldRequestPayload> = {};
  for (const metadataChildFieldKey of Object.keys(metadataFieldValue)) {
    const childMetadataFieldInfo: MetadataFieldInfo = metadataFieldInfo.childMetadataFields[metadataChildFieldKey];
    const value: string = metadataFieldValue[metadataChildFieldKey] as unknown as string;
    metadataChildFieldRequestPayload[metadataChildFieldKey] = {
      value: value,
      typeClass: childMetadataFieldInfo.typeClass,
      multiple: childMetadataFieldInfo.multiple,
      typeName: metadataChildFieldKey,
    };
  }
  return metadataChildFieldRequestPayload;
};
