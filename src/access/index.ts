import { AccessRepository } from './infra/repositories/AccessRepository'
import { GetSignedDatafileDownloadUrl } from './domain/useCases/GetSignedDatafileDownloadUrl'
import { GetSignedDatafilesDownloadUrl } from './domain/useCases/GetSignedDatafilesDownloadUrl'
import { GetSignedDatasetDownloadUrl } from './domain/useCases/GetSignedDatasetDownloadUrl'
import { GetSignedDatasetVersionDownloadUrl } from './domain/useCases/GetSignedDatasetVersionDownloadUrl'
import { SubmitGuestbookForDatafileDownload } from './domain/useCases/SubmitGuestbookForDatafileDownload'
import { SubmitGuestbookForDatafilesDownload } from './domain/useCases/SubmitGuestbookForDatafilesDownload'
import { SubmitGuestbookForDatasetDownload } from './domain/useCases/SubmitGuestbookForDatasetDownload'
import { SubmitGuestbookForDatasetVersionDownload } from './domain/useCases/SubmitGuestbookForDatasetVersionDownload'

const accessRepository = new AccessRepository()

const getSignedDatafileDownloadUrl = new GetSignedDatafileDownloadUrl(accessRepository)
const getSignedDatafilesDownloadUrl = new GetSignedDatafilesDownloadUrl(accessRepository)
const getSignedDatasetDownloadUrl = new GetSignedDatasetDownloadUrl(accessRepository)
const getSignedDatasetVersionDownloadUrl = new GetSignedDatasetVersionDownloadUrl(accessRepository)
const submitGuestbookForDatafileDownload = new SubmitGuestbookForDatafileDownload(accessRepository)
const submitGuestbookForDatafilesDownload = new SubmitGuestbookForDatafilesDownload(
  accessRepository
)
const submitGuestbookForDatasetDownload = new SubmitGuestbookForDatasetDownload(accessRepository)
const submitGuestbookForDatasetVersionDownload = new SubmitGuestbookForDatasetVersionDownload(
  accessRepository
)

export {
  getSignedDatafileDownloadUrl,
  getSignedDatafilesDownloadUrl,
  getSignedDatasetDownloadUrl,
  getSignedDatasetVersionDownloadUrl,
  submitGuestbookForDatafileDownload,
  submitGuestbookForDatafilesDownload,
  submitGuestbookForDatasetDownload,
  submitGuestbookForDatasetVersionDownload
}

export { GuestbookResponseDTO } from './domain/dtos/GuestbookResponseDTO'
