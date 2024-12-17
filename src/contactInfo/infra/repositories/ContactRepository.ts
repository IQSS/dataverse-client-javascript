import { ApiRepository } from '../../../core/infra/repositories/ApiRepository'
import { Contact } from '../../domain/models/Contact'
import { IContactRepository } from '../../domain/repositories/IContactRepository'
import { ContactDTO } from '../../domain/dtos/ContactDTO'

export class ContactRepository extends ApiRepository implements IContactRepository {
  public async submitContactInfo(contactDTO: ContactDTO): Promise<Contact[]> {
    return this.doPost(`/admin/feedback`, contactDTO)
      .then((response) => {
        const responseData = response.data
        const contact: Contact[] = responseData.data.map((item: Contact) => ({
          fromEmail: item.fromEmail,
          toEmail: item.toEmail,
          subject: item.subject,
          body: item.body
        }))

        return contact
      })
      .catch((error) => {
        throw error
      })
  }
}
