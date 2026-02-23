import axios from 'axios'
import { TestConstants } from '../../testHelpers/TestConstants'
import {
  ApiConfig,
  DataverseApiAuthMechanism
} from '../../../src/core/infra/repositories/ApiConfig'
import { TemplatesRepository } from '../../../src/templates/infra/repositories/TemplatesRepository'
import { MetadataFieldTypeClass } from '../../../src/metadataBlocks/domain/models/MetadataBlock'
import { TermsOfAccess } from '../../../src/datasets/domain/models/Dataset'
import { UpdateTemplateMetadataDTO } from '../../../src/templates/domain/dtos/UpdateTemplateMetadataDTO'
import { UpdateTemplateLicenseTermsDTO } from '../../../src/templates/domain/dtos/UpdateTemplateLicenseTermsDTO'
import { WriteError } from '../../../src'

describe('TemplatesRepository template update endpoints', () => {
  const sut = new TemplatesRepository()
  const testTemplateId = 42

  beforeEach(() => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      TestConstants.TEST_DUMMY_API_KEY
    )

    jest.clearAllMocks()
  })

  test('updateTemplateMetadata should call PUT /dataverses/{templateId}/metadata', async () => {
    const payload: UpdateTemplateMetadataDTO = {
      name: 'updated template',
      fields: [
        {
          typeName: 'author',
          multiple: true,
          typeClass: MetadataFieldTypeClass.Compound
        }
      ],
      instructions: [{ instructionField: 'author', instructionText: 'updated instruction' }]
    }
    const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/dataverses/${testTemplateId}/metadata`
    const expectedRequestConfigApiKey = {
      params: { replace: true },
      headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY.headers
    }

    jest.spyOn(axios, 'put').mockResolvedValue({ data: {} })

    await sut.updateTemplateMetadata(testTemplateId, payload, true)

    expect(axios.put).toHaveBeenCalledWith(
      expectedApiEndpoint,
      JSON.stringify(payload),
      expectedRequestConfigApiKey
    )
  })

  test('updateTemplateLicenseTerms should call PUT /dataverses/{templateId}/licenseTerms', async () => {
    const payload: UpdateTemplateLicenseTermsDTO = {
      customTerms: {
        termsOfUse: 'updated terms of use'
      }
    }
    const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/dataverses/${testTemplateId}/licenseTerms`

    jest.spyOn(axios, 'put').mockResolvedValue({ data: {} })

    await sut.updateTemplateLicenseTerms(testTemplateId, payload)

    expect(axios.put).toHaveBeenCalledWith(
      expectedApiEndpoint,
      JSON.stringify(payload),
      TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
    )
  })

  test('updateTemplateTermsOfAccess should call PUT /dataverses/{templateId}/access', async () => {
    const payload: TermsOfAccess = {
      fileAccessRequest: false,
      termsOfAccessForRestrictedFiles: 'restricted access terms',
      dataAccessPlace: 'data access place',
      originalArchive: 'original archive',
      availabilityStatus: 'availability status',
      contactForAccess: 'contact for access',
      sizeOfCollection: 'collection size',
      studyCompletion: 'study completion'
    }
    const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/dataverses/${testTemplateId}/access`
    const expectedRequestPayload = {
      customTermsOfAccess: {
        fileAccessRequest: false,
        termsOfAccess: 'restricted access terms',
        dataAccessPlace: 'data access place',
        originalArchive: 'original archive',
        availabilityStatus: 'availability status',
        contactForAccess: 'contact for access',
        sizeOfCollection: 'collection size',
        studyCompletion: 'study completion'
      }
    }

    jest.spyOn(axios, 'put').mockResolvedValue({ data: {} })

    await sut.updateTemplateTermsOfAccess(testTemplateId, payload)

    expect(axios.put).toHaveBeenCalledWith(
      expectedApiEndpoint,
      JSON.stringify(expectedRequestPayload),
      TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY
    )
  })

  test('updateTemplateMetadata should throw WriteError on repository error', async () => {
    jest.spyOn(axios, 'put').mockRejectedValue(TestConstants.TEST_ERROR_RESPONSE)
    const payload = { name: 'updated template' } as UpdateTemplateMetadataDTO

    await expect(sut.updateTemplateMetadata(testTemplateId, payload)).rejects.toThrow(WriteError)
  })
})
