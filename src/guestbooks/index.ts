import { GuestbooksRepository } from './infra/repositories/GuestbooksRepository'
import { CreateGuestbook } from './domain/useCases/CreateGuestbook'
import { EditGuestbook } from './domain/useCases/EditGuestbook'
import { DownloadGuestbookResponsesByCollectionId } from './domain/useCases/DownloadGuestbookResponsesByCollectionId'
import { DownloadGuestbookResponsesOfAGuestbook } from './domain/useCases/DownloadGuestbookResponsesOfAGuestbook'
import { GetGuestbook } from './domain/useCases/GetGuestbook'
import { GetGuestbookResponsesByGuestbookId } from './domain/useCases/GetGuestbookResponsesByGuestbookId'
import { GetGuestbooksByCollectionId } from './domain/useCases/GetGuestbooksByCollectionId'
import { SetGuestbookEnabled } from './domain/useCases/SetGuestbookEnabled'
import { AssignDatasetGuestbook } from './domain/useCases/AssignDatasetGuestbook'
import { RemoveDatasetGuestbook } from './domain/useCases/RemoveDatasetGuestbook'

const guestbooksRepository = new GuestbooksRepository()

const createGuestbook = new CreateGuestbook(guestbooksRepository)
const editGuestbook = new EditGuestbook(guestbooksRepository)
const downloadGuestbookResponsesByCollectionId = new DownloadGuestbookResponsesByCollectionId(
  guestbooksRepository
)
const downloadGuestbookResponsesOfAGuestbook = new DownloadGuestbookResponsesOfAGuestbook(
  guestbooksRepository
)
const getGuestbook = new GetGuestbook(guestbooksRepository)
const getGuestbookResponsesByGuestbookId = new GetGuestbookResponsesByGuestbookId(
  guestbooksRepository
)
const getGuestbooksByCollectionId = new GetGuestbooksByCollectionId(guestbooksRepository)
const setGuestbookEnabled = new SetGuestbookEnabled(guestbooksRepository)
const assignDatasetGuestbook = new AssignDatasetGuestbook(guestbooksRepository)
const removeDatasetGuestbook = new RemoveDatasetGuestbook(guestbooksRepository)

export {
  createGuestbook,
  editGuestbook,
  downloadGuestbookResponsesByCollectionId,
  downloadGuestbookResponsesOfAGuestbook,
  getGuestbook,
  getGuestbookResponsesByGuestbookId,
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
export {
  EditGuestbookDTO,
  EditGuestbookCustomQuestionDTO,
  EditGuestbookOptionDTO
} from './domain/dtos/EditGuestbookDTO'
export {
  GuestbookResponsesDTO,
  GuestbookResponsesPaginationDTO
} from './domain/dtos/GuestbookResponsesDTO'
export { Guestbook, GuestbookCustomQuestion, GuestbookOption } from './domain/models/Guestbook'
export {
  EventType,
  GuestbookResponse,
  GuestbookResponseCustomQuestion,
  GuestbookResponseSubset
} from './domain/models/GuestbookResponse'
