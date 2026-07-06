import { ApiConfig } from '../../../src'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import { TestConstants } from '../../testHelpers/TestConstants'
import { updateTemplateMetadata } from '../../../src/templates'
import { UpdateTemplateMetadataDTO } from '../../../src/templates/domain/dtos/UpdateTemplateMetadataDTO'
import { MetadataFieldTypeClass } from '../../../src/metadataBlocks/domain/models/MetadataBlock'
import { getTemplatesByCollectionId } from '../../../src/templates'
import {
  createDatasetTemplateViaApi,
  deleteDatasetTemplateViaApi
} from '../../testHelpers/datasets/datasetTemplatesHelper'

describe('UpdateTemplateMetadata.execute', () => {
  beforeEach(() => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
  })

  test('should update template name and instructions', async () => {
    const updatedTemplateName = `template-metadata-updated-${Date.now()}`

    const createdTemplate = await createDatasetTemplateViaApi(':root')

    expect(createdTemplate).toBeDefined()
    if (!createdTemplate) {
      throw new Error('Created template could not be found')
    }

    const updatePayload: UpdateTemplateMetadataDTO = {
      name: updatedTemplateName,
      fields: [
        {
          typeName: 'author',
          typeClass: MetadataFieldTypeClass.Compound,
          multiple: true,
          value: [
            {
              authorName: {
                typeName: 'authorName',
                typeClass: MetadataFieldTypeClass.Primitive,
                value: 'Kraffmiller, Ellen'
              },
              authorAffiliation: {
                typeName: 'authorIdentifierScheme',
                typeClass: MetadataFieldTypeClass.Primitive,
                value: 'ORCID'
              }
            }
          ]
        }
      ],
      instructions: [
        {
          instructionField: 'author',
          instructionText: 'Updated author instructions'
        }
      ]
    }

    await updateTemplateMetadata.execute(createdTemplate.id, updatePayload, true)

    const updatedTemplates = await getTemplatesByCollectionId.execute(':root')
    const updatedTemplate = updatedTemplates.find((template) => template.id === createdTemplate.id)

    expect(updatedTemplate?.name).toBe(updatedTemplateName)
    expect(updatedTemplate?.instructions).toContainEqual({
      instructionField: 'author',
      instructionText: 'Updated author instructions'
    })

    await deleteDatasetTemplateViaApi(createdTemplate.id)
  })
})
