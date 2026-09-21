export type ExternalVocabularyJsonValue =
  | string
  | number
  | boolean
  | null
  | ExternalVocabularyJsonValue[]
  | { [key: string]: ExternalVocabularyJsonValue }

export type ExternalVocabularyPathConfig = string | string[]

export interface ExternalVocabularyConfig {
  fieldName: string
  termUriField: string
  protocol: string
  allowFreeText: boolean
  languages: string
  termParentUri?: string
  vocabs: Record<string, ExternalVocabularyVocabConfig>
  managedFields: Record<string, string>
  provider?: ExternalVocabularyProviderConfig
  headers?: Record<string, string>
  prefix?: string
  'retrieval-uri'?: string
  'retrieval-filtering'?: ExternalVocabularyRetrievalFilteringConfig
  'search-uri'?: string
  'search-url'?: string
  'resolve-uri'?: string
  'resolve-url'?: string
  'results-path'?: string
  'resolve-result-path'?: string
  'uri-path'?: ExternalVocabularyPathConfig
  'label-path'?: ExternalVocabularyPathConfig
  'vocabulary-name'?: string
  'vocabulary-name-path'?: ExternalVocabularyPathConfig
  'vocabulary-uri'?: string
  'vocabulary-uri-path'?: ExternalVocabularyPathConfig
  limit?: number
}

export interface ExternalVocabularyVocabConfig {
  uriSpace: string
  vocabularyUri?: string
}

export interface ExternalVocabularyProviderConfig {
  type?: 'http-json' | string
  'search-uri'?: string
  'search-url'?: string
  'resolve-uri'?: string
  'resolve-url'?: string
  'results-path'?: string
  'resolve-result-path'?: string
  'uri-path'?: ExternalVocabularyPathConfig
  'label-path'?: ExternalVocabularyPathConfig
  'vocabulary-name'?: string
  'vocabulary-name-path'?: ExternalVocabularyPathConfig
  'vocabulary-uri'?: string
  'vocabulary-uri-path'?: ExternalVocabularyPathConfig
  limit?: number
  [key: string]: ExternalVocabularyJsonValue | undefined
}

export interface ExternalVocabularyRetrievalFilteringConfig {
  '@context'?: Record<string, ExternalVocabularyJsonValue>
  [fieldName: string]:
    | ExternalVocabularyRetrievalFilterConfig
    | Record<string, ExternalVocabularyJsonValue>
    | undefined
}

export interface ExternalVocabularyRetrievalFilterConfig {
  pattern: string
  params?: string[]
}
