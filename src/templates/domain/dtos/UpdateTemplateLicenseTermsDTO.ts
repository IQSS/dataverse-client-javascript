import { CustomTerms } from '../../../datasets/domain/models/Dataset'

export interface UpdateTemplateLicenseTermsDTO {
  name?: string
  customTerms?: CustomTerms
}
