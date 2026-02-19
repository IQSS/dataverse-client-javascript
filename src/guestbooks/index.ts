import { GuestbooksRepository } from './infra/repositories/GuestbooksRepository'
import { CreateGuestbook } from './domain/useCases/CreateGuestbook'
import { GetGuestbook } from './domain/useCases/GetGuestbook'
import { GetGuestbooksByCollectionId } from './domain/useCases/GetGuestbooksByCollectionId'
import { SetGuestbookEnabled } from './domain/useCases/SetGuestbookEnabled'

const guestbooksRepository = new GuestbooksRepository()

const createGuestbook = new CreateGuestbook(guestbooksRepository)
const getGuestbook = new GetGuestbook(guestbooksRepository)
const getGuestbooksByCollectionId = new GetGuestbooksByCollectionId(guestbooksRepository)
const setGuestbookEnabled = new SetGuestbookEnabled(guestbooksRepository)

export { createGuestbook, getGuestbook, getGuestbooksByCollectionId, setGuestbookEnabled }

export {
  CreateGuestbookDTO,
  CreateGuestbookCustomQuestionDTO,
  CreateGuestbookOptionDTO
} from './domain/dtos/CreateGuestbookDTO'
export { Guestbook, GuestbookCustomQuestion, GuestbookOption } from './domain/models/Guestbook'
