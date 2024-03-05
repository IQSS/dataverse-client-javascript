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

export const transformCountsPerContentTypePayload = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export const transformCountsPerCategoryNamePayload = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export const transformCountsPerAccessStatusPayload = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
