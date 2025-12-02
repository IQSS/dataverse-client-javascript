import { TermsOfAccess } from '../../../domain/models/Dataset'

export const transformTermsOfAccessToUpdatePayload = (
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

  const termsOfAccessForRestrictedFiles =
    terms.termsOfAccess ?? terms.termsOfAccessForRestrictedFiles

  return {
    customTermsOfAccess: {
      fileAccessRequest,
      termsOfAccess: termsOfAccessForRestrictedFiles,
      dataAccessPlace,
      originalArchive,
      availabilityStatus,
      contactForAccess,
      sizeOfCollection,
      studyCompletion
    }
  }
}
