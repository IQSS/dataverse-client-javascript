import { UseCase } from '../../../core/domain/useCases/UseCase'
import { ContactDTO } from '../dtos/ContactDTO'
import { Contact } from '../models/Contact'
import { IContactRepository } from '../repositories/IContactRepository'

export class SubmitContactInfo implements UseCase<Contact[]> {
  private contactRepository: IContactRepository

  constructor(contactRepository: IContactRepository) {
    this.contactRepository = contactRepository
  }
  /**
   * Submits contact information and returns a DTO containing the submitted data.
   *
   * @param {ContactDTO} contactDTO - The contact information to be submitted.
   * @returns {Promise<Contact>} A promise resolving to a ContactDTO.
   */
  async execute(contactDTO: ContactDTO): Promise<Contact[]> {
    try {
      return await this.contactRepository.submitContactInfo(contactDTO)
    } catch (error) {
      throw new Error(`${error.message}`)
    }
  }
}
