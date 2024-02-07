import { DatasetVersionInfo } from './Dataset'

export interface DatasetPreview {
  persistentId: string
  title: string
  versionId: number
  versionInfo: DatasetVersionInfo
  citation: string
  description: string
}
