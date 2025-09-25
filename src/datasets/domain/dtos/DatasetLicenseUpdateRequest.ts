import { CustomTerms } from '../models/Dataset'

export interface DatasetLicenseUpdateRequest {
  name?: string
  customTerms?: CustomTerms
}
