import { AxiosResponse } from 'axios'
import {
  FileCounts,
  FileContentTypeCount,
  FileCategoryNameCount,
  FileAccessStatusCount
} from '../../../domain/models/FileCounts'
import { FileAccessStatus } from '../../../domain/models/FileCriteria'

export const transformFileCountsResponseToFileCounts = (response: AxiosResponse): FileCounts => {
  const fileCountsPayload = response.data.data
  return {
    total: fileCountsPayload.total,
    perContentType: transformCountsPerContentTypePayload(fileCountsPayload.perContentType),
    perAccessStatus: transformCountsPerAccessStatusPayload(fileCountsPayload.perAccessStatus),
    perCategoryName: transformCountsPerCategoryNamePayload(fileCountsPayload.perCategoryName)
  }
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const transformCountsPerContentTypePayload = (
  countsPerContentTypePayload: any
): FileContentTypeCount[] => {
  const fileContentTypeCounts: FileContentTypeCount[] = []
  const fileContentTypeCountKeys = Object.keys(countsPerContentTypePayload)
  for (const fileContentTypeCountKey of fileContentTypeCountKeys) {
    fileContentTypeCounts.push({
      contentType: fileContentTypeCountKey,
      count: countsPerContentTypePayload[fileContentTypeCountKey]
    })
  }
  return fileContentTypeCounts
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const transformCountsPerCategoryNamePayload = (
  countsPerCategoryNamePayload: any
): FileCategoryNameCount[] => {
  const fileCategoryNameCounts: FileCategoryNameCount[] = []
  const fileCategoryNameCountKeys = Object.keys(countsPerCategoryNamePayload)
  for (const fileCategoryNameCountKey of fileCategoryNameCountKeys) {
    fileCategoryNameCounts.push({
      categoryName: fileCategoryNameCountKey,
      count: countsPerCategoryNamePayload[fileCategoryNameCountKey]
    })
  }
  return fileCategoryNameCounts
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const transformCountsPerAccessStatusPayload = (
  countsPerAccessStatusPayload: any
): FileAccessStatusCount[] => {
  const fileAccessStatusCounts: FileAccessStatusCount[] = []
  const fileAccessStatusCountKeys = Object.keys(countsPerAccessStatusPayload)
  for (const fileAccessStatusCountKey of fileAccessStatusCountKeys) {
    fileAccessStatusCounts.push({
      accessStatus: fileAccessStatusCountKey as FileAccessStatus,
      count: countsPerAccessStatusPayload[fileAccessStatusCountKey]
    })
  }
  return fileAccessStatusCounts
}
