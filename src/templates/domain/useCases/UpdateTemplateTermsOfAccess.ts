import { UseCase } from '../../../core/domain/useCases/UseCase'
import { TermsOfAccess } from '../../../datasets/domain/models/Dataset'
import { ITemplatesRepository } from '../repositories/ITemplatesRepository'

export class UpdateTemplateTermsOfAccess implements UseCase<void> {
  private templatesRepository: ITemplatesRepository

  constructor(templatesRepository: ITemplatesRepository) {
    this.templatesRepository = templatesRepository
  }

  /**
   * Updates the terms of access for a template with the given identifier.
   *
   * @param {number} templateId - The unique identifier of the template to update.
   * @param {TermsOfAccess} termsOfAccess - The new terms of access to apply to the template.
   * @returns {Promise<void>} A promise that resolves when the terms of access have been updated.
   */
  async execute(templateId: number, termsOfAccess: TermsOfAccess): Promise<void> {
    return await this.templatesRepository.updateTemplateTermsOfAccess(templateId, termsOfAccess)
  }
}
