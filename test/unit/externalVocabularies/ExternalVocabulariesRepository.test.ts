import axios from 'axios'
import {
  ApiConfig,
  DataverseApiAuthMechanism
} from '../../../src/core/infra/repositories/ApiConfig'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'
import { ExternalVocabulariesRepository } from '../../../src/externalVocabularies/infra/repositories/ExternalVocabulariesRepository'
import { TestConstants } from '../../testHelpers/TestConstants'
import {
  createExternalVocabularyConfig,
  createExternalVocabularyTerm
} from '../../testHelpers/externalVocabularies/externalVocabularyHelper'

describe('ExternalVocabulariesRepository', () => {
  const sut: ExternalVocabulariesRepository = new ExternalVocabulariesRepository()
  const fieldName = 'authorAffiliation'

  beforeEach(() => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      TestConstants.TEST_DUMMY_API_KEY
    )
  })

  describe('getConfiguredExternalVocabularies', () => {
    test('should return configured external vocabularies on successful response', async () => {
      const configs = [createExternalVocabularyConfig()]
      jest.spyOn(axios, 'get').mockResolvedValue({
        data: {
          status: 'OK',
          data: configs
        }
      })

      const actual = await sut.getConfiguredExternalVocabularies()

      expect(axios.get).toHaveBeenCalledWith(
        `${TestConstants.TEST_API_URL}/external-vocabularies`,
        TestConstants.TEST_EXPECTED_UNAUTHENTICATED_REQUEST_CONFIG
      )
      expect(actual).toEqual(configs)
    })
  })

  describe('getExternalVocabularyConfig', () => {
    test('should return configured external vocabulary for field on successful response', async () => {
      const config = createExternalVocabularyConfig()
      jest.spyOn(axios, 'get').mockResolvedValue({
        data: {
          status: 'OK',
          data: config
        }
      })

      const actual = await sut.getExternalVocabularyConfig(fieldName)

      expect(axios.get).toHaveBeenCalledWith(
        `${TestConstants.TEST_API_URL}/external-vocabularies/${fieldName}`,
        TestConstants.TEST_EXPECTED_UNAUTHENTICATED_REQUEST_CONFIG
      )
      expect(actual).toEqual(config)
    })
  })

  describe('searchExternalVocabularyTerms', () => {
    test('should return external vocabulary terms on successful response', async () => {
      const terms = [createExternalVocabularyTerm()]
      jest.spyOn(axios, 'get').mockResolvedValue({
        data: {
          status: 'OK',
          data: terms
        }
      })

      const actual = await sut.searchExternalVocabularyTerms(fieldName, 'harvard', 'ror', 'en')

      expect(axios.get).toHaveBeenCalledWith(
        `${TestConstants.TEST_API_URL}/external-vocabularies/${fieldName}/search`,
        {
          params: {
            q: 'harvard',
            vocabulary: 'ror',
            language: 'en'
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      expect(actual).toEqual(terms)
    })

    test('should omit optional vocabulary and language query params', async () => {
      jest.spyOn(axios, 'get').mockResolvedValue({
        data: {
          status: 'OK',
          data: []
        }
      })

      await sut.searchExternalVocabularyTerms(fieldName, 'harvard')

      expect(axios.get).toHaveBeenCalledWith(
        `${TestConstants.TEST_API_URL}/external-vocabularies/${fieldName}/search`,
        {
          params: {
            q: 'harvard'
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    })
  })

  describe('resolveExternalVocabularyTerm', () => {
    test('should return external vocabulary term on successful response', async () => {
      const term = createExternalVocabularyTerm()
      jest.spyOn(axios, 'get').mockResolvedValue({
        data: {
          status: 'OK',
          data: term
        }
      })

      const actual = await sut.resolveExternalVocabularyTerm(fieldName, term.uri, 'en')

      expect(axios.get).toHaveBeenCalledWith(
        `${TestConstants.TEST_API_URL}/external-vocabularies/${fieldName}/resolve`,
        {
          params: {
            uri: term.uri,
            language: 'en'
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      expect(actual).toEqual(term)
    })
  })

  describe('validateExternalVocabularyValue', () => {
    test('should return validation result on successful response', async () => {
      jest.spyOn(axios, 'get').mockResolvedValue({
        data: {
          status: 'OK',
          data: {
            valid: true
          }
        }
      })

      const actual = await sut.validateExternalVocabularyValue(
        fieldName,
        'https://ror.org/03vek6s52'
      )

      expect(axios.get).toHaveBeenCalledWith(
        `${TestConstants.TEST_API_URL}/external-vocabularies/${fieldName}/validate`,
        {
          params: {
            value: 'https://ror.org/03vek6s52'
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      expect(actual).toBe(true)
    })
  })

  test('should throw ReadError on error response', async () => {
    jest.spyOn(axios, 'get').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)

    await expect(sut.getConfiguredExternalVocabularies()).rejects.toThrow(ReadError)
  })
})
