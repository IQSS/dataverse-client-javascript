import { DatasetCurationStatus } from '../../../domain/models/DatasetCuration'

export const transformCurationStatus = (status: DatasetCurationStatus): DatasetCurationStatus => ({
  ...status
})

export const transformCurrentCurationStatus = (
  status: DatasetCurationStatus
): DatasetCurationStatus | null =>
  Object.keys(status).length === 0 ? null : transformCurationStatus(status)

export const transformAllowedCurationLabels = (data: { message: string } | string): string[] => {
  const labels = typeof data === 'string' ? data : data.message
  return labels === '' ? [] : labels.split(',')
}
