import { UseCase } from '../../../core/domain/useCases/UseCase'
import { ExternalVocabularyTerm } from '../models/ExternalVocabularyTerm'
import { IExternalVocabulariesRepository } from '../repositories/IExternalVocabulariesRepository'

export class ResolveExternalVocabularyTerm implements UseCase<ExternalVocabularyTerm | null> {
  private externalVocabulariesRepository: IExternalVocabulariesRepository

  constructor(externalVocabulariesRepository: IExternalVocabulariesRepository) {
    this.externalVocabulariesRepository = externalVocabulariesRepository
  }

  async execute(
    fieldName: string,
    uri: string,
    language?: string
  ): Promise<ExternalVocabularyTerm | null> {
    return await this.externalVocabulariesRepository.resolveExternalVocabularyTerm(
      fieldName,
      uri,
      language
    )
  }
}
