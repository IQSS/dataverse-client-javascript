import { AxiosResponse } from 'axios'
import { DatasetVersionDiff } from '../../../domain/models/DatasetVersionDiff'

export const transformDatasetVersionDiffResponseToDatasetVersionDiff = (
  response: AxiosResponse
): DatasetVersionDiff => {
  const datasetVersionDiffPayload = response.data.data
  const retValue = {
    oldVersion: datasetVersionDiffPayload.oldVersion,
    newVersion: datasetVersionDiffPayload.newVersion,
    metadataChanges: datasetVersionDiffPayload.metadataChanges,
    filesAdded: datasetVersionDiffPayload.filesAdded,
    filesRemoved: datasetVersionDiffPayload.filesRemoved,
    fileChanges: datasetVersionDiffPayload.fileChanges,
    filesReplaced: datasetVersionDiffPayload.filesReplaced,
    termsOfAccess: datasetVersionDiffPayload.TermsOfAccess
  }
  return retValue
}
