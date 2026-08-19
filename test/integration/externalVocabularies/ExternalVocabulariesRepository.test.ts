import axios, { AxiosResponse } from 'axios'
import { ApiConfig } from '../../../src'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import { ExternalVocabulariesRepository } from '../../../src/externalVocabularies/infra/repositories/ExternalVocabulariesRepository'
import { TestConstants } from '../../testHelpers/TestConstants'

describe('ExternalVocabulariesRepository', () => {
  const sut: ExternalVocabulariesRepository = new ExternalVocabulariesRepository()
  const fieldName = 'authorAffiliation'
  let previousCVocConf: string | undefined

  beforeAll(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )

    previousCVocConf = await getCVocConfViaApi()
    await setCVocConfViaApi(JSON.stringify(createIntegrationCVocConf()))
  })

  afterAll(async () => {
    if (previousCVocConf === undefined) {
      await deleteCVocConfViaApi()
      return
    }

    await setCVocConfViaApi(previousCVocConf)
  })

  test('should return configured external vocabularies', async () => {
    const actual = await sut.getConfiguredExternalVocabularies()

    expect(actual).toHaveLength(1)
    expect(actual[0]).toMatchObject({
      fieldName,
      termUriField: fieldName,
      protocol: 'integration-http-json',
      allowFreeText: true,
      vocabs: {
        dataverseVersion: {
          uriSpace: ''
        }
      },
      managedFields: {}
    })
  })

  test('should return external vocabulary config for a field', async () => {
    const actual = await sut.getExternalVocabularyConfig(fieldName)

    expect(actual.fieldName).toBe(fieldName)
    expect(actual.termUriField).toBe(fieldName)
    expect(actual.protocol).toBe('integration-http-json')
  })

  test('should search external vocabulary terms through the backend provider proxy', async () => {
    const actual = await sut.searchExternalVocabularyTerms(fieldName, 'version')

    expect(actual).toHaveLength(1)
    expect(actual[0].uri).toBeTruthy()
    expect(actual[0].label).toBe(actual[0].uri)
    expect(actual[0].source).toBe('integration-http-json')
    expect(actual[0].mappedFields).toMatchObject({
      termName: actual[0].label,
      scheme: 'DataverseVersion',
      '@type': 'https://schema.org/SoftwareApplication'
    })
  })

  test('should resolve an external vocabulary term through the backend provider proxy', async () => {
    const actual = await sut.resolveExternalVocabularyTerm(fieldName, 'ignored')

    expect(actual).not.toBeNull()
    expect(actual?.uri).toBeTruthy()
    expect(actual?.label).toBe(actual?.uri)
    expect(actual?.vocabularyName).toBe('Dataverse Version')
    expect(actual?.vocabularyUri).toBe('https://dataverse.org/')
    expect(actual?.mappedFields).toMatchObject({
      termName: actual?.label,
      scheme: 'DataverseVersion',
      '@type': 'https://schema.org/SoftwareApplication'
    })
  })

  test('should validate external vocabulary values', async () => {
    const actual = await sut.validateExternalVocabularyValue(fieldName, 'free text value')

    expect(actual).toBe(true)
  })
})

async function getCVocConfViaApi(): Promise<string | undefined> {
  return axios
    .get(`${TestConstants.TEST_API_URL}/admin/settings/:CVocConf`)
    .then((response: AxiosResponse<{ data: { message: string } }>) => response.data.data.message)
    .catch(() => undefined)
}

async function setCVocConfViaApi(cvocConf: string): Promise<AxiosResponse> {
  return axios.put(`${TestConstants.TEST_API_URL}/admin/settings/:CVocConf`, cvocConf, {
    headers: { 'Content-Type': 'text/plain' }
  })
}

async function deleteCVocConfViaApi(): Promise<AxiosResponse | void> {
  return axios
    .delete(`${TestConstants.TEST_API_URL}/admin/settings/:CVocConf`)
    .catch(() => undefined)
}

function createIntegrationCVocConf(): object[] {
  return [
    {
      'field-name': 'authorAffiliation',
      'term-uri-field': 'authorAffiliation',
      protocol: 'integration-http-json',
      'retrieval-uri': 'http://localhost:8080/api/info/version',
      'allow-free-text': true,
      'managed-fields': {},
      languages: '',
      vocabs: {
        dataverseVersion: {
          uriSpace: ''
        }
      },
      provider: {
        type: 'http-json',
        'search-uri': 'http://localhost:8080/api/info/version',
        'resolve-uri': 'http://localhost:8080/api/info/version',
        'results-path': '/data',
        'resolve-result-path': '/data',
        'uri-path': '/version',
        'label-path': '/version',
        'vocabulary-name': 'Dataverse Version',
        'vocabulary-uri': 'https://dataverse.org/',
        limit: 1
      },
      'retrieval-filtering': {
        termName: {
          pattern: '{0}',
          params: ['/version']
        },
        scheme: {
          pattern: 'DataverseVersion'
        },
        '@type': {
          pattern: 'https://schema.org/SoftwareApplication'
        }
      }
    }
  ]
}
