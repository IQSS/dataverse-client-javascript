import { TermsOfAccess } from '../../../../datasets/domain/models/Dataset'

export const transformTemplateTermsOfAccessToUpdatePayload = (
  terms: TermsOfAccess & { termsOfAccess?: string }
) => {
  const {
    fileAccessRequest,
    dataAccessPlace,
    originalArchive,
    availabilityStatus,
    contactForAccess,
    sizeOfCollection,
    studyCompletion
  } = terms

  const termsOfAccess = terms.termsOfAccess ?? terms.termsOfAccessForRestrictedFiles

  return {
    customTermsOfAccess: {
      fileAccessRequest,
      termsOfAccess,
      dataAccessPlace,
      originalArchive,
      availabilityStatus,
      contactForAccess,
      sizeOfCollection,
      studyCompletion
    }
  }
}
