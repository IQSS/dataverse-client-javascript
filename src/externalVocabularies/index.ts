import { GetConfiguredExternalVocabularies } from './domain/useCases/GetConfiguredExternalVocabularies'
import { GetExternalVocabularyConfig } from './domain/useCases/GetExternalVocabularyConfig'
import { ResolveExternalVocabularyTerm } from './domain/useCases/ResolveExternalVocabularyTerm'
import { SearchExternalVocabularyTerms } from './domain/useCases/SearchExternalVocabularyTerms'
import { ValidateExternalVocabularyValue } from './domain/useCases/ValidateExternalVocabularyValue'
import { ExternalVocabulariesRepository } from './infra/repositories/ExternalVocabulariesRepository'

const externalVocabulariesRepository = new ExternalVocabulariesRepository()

const getConfiguredExternalVocabularies = new GetConfiguredExternalVocabularies(
  externalVocabulariesRepository
)
const getExternalVocabularyConfig = new GetExternalVocabularyConfig(externalVocabulariesRepository)
const searchExternalVocabularyTerms = new SearchExternalVocabularyTerms(
  externalVocabulariesRepository
)
const resolveExternalVocabularyTerm = new ResolveExternalVocabularyTerm(
  externalVocabulariesRepository
)
const validateExternalVocabularyValue = new ValidateExternalVocabularyValue(
  externalVocabulariesRepository
)

export {
  getConfiguredExternalVocabularies,
  getExternalVocabularyConfig,
  searchExternalVocabularyTerms,
  resolveExternalVocabularyTerm,
  validateExternalVocabularyValue
}

export { ExternalVocabularyConfig } from './domain/models/ExternalVocabularyConfig'
export { ExternalVocabularyTerm } from './domain/models/ExternalVocabularyTerm'
