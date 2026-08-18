import { UseCase } from '../../../core/domain/useCases/UseCase'
import { ITemplatesRepository } from '../repositories/ITemplatesRepository'

export class DeleteTemplate implements UseCase<void> {
  private templatesRepository: ITemplatesRepository

  constructor(templatesRepository: ITemplatesRepository) {
    this.templatesRepository = templatesRepository
  }

  /**
   * Deletes a template by its template id.
   *
   * @param {number} templateId - Template id.
   */
  async execute(templateId: number): Promise<void> {
    return await this.templatesRepository.deleteTemplate(templateId)
  }
}
