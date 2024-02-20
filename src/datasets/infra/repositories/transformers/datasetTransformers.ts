import {
  Dataset,
  DatasetVersionState,
  DatasetMetadataFields,
  DatasetMetadataSubField,
  DatasetMetadataFieldValue,
  DatasetLicense,
  DatasetMetadataBlocks,
  ANONYMIZED_FIELD_VALUE,
} from '../../../domain/models/Dataset';
import { AxiosResponse } from 'axios';
import TurndownService from 'turndown';
import {
  DatasetPayload,
  LicensePayload,
  MetadataBlocksPayload,
  MetadataSubfieldValuePayload,
  MetadataFieldPayload,
  MetadataFieldValuePayload,
} from './DatasetPayload';
import { transformOwnerPayloadToOwner } from '../../../../dv-object/infra/repositories/transformers/dvObjectOwnerTransformer';

const turndownService = new TurndownService();

export const transformVersionResponseToDataset = (response: AxiosResponse): Dataset => {
  const versionPayload = response.data.data;
  return transformVersionPayloadToDataset(versionPayload);
};

const transformVersionPayloadToDataset = (versionPayload: DatasetPayload): Dataset => {
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
    owner: transformOwnerPayloadToOwner(versionPayload.owner),
  };
  if ('license' in versionPayload) {
    datasetModel.license = transformPayloadToDatasetLicense(versionPayload.license);
  }
  if ('alternativePersistentId' in versionPayload) {
    datasetModel.alternativePersistentId = versionPayload.alternativePersistentId;
  }
  if ('publicationDate' in versionPayload) {
    datasetModel.publicationDate = versionPayload.publicationDate;
  }
  if ('citationDate' in versionPayload) {
    datasetModel.citationDate = versionPayload.citationDate;
  }
  return datasetModel;
};

const transformPayloadToDatasetLicense = (licensePayload: LicensePayload): DatasetLicense => {
  const datasetLicense: DatasetLicense = {
    name: licensePayload.name,
    uri: licensePayload.uri,
  };

  if ('iconUri' in licensePayload) {
    datasetLicense.iconUri = licensePayload.iconUri;
  }
  return datasetLicense;
};

const transformPayloadToDatasetMetadataBlocks = (
  metadataBlocksPayload: MetadataBlocksPayload,
): DatasetMetadataBlocks => {
  return Object.keys(metadataBlocksPayload).map((metadataBlockKey) => {
    const metadataBlock = metadataBlocksPayload[metadataBlockKey];
    return {
      name: metadataBlock.name,
      fields: transformPayloadToDatasetMetadataFields(metadataBlock.fields),
    };
  }) as DatasetMetadataBlocks;
};

const transformPayloadToDatasetMetadataFields = (
  metadataFieldsPayload: MetadataFieldPayload[],
): DatasetMetadataFields => {
  return metadataFieldsPayload.reduce((acc: DatasetMetadataFields, field: MetadataFieldPayload) => {
    acc[field.typeName] = transformPayloadToDatasetMetadataFieldValue(field.value, field.typeClass);
    return acc;
  }, {});
};

const transformPayloadToDatasetMetadataFieldValue = (
  metadataFieldValuePayload: MetadataFieldValuePayload,
  typeClass: string,
): DatasetMetadataFieldValue => {
  function isArrayOfSubfieldValue(
    array: (string | MetadataSubfieldValuePayload)[],
  ): array is MetadataSubfieldValuePayload[] {
    return array.length > 0 && typeof array[0] !== 'string';
  }

  if (typeClass === 'anonymized') {
    return ANONYMIZED_FIELD_VALUE;
  }

  if (typeof metadataFieldValuePayload === 'string') {
    return transformHtmlToMarkdown(metadataFieldValuePayload);
  } else if (Array.isArray(metadataFieldValuePayload)) {
    if (isArrayOfSubfieldValue(metadataFieldValuePayload)) {
      return metadataFieldValuePayload.map((v) => transformPayloadToDatasetMetadataSubfieldValue(v));
    } else {
      return metadataFieldValuePayload.map(transformHtmlToMarkdown);
    }
  } else {
    return transformPayloadToDatasetMetadataSubfieldValue(metadataFieldValuePayload as MetadataSubfieldValuePayload);
  }
};

const transformPayloadToDatasetMetadataSubfieldValue = (
  metadataSubfieldValuePayload: MetadataSubfieldValuePayload,
): DatasetMetadataSubField => {
  const result: DatasetMetadataSubField = {};
  Object.keys(metadataSubfieldValuePayload).forEach((key) => {
    const subFieldValue = metadataSubfieldValuePayload[key].value;
    result[key] = transformHtmlToMarkdown(subFieldValue);
  });
  return result;
};

const transformHtmlToMarkdown = (source: string): string => {
  return turndownService.turndown(source);
};
