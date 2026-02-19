import { GuestbooksRepository } from './infra/repositories/GuestbooksRepository'
import { CreateGuestbook } from './domain/useCases/CreateGuestbook'
import { GetGuestbook } from './domain/useCases/GetGuestbook'
import { GetGuestbooksBycollectionId } from './domain/useCases/GetGuestbooksByCollectionId'
import { SetGuestbookEnabled } from './domain/useCases/SetGuestbookEnabled'

const guestbooksRepository = new GuestbooksRepository()

const createGuestbook = new CreateGuestbook(guestbooksRepository)
const getGuestbook = new GetGuestbook(guestbooksRepository)
const getGuestbooksBycollectionId = new GetGuestbooksBycollectionId(guestbooksRepository)
const setGuestbookEnabled = new SetGuestbookEnabled(guestbooksRepository)

export { createGuestbook, getGuestbook, getGuestbooksBycollectionId, setGuestbookEnabled }

export {
  CreateGuestbookDTO,
  CreateGuestbookCustomQuestionDTO,
  CreateGuestbookOptionDTO
} from './domain/dtos/CreateGuestbookDTO'
export { Guestbook, GuestbookCustomQuestion, GuestbookOption } from './domain/models/Guestbook'
