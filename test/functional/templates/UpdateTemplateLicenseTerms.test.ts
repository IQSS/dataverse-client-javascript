import { ApiConfig } from '../../../src'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import { TestConstants } from '../../testHelpers/TestConstants'
import { getTemplatesByCollectionId, updateTemplateLicenseTerms } from '../../../src/templates'
import {
  createDatasetTemplateViaApi,
  deleteDatasetTemplateViaApi
} from '../../testHelpers/datasets/datasetTemplatesHelper'

describe('UpdateTemplateLicenseTerms.execute', () => {
  beforeEach(() => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
  })

  test('should update template terms of use using custom terms', async () => {
    const createdTemplate = await createDatasetTemplateViaApi(':root')

    expect(createdTemplate).toBeDefined()
    if (!createdTemplate) {
      throw new Error('Created template could not be found')
    }

    await updateTemplateLicenseTerms.execute(createdTemplate.id, {
      customTerms: {
        termsOfUse: 'Updated template terms of use'
      }
    })

    const updatedTemplates = await getTemplatesByCollectionId.execute(':root')
    const updatedTemplate = updatedTemplates.find((template) => template.id === createdTemplate.id)

    expect(updatedTemplate?.termsOfUse.customTerms?.termsOfUse).toBe(
      'Updated template terms of use'
    )

    await deleteDatasetTemplateViaApi(createdTemplate.id)
  })
})
