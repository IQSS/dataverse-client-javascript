import {
  Dataset,
  DatasetVersionState,
  DatasetMetadataFields,
  DatasetMetadataSubField,
  DatasetMetadataFieldValue,
  DatasetLicense,
  DatasetMetadataBlocks,
} from '../../../domain/models/Dataset';
import { AxiosResponse } from 'axios';
import TurndownService from 'turndown';

const turndownService = new TurndownService();

export const transformVersionResponseToDataset = (response: AxiosResponse): Dataset => {
  const versionPayload = response.data.data;
  return transformVersionPayloadToDataset(versionPayload);
};
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const transformVersionPayloadToDataset = (versionPayload: any): Dataset => {
  const datasetModel: Dataset = {
    id: versionPayload.datasetId,
    persistentId: versionPayload.datasetPersistentId,
    versionId: versionPayload.id,
    versionInfo: {
      majorNumber: versionPayload.versionNumber,
      minorNumber: versionPayload.versionMinorNumber,
      state: versionPayload.versionState as DatasetVersionState,
      createTime: new Date(versionPayload.createTime),
      lastUpdateTime: new Date(versionPayload.lastUpdateTime),
      releaseTime: new Date(versionPayload.releaseTime),
    },
    metadataBlocks: transformPayloadToDatasetMetadataBlocks(versionPayload.metadataBlocks),
  };
  if ('license' in versionPayload) {
    datasetModel.license = transformPayloadToDatasetLicense(versionPayload.license);
  }
  return datasetModel;
};
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const transformPayloadToDatasetLicense = (licensePayload: any): DatasetLicense => {
  const datasetLicense: DatasetLicense = {
    name: licensePayload.name,
    uri: licensePayload.uri,
  };

  if ('iconUri' in licensePayload) {
    datasetLicense.iconUri = licensePayload.iconUri;
  }
  return datasetLicense;
};
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const transformPayloadToDatasetMetadataBlocks = (metadataBlocksPayload: any): DatasetMetadataBlocks => {
  return Object.keys(metadataBlocksPayload).map((metadataBlockKey) => {
    return {
      name: metadataBlockKey,
      fields: transformPayloadToDatasetMetadataFields(metadataBlocksPayload[metadataBlockKey].fields),
    };
  }) as DatasetMetadataBlocks;
};
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const transformPayloadToDatasetMetadataFields = (metadataFieldsPayload: any): DatasetMetadataFields => {
  const metadataFieldKeys = Object.keys(metadataFieldsPayload);
  const metadataFields: DatasetMetadataFields = {};
  for (const metadataFieldKey of metadataFieldKeys) {
    const metadataField = metadataFieldsPayload[metadataFieldKey];
    const metadataFieldTypeName = metadataField.typeName;
    metadataFields[metadataFieldTypeName] = transformPayloadToDatasetMetadataFieldValue(metadataField.value);
  }
  return metadataFields;
};
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const transformPayloadToDatasetMetadataFieldValue = (metadataFieldValuePayload: any): DatasetMetadataFieldValue => {
  let metadataFieldValue: DatasetMetadataFieldValue;
  if (Array.isArray(metadataFieldValuePayload)) {
    const isArrayOfObjects = typeof metadataFieldValuePayload[0] === 'object';
    if (!isArrayOfObjects) {
      metadataFieldValue = metadataFieldValuePayload.map(transformHtmlToMarkdown);
    } else {
      const datasetMetadataSubfields: DatasetMetadataSubField[] = [];
      metadataFieldValuePayload.forEach(function (metadataSubFieldValuePayload) {
        const subFieldKeys = Object.keys(metadataSubFieldValuePayload);
        const record: DatasetMetadataSubField = {};
        for (const subFieldKey of subFieldKeys) {
          record[subFieldKey] = transformHtmlToMarkdown(metadataSubFieldValuePayload[subFieldKey].value);
        }
        datasetMetadataSubfields.push(record);
      });
      metadataFieldValue = datasetMetadataSubfields;
    }
  } else {
    metadataFieldValue = transformHtmlToMarkdown(metadataFieldValuePayload);
  }
  return metadataFieldValue;
};

const transformHtmlToMarkdown = (source: string): string => {
  return turndownService.turndown(source);
};
