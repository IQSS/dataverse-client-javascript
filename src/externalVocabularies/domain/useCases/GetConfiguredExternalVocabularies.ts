import { UseCase } from '../../../core/domain/useCases/UseCase'
import { ExternalVocabularyConfig } from '../models/ExternalVocabularyConfig'
import { IExternalVocabulariesRepository } from '../repositories/IExternalVocabulariesRepository'

export class GetConfiguredExternalVocabularies implements UseCase<ExternalVocabularyConfig[]> {
  private externalVocabulariesRepository: IExternalVocabulariesRepository

  constructor(externalVocabulariesRepository: IExternalVocabulariesRepository) {
    this.externalVocabulariesRepository = externalVocabulariesRepository
  }

  async execute(): Promise<ExternalVocabularyConfig[]> {
    return await this.externalVocabulariesRepository.getConfiguredExternalVocabularies()
  }
}
