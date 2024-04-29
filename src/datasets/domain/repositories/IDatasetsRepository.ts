import { Dataset, VersionUpdateType } from '../models/Dataset'
import { DatasetLock } from '../models/DatasetLock'
import { DatasetPreviewSubset } from '../models/DatasetPreviewSubset'
import { DatasetUserPermissions } from '../models/DatasetUserPermissions'
import { CreatedDatasetIdentifiers } from '../models/CreatedDatasetIdentifiers'
import { NewDatasetDTO } from '../dtos/DatasetDTO'
import { MetadataBlock } from '../../../metadataBlocks'

export interface IDatasetsRepository {
  getDataset(
    datasetId: number | string,
    datasetVersionId: string,
    includeDeaccessioned: boolean
  ): Promise<Dataset>
  getDatasetLocks(datasetId: number | string): Promise<DatasetLock[]>
  getDatasetCitation(
    datasetId: number,
    datasetVersionId: string,
    includeDeaccessioned: boolean
  ): Promise<string>
  getPrivateUrlDataset(token: string): Promise<Dataset>
  getAllDatasetPreviews(
    limit?: number,
    offset?: number,
    collectionId?: string
  ): Promise<DatasetPreviewSubset>
  getDatasetSummaryFieldNames(): Promise<string[]>
  getPrivateUrlDatasetCitation(token: string): Promise<string>
  getDatasetUserPermissions(datasetId: number | string): Promise<DatasetUserPermissions>
  createDataset(
    newDataset: NewDatasetDTO,
    datasetMetadataBlocks: MetadataBlock[],
    collectionId: string
  ): Promise<CreatedDatasetIdentifiers>
  publishDataset(datasetId: number | string, versionUpdateType: VersionUpdateType): Promise<void>
  updateDataset(
    datasetId: number | string,
    newDataset: NewDatasetDTO,
    datasetMetadataBlocks: MetadataBlock[]
  ): Promise<void>
}
