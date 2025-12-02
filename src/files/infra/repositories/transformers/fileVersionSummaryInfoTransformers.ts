import { AxiosResponse } from 'axios'
import {
  FileVersionSummaryInfo,
  FileMetadataChange,
  FileDifferenceSummary,
  FileVersionSummarySubset
} from '../../../domain/models/FileVersionSummaryInfo'
import { DatasetVersionState } from '../../../../datasets/domain/models/Dataset'

export interface FileVersionSummaryInfoPayload {
  datasetVersion: string
  contributors?: string
  publishedDate?: string
  fileDifferenceSummary?: {
    file?: string
    FileAccess?: string
    FileMetadata?: FileMetadataChange[]
    deaccessionedReason?: string
    FileTags?: {
      Added?: number
      Deleted?: number
      Changed?: number
    }
  }
  versionState?: DatasetVersionState
  datafileId: number
  persistentId?: string
  versionNote?: string
}

export const transformFileVersionSummaryInfoResponseToFileVersionSummaryInfo = (
  response: AxiosResponse
): FileVersionSummarySubset => {
  const payload = response.data.data
  const totalCount = response.data.totalCount

  const summaries = payload.map((item: FileVersionSummaryInfoPayload): FileVersionSummaryInfo => {
    const summary = item.fileDifferenceSummary || {}

    const fileDifferenceSummary: FileDifferenceSummary = {
      ...(summary.file && { file: summary.file }),
      ...(summary.FileAccess && { fileAccess: summary.FileAccess }),
      ...(summary.FileMetadata && { fileMetadata: summary.FileMetadata }),
      ...(summary.deaccessionedReason && { deaccessionedReason: summary.deaccessionedReason }),
      ...(summary.FileTags && { fileTags: summary.FileTags })
    } as FileDifferenceSummary

    return {
      datasetVersion: item.datasetVersion,
      contributors: item.contributors,
      publishedDate: item.publishedDate,
      fileDifferenceSummary: fileDifferenceSummary,
      versionState: item.versionState,
      datafileId: item.datafileId,
      persistentId: item.persistentId,
      versionNote: item.versionNote
    }
  })

  return {
    summaries,
    totalCount
  }
}
