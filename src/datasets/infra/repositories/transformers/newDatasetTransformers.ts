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
  datasetVersion: {
    license?: DatasetLicense;
    metadataBlocks: Record<string, MetadataBlockRequestPayload>;
  };
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
    datasetVersion: {
      ...(newDataset.license && { license: newDataset.license }),
      metadataBlocks: transformMetadataBlockModelsToRequestPayload(newDataset.metadataBlockValues, metadataBlocks),
    },
  };
};

export const transformMetadataBlockModelsToRequestPayload = (
  newDatasetMetadataBlocksValues: NewDatasetMetadataBlockValues[],
  metadataBlocks: MetadataBlock[],
): Record<string, MetadataBlockRequestPayload> => {
  let metadataBlocksRequestPayload: Record<string, MetadataBlockRequestPayload> = {};
  newDatasetMetadataBlocksValues.forEach(function (newDatasetMetadataBlockValues: NewDatasetMetadataBlockValues) {
    const metadataBlock: MetadataBlock = metadataBlocks.find(
      (metadataBlock) => metadataBlock.name == newDatasetMetadataBlockValues.name,
    );
    metadataBlocksRequestPayload[newDatasetMetadataBlockValues.name] = {
      fields: transformMetadataFieldModelsToRequestPayload(
        newDatasetMetadataBlockValues.fields,
        metadataBlock.metadataFields,
      ),
      displayName: metadataBlock.displayName,
    };
  });
  return metadataBlocksRequestPayload;
};

export const transformMetadataFieldModelsToRequestPayload = (
  newDatasetMetadataFields: NewDatasetMetadataFields,
  metadataBlockFields: Record<string, MetadataFieldInfo>,
): MetadataFieldRequestPayload[] => {
  let metadataFieldsRequestPayload: MetadataFieldRequestPayload[] = [];
  for (const metadataFieldKey of Object.keys(newDatasetMetadataFields)) {
    const newDatasetMetadataChildFieldValue: NewDatasetMetadataFieldValue = newDatasetMetadataFields[metadataFieldKey];
    metadataFieldsRequestPayload.push({
      value: transformMetadataFieldValueToRequestPayload(
        newDatasetMetadataChildFieldValue,
        metadataBlockFields[metadataFieldKey],
      ),
      typeClass: metadataBlockFields[metadataFieldKey].typeClass,
      multiple: metadataBlockFields[metadataFieldKey].multiple,
      typeName: metadataFieldKey,
    });
  }
  return metadataFieldsRequestPayload;
};

export const transformMetadataFieldValueToRequestPayload = (
  newDatasetMetadataFieldValue: NewDatasetMetadataFieldValue,
  metadataBlockFieldInfo: MetadataFieldInfo,
): MetadataFieldValueRequestPayload => {
  let value: MetadataFieldValueRequestPayload;
  if (metadataBlockFieldInfo.multiple) {
    const newDatasetMetadataChildFieldValues = newDatasetMetadataFieldValue as
      | string[]
      | NewDatasetMetadataChildFieldValue[];
    if (typeof newDatasetMetadataChildFieldValues[0] == 'string') {
      value = newDatasetMetadataFieldValue as string[];
    } else {
      value = [];
      (newDatasetMetadataChildFieldValues as NewDatasetMetadataChildFieldValue[]).forEach(function (
        childMetadataFieldValue: NewDatasetMetadataChildFieldValue,
      ) {
        (value as Record<string, MetadataFieldRequestPayload>[]).push(
          transformMetadataChildFieldValueToRequestPayload(childMetadataFieldValue, metadataBlockFieldInfo),
        );
      });
    }
  } else {
    if (typeof newDatasetMetadataFieldValue == 'string') {
      value = newDatasetMetadataFieldValue;
    } else {
      value = transformMetadataChildFieldValueToRequestPayload(
        newDatasetMetadataFieldValue as NewDatasetMetadataChildFieldValue,
        metadataBlockFieldInfo,
      );
    }
  }
  return value;
};

export const transformMetadataChildFieldValueToRequestPayload = (
  newDatasetMetadataChildFieldValue: NewDatasetMetadataChildFieldValue,
  metadataBlockFieldInfo: MetadataFieldInfo,
): Record<string, MetadataFieldRequestPayload> => {
  let metadataChildFieldRequestPayload: Record<string, MetadataFieldRequestPayload> = {};
  for (const metadataChildFieldKey of Object.keys(newDatasetMetadataChildFieldValue)) {
    const childMetadataFieldInfo: MetadataFieldInfo = metadataBlockFieldInfo.childMetadataFields[metadataChildFieldKey];
    const value: string = newDatasetMetadataChildFieldValue[metadataChildFieldKey] as unknown as string;
    metadataChildFieldRequestPayload[metadataChildFieldKey] = {
      value: value,
      typeClass: childMetadataFieldInfo.typeClass,
      multiple: childMetadataFieldInfo.multiple,
      typeName: metadataChildFieldKey,
    };
  }

  return metadataChildFieldRequestPayload;
};
