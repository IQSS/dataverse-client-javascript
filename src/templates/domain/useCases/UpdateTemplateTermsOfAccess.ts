import { UseCase } from '../../../core/domain/useCases/UseCase'
import { TermsOfAccess } from '../../../datasets/domain/models/Dataset'
import { ITemplatesRepository } from '../repositories/ITemplatesRepository'

export class UpdateTemplateTermsOfAccess implements UseCase<void> {
  private templatesRepository: ITemplatesRepository

  constructor(templatesRepository: ITemplatesRepository) {
    this.templatesRepository = templatesRepository
  }

  async execute(templateId: number, termsOfAccess: TermsOfAccess): Promise<void> {
    return await this.templatesRepository.updateTemplateTermsOfAccess(templateId, termsOfAccess)
  }
}
