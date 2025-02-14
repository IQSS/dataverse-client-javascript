import { SubmitContactInfo } from './domain/useCases/SubmitContactInfo'
import { ContactRepository } from './infra/repositories/ContactRepository'

const contactRepository = new ContactRepository()
const submitContactInfo = new SubmitContactInfo(contactRepository)

export { submitContactInfo }
export { Contact } from './domain/models/Contact'
export { ContactDTO } from './domain/dtos/ContactDTO'
