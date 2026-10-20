import { ReadError } from '../../../src'
import { IExternalVocabulariesRepository } from '../../../src/externalVocabularies/domain/repositories/IExternalVocabulariesRepository'
import { GetConfiguredExternalVocabularies } from '../../../src/externalVocabularies/domain/useCases/GetConfiguredExternalVocabularies'
import { GetExternalVocabularyConfig } from '../../../src/externalVocabularies/domain/useCases/GetExternalVocabularyConfig'
import { ResolveExternalVocabularyTerm } from '../../../src/externalVocabularies/domain/useCases/ResolveExternalVocabularyTerm'
import { SearchExternalVocabularyTerms } from '../../../src/externalVocabularies/domain/useCases/SearchExternalVocabularyTerms'
import { ValidateExternalVocabularyValue } from '../../../src/externalVocabularies/domain/useCases/ValidateExternalVocabularyValue'
import {
  createExternalVocabularyConfig,
  createExternalVocabularyTerm
} from '../../testHelpers/externalVocabularies/externalVocabularyHelper'

describe('external vocabulary use cases', () => {
  test('GetConfiguredExternalVocabularies returns repository result', async () => {
    const repository: IExternalVocabulariesRepository = {} as IExternalVocabulariesRepository
    const configs = [createExternalVocabularyConfig()]
    repository.getConfiguredExternalVocabularies = jest.fn().mockResolvedValue(configs)

    const actual = await new GetConfiguredExternalVocabularies(repository).execute()

    expect(actual).toEqual(configs)
  })

  test('GetExternalVocabularyConfig returns repository result', async () => {
    const repository: IExternalVocabulariesRepository = {} as IExternalVocabulariesRepository
    const config = createExternalVocabularyConfig()
    repository.getExternalVocabularyConfig = jest.fn().mockResolvedValue(config)

    const actual = await new GetExternalVocabularyConfig(repository).execute('authorAffiliation')

    expect(repository.getExternalVocabularyConfig).toHaveBeenCalledWith('authorAffiliation')
    expect(actual).toEqual(config)
  })

  test('SearchExternalVocabularyTerms returns repository result', async () => {
    const repository: IExternalVocabulariesRepository = {} as IExternalVocabulariesRepository
    const terms = [createExternalVocabularyTerm()]
    repository.searchExternalVocabularyTerms = jest.fn().mockResolvedValue(terms)

    const actual = await new SearchExternalVocabularyTerms(repository).execute(
      'authorAffiliation',
      'harvard',
      'ror',
      'en'
    )

    expect(repository.searchExternalVocabularyTerms).toHaveBeenCalledWith(
      'authorAffiliation',
      'harvard',
      'ror',
      'en'
    )
    expect(actual).toEqual(terms)
  })

  test('ResolveExternalVocabularyTerm returns repository result', async () => {
    const repository: IExternalVocabulariesRepository = {} as IExternalVocabulariesRepository
    const term = createExternalVocabularyTerm()
    repository.resolveExternalVocabularyTerm = jest.fn().mockResolvedValue(term)

    const actual = await new ResolveExternalVocabularyTerm(repository).execute(
      'authorAffiliation',
      term.uri,
      'en'
    )

    expect(repository.resolveExternalVocabularyTerm).toHaveBeenCalledWith(
      'authorAffiliation',
      term.uri,
      'en'
    )
    expect(actual).toEqual(term)
  })

  test('ValidateExternalVocabularyValue returns repository result', async () => {
    const repository: IExternalVocabulariesRepository = {} as IExternalVocabulariesRepository
    repository.validateExternalVocabularyValue = jest.fn().mockResolvedValue(true)

    const actual = await new ValidateExternalVocabularyValue(repository).execute(
      'authorAffiliation',
      'https://ror.org/03vek6s52'
    )

    expect(repository.validateExternalVocabularyValue).toHaveBeenCalledWith(
      'authorAffiliation',
      'https://ror.org/03vek6s52'
    )
    expect(actual).toBe(true)
  })

  test('use cases propagate repository errors', async () => {
    const repository: IExternalVocabulariesRepository = {} as IExternalVocabulariesRepository
    repository.getConfiguredExternalVocabularies = jest.fn().mockRejectedValue(new ReadError())

    await expect(new GetConfiguredExternalVocabularies(repository).execute()).rejects.toThrow(
      ReadError
    )
  })
})
