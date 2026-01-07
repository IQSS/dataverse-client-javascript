import { UseCase } from '../../../core/domain/useCases/UseCase'
import { DatasetTemplate } from '../models/DatasetTemplate'
import { ITemplatesRepository } from '../repositories/ITemplatesRepository'

export class GetTemplate implements UseCase<DatasetTemplate> {
  private templatesRepository: ITemplatesRepository

  constructor(templatesRepository: ITemplatesRepository) {
    this.templatesRepository = templatesRepository
  }

  /**
   * Returns a dataset template by its template id.
   *
   * @param {number} templateId - Dataset template id.
   * @returns {Promise<DatasetTemplate>}
   */
  async execute(templateId: number): Promise<DatasetTemplate> {
    return await this.templatesRepository.getTemplate(templateId)
  }
}
