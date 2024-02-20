import { File, FileEmbargo, FileChecksum } from '../../../domain/models/File';
import { AxiosResponse } from 'axios';
import { FilesSubset } from '../../../domain/models/FilesSubset';
import { DvObjectOwner, DvObjectType } from '../../../../dv-object/domain/models/DvObjectOwner';
import { ChecksumPayload, EmbargoPayload, FilePayload, OwnerPayload } from './FilePayload';

export const transformFilesResponseToFilesSubset = (response: AxiosResponse): FilesSubset => {
  const filesPayload = response.data.data;
  const files: File[] = [];
  filesPayload.forEach(function (filePayload: FilePayload) {
    files.push(transformFilePayloadToFile(filePayload));
  });

  return {
    files: files,
    totalFilesCount: response.data.totalCount,
  };
};

export const transformFileResponseToFile = (response: AxiosResponse): File => {
  const filePayload = response.data.data;
  return transformFilePayloadToFile(filePayload);
};

const transformFilePayloadToFile = (filePayload: FilePayload): File => {
  return {
    id: filePayload.dataFile.id,
    persistentId: filePayload.dataFile.persistentId,
    name: filePayload.dataFile.filename,
    ...(filePayload.dataFile.pidURL && { pidURL: filePayload.dataFile.pidURL }),
    sizeBytes: filePayload.dataFile.filesize,
    version: filePayload.version,
    ...(filePayload.dataFile.description && { description: filePayload.dataFile.description }),
    restricted: filePayload.restricted,
    latestRestricted: filePayload.dataFile.restricted,
    ...(filePayload.dataFile.directoryLabel && { directoryLabel: filePayload.dataFile.directoryLabel }),
    ...(filePayload.dataFile.datasetVersionId && { datasetVersionId: filePayload.dataFile.datasetVersionId }),
    ...(filePayload.dataFile.categories && { categories: filePayload.dataFile.categories }),
    contentType: filePayload.dataFile.contentType,
    friendlyType: filePayload.dataFile.friendlyType,
    ...(filePayload.dataFile.embargo && { embargo: transformEmbargoPayloadToEmbargo(filePayload.dataFile.embargo) }),
    ...(filePayload.dataFile.storageIdentifier && { storageIdentifier: filePayload.dataFile.storageIdentifier }),
    ...(filePayload.dataFile.originalFormat && { originalFormat: filePayload.dataFile.originalFormat }),
    ...(filePayload.dataFile.originalFormatLabel && { originalFormatLabel: filePayload.dataFile.originalFormatLabel }),
    ...(filePayload.dataFile.originalSize && { originalSize: filePayload.dataFile.originalSize }),
    ...(filePayload.dataFile.originalName && { originalName: filePayload.dataFile.originalName }),
    ...(filePayload.dataFile.UNF && { UNF: filePayload.dataFile.UNF }),
    ...(filePayload.dataFile.rootDataFileId && { rootDataFileId: filePayload.dataFile.rootDataFileId }),
    ...(filePayload.dataFile.previousDataFileId && { previousDataFileId: filePayload.dataFile.previousDataFileId }),
    ...(filePayload.dataFile.md5 && { md5: filePayload.dataFile.md5 }),
    ...(filePayload.dataFile.checksum && {
      checksum: transformChecksumPayloadToChecksum(filePayload.dataFile.checksum),
    }),
    ...(filePayload.dataFile.fileMetadataId && { metadataId: filePayload.dataFile.fileMetadataId }),
    ...(filePayload.dataFile.tabularTags && { tabularTags: filePayload.dataFile.tabularTags }),
    ...(filePayload.dataFile.creationDate && { creationDate: new Date(filePayload.dataFile.creationDate) }),
    ...(filePayload.dataFile.publicationDate && { publicationDate: new Date(filePayload.dataFile.publicationDate) }),
    deleted: filePayload.dataFile.deleted,
    tabularData: filePayload.dataFile.tabularData,
    ...(filePayload.dataFile.fileAccessRequest && { fileAccessRequest: filePayload.dataFile.fileAccessRequest }),
    ...(filePayload.dataFile.owner && { owner: transformOwnerPayloadToOwner(filePayload.dataFile.owner) }),
  };
};

const transformEmbargoPayloadToEmbargo = (embargoPayload: EmbargoPayload): FileEmbargo => {
  return {
    dateAvailable: new Date(embargoPayload.dateAvailable),
    ...(embargoPayload.reason && { reason: embargoPayload.reason }),
  };
};

const transformChecksumPayloadToChecksum = (checksumPayload: ChecksumPayload): FileChecksum => {
  return {
    type: checksumPayload.type,
    value: checksumPayload.value,
  };
};

const transformOwnerPayloadToOwner = (ownerPayload: OwnerPayload): DvObjectOwner => {
  return {
    type: ownerPayload.type as DvObjectType,
    identifier: ownerPayload.identifier,
    displayName: ownerPayload.displayName,
    ...(ownerPayload.owner && { owner: transformOwnerPayloadToOwner(ownerPayload.owner) }),
  };
};
