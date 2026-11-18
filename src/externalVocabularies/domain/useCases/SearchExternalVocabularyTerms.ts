import { UseCase } from '../../../core/domain/useCases/UseCase'
import { ExternalVocabularyTerm } from '../models/ExternalVocabularyTerm'
import { IExternalVocabulariesRepository } from '../repositories/IExternalVocabulariesRepository'

export class SearchExternalVocabularyTerms implements UseCase<ExternalVocabularyTerm[]> {
  private externalVocabulariesRepository: IExternalVocabulariesRepository

  constructor(externalVocabulariesRepository: IExternalVocabulariesRepository) {
    this.externalVocabulariesRepository = externalVocabulariesRepository
  }

  async execute(
    fieldName: string,
    query: string,
    vocabulary?: string,
    language?: string
  ): Promise<ExternalVocabularyTerm[]> {
    return await this.externalVocabulariesRepository.searchExternalVocabularyTerms(
      fieldName,
      query,
      vocabulary,
      language
    )
  }
}
