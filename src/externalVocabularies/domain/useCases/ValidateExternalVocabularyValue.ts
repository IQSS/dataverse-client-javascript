import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IExternalVocabulariesRepository } from '../repositories/IExternalVocabulariesRepository'

export class ValidateExternalVocabularyValue implements UseCase<boolean> {
  private externalVocabulariesRepository: IExternalVocabulariesRepository

  constructor(externalVocabulariesRepository: IExternalVocabulariesRepository) {
    this.externalVocabulariesRepository = externalVocabulariesRepository
  }

  async execute(fieldName: string, value: string): Promise<boolean> {
    return await this.externalVocabulariesRepository.validateExternalVocabularyValue(
      fieldName,
      value
    )
  }
}
