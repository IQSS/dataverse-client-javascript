import { AccessRepository } from './infra/repositories/AccessRepository'
import { SubmitGuestbookForDatafileDownload } from './domain/useCases/SubmitGuestbookForDatafileDownload'
import { SubmitGuestbookForDatafilesDownload } from './domain/useCases/SubmitGuestbookForDatafilesDownload'
import { SubmitGuestbookForDatasetDownload } from './domain/useCases/SubmitGuestbookForDatasetDownload'
import { SubmitGuestbookForDatasetVersionDownload } from './domain/useCases/SubmitGuestbookForDatasetVersionDownload'

const accessRepository = new AccessRepository()

const submitGuestbookForDatafileDownload = new SubmitGuestbookForDatafileDownload(accessRepository)
const submitGuestbookForDatafilesDownload = new SubmitGuestbookForDatafilesDownload(
  accessRepository
)
const submitGuestbookForDatasetDownload = new SubmitGuestbookForDatasetDownload(accessRepository)
const submitGuestbookForDatasetVersionDownload = new SubmitGuestbookForDatasetVersionDownload(
  accessRepository
)

export {
  submitGuestbookForDatafileDownload,
  submitGuestbookForDatafilesDownload,
  submitGuestbookForDatasetDownload,
  submitGuestbookForDatasetVersionDownload
}

export { GuestbookResponseDTO } from './domain/dtos/GuestbookResponseDTO'
