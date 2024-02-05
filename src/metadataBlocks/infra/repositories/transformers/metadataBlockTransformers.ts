import { AxiosResponse } from 'axios';
import { MetadataBlock, MetadataFieldInfo } from '../../../domain/models/MetadataBlock';

export const transformMetadataBlockResponseToMetadataBlock = (response: AxiosResponse): MetadataBlock => {
  const metadataBlockPayload = response.data.data;
  const metadataFields: Record<string, MetadataFieldInfo> = {};
  const metadataBlockFieldsPayload = metadataBlockPayload.fields;
  Object.keys(metadataBlockFieldsPayload).map((metadataFieldKey) => {
    const metadataFieldInfoPayload = metadataBlockFieldsPayload[metadataFieldKey];
    metadataFields[metadataFieldKey] = transformPayloadMetadataFieldInfo(metadataFieldInfoPayload);
  });
  return {
    id: metadataBlockPayload.id,
    name: metadataBlockPayload.name,
    displayName: metadataBlockPayload.displayName,
    metadataFields: metadataFields,
  };
};

const transformPayloadMetadataFieldInfo = (metadataFieldInfoPayload: any, isChild = false): MetadataFieldInfo => {
  const metadataFieldInfo: MetadataFieldInfo = {
    name: metadataFieldInfoPayload.name,
    displayName: metadataFieldInfoPayload.displayName,
    title: metadataFieldInfoPayload.title,
    type: metadataFieldInfoPayload.type,
    watermark: metadataFieldInfoPayload.watermark,
    description: metadataFieldInfoPayload.description,
    multiple: metadataFieldInfoPayload.multiple,
    isControlledVocabulary: metadataFieldInfoPayload.isControlledVocabulary,
    displayFormat: metadataFieldInfoPayload.displayFormat,
    isRequired: metadataFieldInfoPayload.isRequired,
    displayOrder: metadataFieldInfoPayload.displayOrder,
    typeClass: metadataFieldInfoPayload.typeClass,
  };
  if (!isChild && metadataFieldInfoPayload.hasOwnProperty('childFields')) {
    const childMetadataFieldsPayload = metadataFieldInfoPayload.childFields;
    const childMetadataFields: Record<string, MetadataFieldInfo> = {};
    Object.keys(childMetadataFieldsPayload).map((metadataFieldKey) => {
      childMetadataFields[metadataFieldKey] = transformPayloadMetadataFieldInfo(
        childMetadataFieldsPayload[metadataFieldKey],
        true,
      );
    });
    metadataFieldInfo.childMetadataFields = childMetadataFields;
  }
  return metadataFieldInfo;
};
