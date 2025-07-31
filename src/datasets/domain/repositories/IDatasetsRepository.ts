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
import { DatasetVersionSummaryInfo } from '../models/DatasetVersionSummaryInfo'
import { DatasetLinkedCollection } from '../models/DatasetLinkedCollection'
import { CitationFormat } from '../models/CitationFormat'
import { FormattedCitation } from '../models/FormattedCitation'

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
    oldVersionId: string,
    includeDeaccessioned: boolean
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
    datasetMetadataBlocks: MetadataBlock[],
    internalVersionNumber?: number
  ): Promise<void>
  deaccessionDataset(
    datasetId: number | string,
    datasetVersionId: string,
    deaccessionDTO: DatasetDeaccessionDTO
  ): Promise<void>
  getDatasetDownloadCount(
    datasetId: number | string,
    includeMDC?: boolean
  ): Promise<DatasetDownloadCount>
  getDatasetVersionsSummaries(datasetId: number | string): Promise<DatasetVersionSummaryInfo[]>
  deleteDatasetDraft(datasetId: number | string): Promise<void>
  linkDataset(datasetId: number, collectionAlias: string): Promise<void>
  unlinkDataset(datasetId: number, collectionAlias: string): Promise<void>
  getDatasetLinkedCollections(datasetId: number | string): Promise<DatasetLinkedCollection[]>
  getDatasetCitationInOtherFormats(
    datasetId: number,
    datasetVersionId: string,
    format: CitationFormat,
    includeDeaccessioned?: boolean
  ): Promise<FormattedCitation>
}
