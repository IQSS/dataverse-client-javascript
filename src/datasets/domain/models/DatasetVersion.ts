import { DatasetLicense, DatasetMetadataBlocks, DatasetVersionState } from "./Dataset";
import { FilePayload } from "../../../files/infra/repositories/transformers/FilePayload";

export interface DatasetVersion {
  id: number
  datasetId: number
  datasetPersistentId: string
  alternativePersistentId?: string
  datasetType: string
  storageIdentifier: string
  versionNumber?: number
  versionMinorNumber?: number
  internalVersionNumber: number
  versionState: DatasetVersionState
  latestVersionPublishingState: DatasetVersionState
  lastUpdateTime: string
  releaseTime?: string
  createTime: string
  publicationDate: string
  citationDate: string
  license: DatasetLicense
  fileAccessRequest: boolean
  metadataBlocks?: DatasetMetadataBlocks
}

export interface DatasetVersionSubset {
  versions: DatasetVersion[]
  totalCount: number
}