import { TermsOfAccess } from '../../../domain/models/Dataset'

type TermsOfAccessInput = TermsOfAccess & { termsOfAccess?: string }

export const transformTermsOfAccessToUpdatePayload = (terms: TermsOfAccessInput) => {
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
