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
  metadataBlockValuesModels: NewDatasetMetadataBlockValues[],
  metadataBlocks: MetadataBlock[],
): Record<string, MetadataBlockRequestPayload> => {
  let metadataBlocksRequestPayload: Record<string, MetadataBlockRequestPayload> = {};
  metadataBlockValuesModels.forEach(function (metadataBlockValuesModel: NewDatasetMetadataBlockValues) {
    const metadataBlock: MetadataBlock = metadataBlocks.find(
      (metadataBlock) => metadataBlock.name == metadataBlockValuesModel.name,
    );
    metadataBlocksRequestPayload[metadataBlockValuesModel.name] = {
      fields: transformMetadataFieldModelsToRequestPayload(
        metadataBlockValuesModel.fields,
        metadataBlock.metadataFields,
      ),
      displayName: metadataBlock.displayName,
    };
  });
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
    if (typeof metadataFieldValue[0] == 'string') {
      value = metadataFieldValue as string[];
    } else {
      let value: Record<string, MetadataFieldRequestPayload>[] = [];
      metadataFieldValue.forEach(function (metadataFieldValue: NewDatasetMetadataFieldValue) {
        value.push(
          transformMetadataChildFieldValueToRequestPayload(
            metadataFieldValue as NewDatasetMetadataChildFieldValue,
            metadataFieldInfo,
          ),
        );
      });
    }
  } else if (typeof metadataFieldValue == 'string') {
    value = metadataFieldValue;
  } else {
    value = transformMetadataChildFieldValueToRequestPayload(metadataFieldValue, metadataFieldInfo);
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
