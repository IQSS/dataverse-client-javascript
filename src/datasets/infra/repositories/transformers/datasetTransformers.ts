import {
  Dataset,
  DatasetVersionState,
  DatasetMetadataFields,
  DatasetMetadataBlock,
  DatasetMetadataSubField,
  DatasetMetadataFieldValue,
} from '../../../domain/models/Dataset';
import { AxiosResponse } from 'axios';
import { NodeHtmlMarkdown } from 'node-html-markdown';

export const transformVersionResponseToDataset = (response: AxiosResponse): Dataset => {
  const versionPayload = response.data.data;
  return transformVersionPayloadToDataset(versionPayload);
};

export const transformLatestVersionResponseToDataset = (response: AxiosResponse): Dataset => {
  const versionPayload = response.data.data.latestVersion;
  return transformVersionPayloadToDataset(versionPayload);
};

const transformVersionPayloadToDataset = (versionPayload: any): Dataset => {
  return {
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
    license: {
      name: versionPayload.license.name,
      uri: versionPayload.license.uri,
      iconUri: versionPayload.license.iconUri,
    },
    metadataBlocks: transformPayloadToDatasetMetadataBlocks(versionPayload.metadataBlocks),
  };
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
  return NodeHtmlMarkdown.translate(source);
};
