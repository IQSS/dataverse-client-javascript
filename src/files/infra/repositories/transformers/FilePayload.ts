import { OwnerPayload } from '../../../../dv-object/infra/repositories/transformers/OwnerPayload';

export interface FilePayload {
  dataFile: {
    id: number;
    persistentId: string;
    filename: string;
    pidURL?: string;
    filesize: number;
    version: number;
    description?: string;
    restricted: boolean;
    directoryLabel?: string;
    datasetVersionId?: number;
    categories?: string[];
    contentType: string;
    friendlyType: string;
    embargo?: EmbargoPayload;
    storageIdentifier?: string;
    originalFormat?: string;
    originalFormatLabel?: string;
    originalSize?: number;
    originalName?: string;
    UNF?: string;
    rootDataFileId?: number;
    previousDataFileId?: number;
    md5?: string;
    checksum?: ChecksumPayload;
    fileMetadataId?: number;
    tabularTags?: string[];
    creationDate?: string;
    publicationDate?: string;
    deleted: boolean;
    tabularData: boolean;
    fileAccessRequest?: boolean;
    owner?: OwnerPayload;
  };
  version: number;
  restricted: boolean;
  label: string;
  datasetVersionId: number;
}

export interface EmbargoPayload {
  dateAvailable: string;
  reason?: string;
}

export interface ChecksumPayload {
  type: string;
  value: string;
}
