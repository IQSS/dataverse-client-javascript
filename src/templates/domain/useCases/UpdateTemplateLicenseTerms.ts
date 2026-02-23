import { UseCase } from '../../../core/domain/useCases/UseCase'
import { UpdateTemplateLicenseTermsDTO } from '../dtos/UpdateTemplateLicenseTermsDTO'
import { ITemplatesRepository } from '../repositories/ITemplatesRepository'

export class UpdateTemplateLicenseTerms implements UseCase<void> {
  private templatesRepository: ITemplatesRepository

  constructor(templatesRepository: ITemplatesRepository) {
    this.templatesRepository = templatesRepository
  }

  async execute(templateId: number, payload: UpdateTemplateLicenseTermsDTO): Promise<void> {
    return await this.templatesRepository.updateTemplateLicenseTerms(templateId, payload)
  }
}
