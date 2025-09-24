import { CustomTerms } from '../../domain/models/Dataset'

export interface DatasetLicenseUpdateRequest {
  name?: string
  customTerms?: CustomTerms
}
