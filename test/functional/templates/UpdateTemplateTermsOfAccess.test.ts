import { ApiConfig } from '../../../src'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import { TestConstants } from '../../testHelpers/TestConstants'
import { getTemplatesByCollectionId, updateTemplateTermsOfAccess } from '../../../src/templates'
import {
  createDatasetTemplateViaApi,
  deleteDatasetTemplateViaApi
} from '../../testHelpers/datasets/datasetTemplatesHelper'

describe('UpdateTemplateTermsOfAccess.execute', () => {
  beforeEach(() => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
  })

  test('should update template terms of access', async () => {
    const createdTemplate = await createDatasetTemplateViaApi(':root')

    expect(createdTemplate).toBeDefined()
    if (!createdTemplate) {
      throw new Error('Created template could not be found')
    }

    await updateTemplateTermsOfAccess.execute(createdTemplate.id, {
      fileAccessRequest: true,
      termsOfAccessForRestrictedFiles: 'Restricted access only'
    })

    const updatedTemplates = await getTemplatesByCollectionId.execute(':root')
    const updatedTemplate = updatedTemplates.find((template) => template.id === createdTemplate.id)

    expect(updatedTemplate?.termsOfUse.termsOfAccess.fileAccessRequest).toBe(true)
    expect(updatedTemplate?.termsOfUse.termsOfAccess.termsOfAccessForRestrictedFiles).toBe(
      'Restricted access only'
    )

    await deleteDatasetTemplateViaApi(createdTemplate.id)
  })
})
