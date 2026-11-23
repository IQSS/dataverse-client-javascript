import { ExternalVocabularyConfig } from '../../../src/externalVocabularies/domain/models/ExternalVocabularyConfig'
import { ExternalVocabularyTerm } from '../../../src/externalVocabularies/domain/models/ExternalVocabularyTerm'

export const createExternalVocabularyConfig = (
  fieldName = 'authorAffiliation'
): ExternalVocabularyConfig => ({
  fieldName,
  termUriField: fieldName,
  protocol: 'ror',
  allowFreeText: true,
  languages: '',
  vocabs: {
    ror: {
      uriSpace: 'https://ror.org/',
      vocabularyUri: 'https://ror.org/'
    }
  },
  managedFields: {},
  provider: {
    type: 'http-json',
    'search-uri': 'https://api.ror.org/organizations?query={encodeUrl:query}',
    'resolve-uri': 'https://api.ror.org/organizations/{encodeUrl:termId}',
    'results-path': '/items/*',
    'uri-path': '/id',
    'label-path': '/names/types=ror_display/value',
    'vocabulary-name': 'ROR',
    'vocabulary-uri': 'https://ror.org/',
    limit: 10
  },
  'retrieval-filtering': {
    termName: {
      pattern: '{0}',
      params: ['/names/types=ror_display/value']
    },
    '@type': {
      pattern: 'https://schema.org/Organization'
    }
  }
})

export const createExternalVocabularyTerm = (): ExternalVocabularyTerm => ({
  uri: 'https://ror.org/03vek6s52',
  label: 'Harvard University',
  vocabularyName: 'ROR',
  vocabularyUri: 'https://ror.org/',
  source: 'ror',
  mappedFields: {
    termName: 'Harvard University',
    '@type': 'https://schema.org/Organization'
  }
})
