export interface ExternalVocabularyTerm {
  uri: string
  label: string
  vocabularyName?: string
  vocabularyUri?: string
  source?: string
  mappedFields?: Record<string, unknown>
}
