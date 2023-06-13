import {
  Dataset,
  DatasetVersionState,
  DatasetMetadataFields,
  DatasetMetadataBlock,
  DatasetMetadataSubField,
  DatasetMetadataFieldValue,
  DatasetLicense,
} from '../../../domain/models/Dataset';
import { AxiosResponse } from 'axios';
import TurndownService from 'turndown';

const turndownService = new TurndownService();

export const transformVersionResponseToDataset = (response: AxiosResponse): Dataset => {
  const versionPayload = response.data.data;
  return transformVersionPayloadToDataset(versionPayload);
};

const transformVersionPayloadToDataset = (versionPayload: any): Dataset => {
  let datasetModel: Dataset = {
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
  if (versionPayload.hasOwnProperty('license')) {
    datasetModel.license = transformPayloadToDatasetLicense(versionPayload.license);
  }
  return datasetModel;
};

const transformPayloadToDatasetLicense = (licensePayload: any): DatasetLicense => {
  let datasetLicense: DatasetLicense = {
    name: licensePayload.name,
    uri: licensePayload.uri,
  };
  if (licensePayload.hasOwnProperty('iconUri')) {
    datasetLicense.iconUri = licensePayload.iconUri;
  }
  return datasetLicense;
};

const transformPayloadToDatasetMetadataBlocks = (metadataBlocksPayload: any): DatasetMetadataBlock[] => {
  return Object.keys(metadataBlocksPayload).map((metadataBlockKey) => {
    return {
      name: metadataBlockKey,
      fields: transformPayloadToDatasetMetadataFields(metadataBlocksPayload[metadataBlockKey].fields),
    };
  });
};

const transformPayloadToDatasetMetadataFields = (metadataFieldsPayload: any): DatasetMetadataFields => {
  const metadataFieldKeys = Object.keys(metadataFieldsPayload);
  const metadataFields: DatasetMetadataFields = {};
  for (let metadataFieldKey of metadataFieldKeys) {
    const metadataField = metadataFieldsPayload[metadataFieldKey];
    const metadataFieldTypeName = metadataField.typeName;
    metadataFields[metadataFieldTypeName] = transformPayloadToDatasetMetadataFieldValue(metadataField.value);
  }
  return metadataFields;
};

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
        for (let subFieldKey of subFieldKeys) {
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
