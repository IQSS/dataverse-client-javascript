import { ExternalVocabularyConfig } from '../models/ExternalVocabularyConfig'
import { ExternalVocabularyTerm } from '../models/ExternalVocabularyTerm'

export interface IExternalVocabulariesRepository {
  getConfiguredExternalVocabularies(): Promise<ExternalVocabularyConfig[]>
  getExternalVocabularyConfig(fieldName: string): Promise<ExternalVocabularyConfig>
  searchExternalVocabularyTerms(
    fieldName: string,
    query: string,
    vocabulary?: string,
    language?: string
  ): Promise<ExternalVocabularyTerm[]>
  resolveExternalVocabularyTerm(
    fieldName: string,
    uri: string,
    language?: string
  ): Promise<ExternalVocabularyTerm | null>
  validateExternalVocabularyValue(fieldName: string, value: string): Promise<boolean>
}
