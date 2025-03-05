import { Dataset, VersionUpdateType } from '../models/Dataset'
import { DatasetLock } from '../models/DatasetLock'
import { DatasetPreviewSubset } from '../models/DatasetPreviewSubset'
import { DatasetUserPermissions } from '../models/DatasetUserPermissions'
import { CreatedDatasetIdentifiers } from '../models/CreatedDatasetIdentifiers'
import { DatasetDTO } from '../dtos/DatasetDTO'
import { DatasetDeaccessionDTO } from '../dtos/DatasetDeaccessionDTO'
import { MetadataBlock } from '../../../metadataBlocks'
import { DatasetVersionDiff } from '../models/DatasetVersionDiff'
import { DatasetDownloadCount } from '../models/DatasetDownloadCount'

export interface IDatasetsRepository {
  getDataset(
    datasetId: number | string,
    datasetVersionId: string,
    includeDeaccessioned: boolean,
    keepRawFields: boolean
  ): Promise<Dataset>
  getDatasetLocks(datasetId: number | string): Promise<DatasetLock[]>
  getDatasetCitation(
    datasetId: number,
    datasetVersionId: string,
    includeDeaccessioned: boolean
  ): Promise<string>
  getPrivateUrlDataset(token: string, keepRawFields: boolean): Promise<Dataset>
  getAllDatasetPreviews(
    limit?: number,
    offset?: number,
    collectionId?: string
  ): Promise<DatasetPreviewSubset>
  getDatasetSummaryFieldNames(): Promise<string[]>
  getPrivateUrlDatasetCitation(token: string): Promise<string>
  getDatasetUserPermissions(datasetId: number | string): Promise<DatasetUserPermissions>
  getDatasetVersionDiff(
    datasetId: number | string,
    newVersionId: string,
    oldVersionId: string
  ): Promise<DatasetVersionDiff>
  createDataset(
    newDataset: DatasetDTO,
    datasetMetadataBlocks: MetadataBlock[],
    collectionId: string
  ): Promise<CreatedDatasetIdentifiers>
  publishDataset(datasetId: number | string, versionUpdateType: VersionUpdateType): Promise<void>
  updateDataset(
    datasetId: number | string,
    dataset: DatasetDTO,
    datasetMetadataBlocks: MetadataBlock[]
  ): Promise<void>
  deaccessionDataset(
    datasetId: number | string,
    datasetVersionId: string,
    deaccessionDTO: DatasetDeaccessionDTO
  ): Promise<void>
  getDatasetDownloadCount(datasetId: number, includeMDC?: boolean): Promise<DatasetDownloadCount>
}
