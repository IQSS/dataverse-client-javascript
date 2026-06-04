import { UseCase } from '../../../core/domain/useCases/UseCase'
import { UpdateTemplateLicenseTermsDTO } from '../dtos/UpdateTemplateLicenseTermsDTO'
import { ITemplatesRepository } from '../repositories/ITemplatesRepository'

export class UpdateTemplateLicenseTerms implements UseCase<void> {
  private templatesRepository: ITemplatesRepository

  constructor(templatesRepository: ITemplatesRepository) {
    this.templatesRepository = templatesRepository
  }

  /**
   * Updates the license terms for a template with the given identifier.
   *
   * @param {number} templateId - The unique identifier of the template to update.
   * @param {UpdateTemplateLicenseTermsDTO} payload - The license terms data to apply to the template.
   * @returns {Promise<void>} A promise that resolves when the license terms have been updated.
   */
  async execute(templateId: number, payload: UpdateTemplateLicenseTermsDTO): Promise<void> {
    return await this.templatesRepository.updateTemplateLicenseTerms(templateId, payload)
  }
}
