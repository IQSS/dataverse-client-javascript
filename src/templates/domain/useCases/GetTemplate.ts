import { UseCase } from '../../../core/domain/useCases/UseCase'
import { Template } from '../models/Template'
import { ITemplatesRepository } from '../repositories/ITemplatesRepository'

export class GetTemplate implements UseCase<Template> {
  private templatesRepository: ITemplatesRepository

  constructor(templatesRepository: ITemplatesRepository) {
    this.templatesRepository = templatesRepository
  }

  /**
   * Returns a template by its template id.
   *
   * @param {number} templateId - Template id.
   * @returns {Promise<Template>}
   */
  async execute(templateId: number): Promise<Template> {
    return await this.templatesRepository.getTemplate(templateId)
  }
}
