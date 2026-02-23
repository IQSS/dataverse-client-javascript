import { UseCase } from '../../../core/domain/useCases/UseCase'
import { UpdateTemplateMetadataDTO } from '../dtos/UpdateTemplateMetadataDTO'
import { ITemplatesRepository } from '../repositories/ITemplatesRepository'

export class UpdateTemplateMetadata implements UseCase<void> {
  private templatesRepository: ITemplatesRepository

  constructor(templatesRepository: ITemplatesRepository) {
    this.templatesRepository = templatesRepository
  }

  async execute(
    templateId: number,
    payload: UpdateTemplateMetadataDTO,
    replace = false
  ): Promise<void> {
    return await this.templatesRepository.updateTemplateMetadata(templateId, payload, replace)
  }
}
