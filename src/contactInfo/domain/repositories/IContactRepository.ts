import { Contact } from '../models/Contact'
import { ContactDTO } from '../dtos/ContactDTO'

export interface IContactRepository {
  submitContactInfo(contactDTO: ContactDTO): Promise<Contact[]>
}
