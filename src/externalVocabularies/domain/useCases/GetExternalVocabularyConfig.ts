import { UseCase } from '../../../core/domain/useCases/UseCase'
import { ExternalVocabularyConfig } from '../models/ExternalVocabularyConfig'
import { IExternalVocabulariesRepository } from '../repositories/IExternalVocabulariesRepository'

export class GetExternalVocabularyConfig implements UseCase<ExternalVocabularyConfig> {
  private externalVocabulariesRepository: IExternalVocabulariesRepository

  constructor(externalVocabulariesRepository: IExternalVocabulariesRepository) {
    this.externalVocabulariesRepository = externalVocabulariesRepository
  }

  async execute(fieldName: string): Promise<ExternalVocabularyConfig> {
    return await this.externalVocabulariesRepository.getExternalVocabularyConfig(fieldName)
  }
}
