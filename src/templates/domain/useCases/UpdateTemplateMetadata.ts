import { UseCase } from '../../../core/domain/useCases/UseCase'
import { UpdateTemplateMetadataDTO } from '../dtos/UpdateTemplateMetadataDTO'
import { ITemplatesRepository } from '../repositories/ITemplatesRepository'

export class UpdateTemplateMetadata implements UseCase<void> {
  private templatesRepository: ITemplatesRepository

  constructor(templatesRepository: ITemplatesRepository) {
    this.templatesRepository = templatesRepository
  }
  /**
   * Updates the metadata for a template with the given identifier.
   *
   * @param {number} templateId - The unique identifier of the template to update.
   * @param {UpdateTemplateMetadataDTO} payload - The metadata to apply to the template.
   * @returns {Promise<void>} A promise that resolves when the metadata has been updated.
   */
  async execute(
    templateId: number,
    payload: UpdateTemplateMetadataDTO,
    replace = false
  ): Promise<void> {
    return await this.templatesRepository.updateTemplateMetadata(templateId, payload, replace)
  }
}
