import { GuestbooksRepository } from './infra/repositories/GuestbooksRepository'
import { CreateGuestbook } from './domain/useCases/CreateGuestbook'
import { DownloadGuestbookResponsesByDataverseId } from './domain/useCases/DownloadGuestbookResponsesByDataverseId'
import { DownloadGuestbookResponsesOfAGuestbook } from './domain/useCases/DownloadGuestbookResponsesOfAGuestbook'
import { GetGuestbook } from './domain/useCases/GetGuestbook'
import { GetGuestbookResponsesByDataverseId } from './domain/useCases/GetGuestbookResponsesByDataverseId'
import { GetGuestbookResponsesOfAGuestbook } from './domain/useCases/GetGuestbookResponsesOfAGuestbook'
import { GetGuestbooksByCollectionId } from './domain/useCases/GetGuestbooksByCollectionId'
import { SetGuestbookEnabled } from './domain/useCases/SetGuestbookEnabled'
import { AssignDatasetGuestbook } from './domain/useCases/AssignDatasetGuestbook'
import { RemoveDatasetGuestbook } from './domain/useCases/RemoveDatasetGuestbook'

const guestbooksRepository = new GuestbooksRepository()

const createGuestbook = new CreateGuestbook(guestbooksRepository)
const downloadGuestbookResponsesByDataverseId = new DownloadGuestbookResponsesByDataverseId(
  guestbooksRepository
)
const downloadGuestbookResponsesOfAGuestbook = new DownloadGuestbookResponsesOfAGuestbook(
  guestbooksRepository
)
const getGuestbook = new GetGuestbook(guestbooksRepository)
const getGuestbookResponsesByDataverseId = new GetGuestbookResponsesByDataverseId(
  guestbooksRepository
)
const getGuestbookResponsesOfAGuestbook = new GetGuestbookResponsesOfAGuestbook(
  guestbooksRepository
)
const getGuestbooksByCollectionId = new GetGuestbooksByCollectionId(guestbooksRepository)
const setGuestbookEnabled = new SetGuestbookEnabled(guestbooksRepository)
const assignDatasetGuestbook = new AssignDatasetGuestbook(guestbooksRepository)
const removeDatasetGuestbook = new RemoveDatasetGuestbook(guestbooksRepository)

export {
  createGuestbook,
  downloadGuestbookResponsesByDataverseId,
  downloadGuestbookResponsesOfAGuestbook,
  getGuestbook,
  getGuestbookResponsesByDataverseId,
  getGuestbookResponsesOfAGuestbook,
  getGuestbooksByCollectionId,
  setGuestbookEnabled,
  assignDatasetGuestbook,
  removeDatasetGuestbook
}

export {
  CreateGuestbookDTO,
  CreateGuestbookCustomQuestionDTO,
  CreateGuestbookOptionDTO
} from './domain/dtos/CreateGuestbookDTO'
export { Guestbook, GuestbookCustomQuestion, GuestbookOption } from './domain/models/Guestbook'
export { GuestbookResponse } from './domain/models/GuestbookResponse'
