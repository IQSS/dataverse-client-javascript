import { ApiConfig } from '../../../src'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import { TestConstants } from '../../testHelpers/TestConstants'
import {
  createTemplate,
  getTemplatesByCollectionId,
  setTemplateAsDefault
} from '../../../src/templates'
import { CreateTemplateDTO } from '../../../src/templates/domain/dtos/CreateTemplateDTO'
import { MetadataFieldTypeClass } from '../../../src/metadataBlocks/domain/models/MetadataBlock'
import { deleteDatasetTemplateViaApi } from '../../testHelpers/datasets/datasetTemplatesHelper'
import {
  createCollectionViaApi,
  deleteCollectionViaApi
} from '../../testHelpers/collections/collectionHelper'

describe('SetTemplateAsDefault.execute', () => {
  beforeEach(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
  })

  test('should set the default template for a collection', async () => {
    const templateName = `TestDefaultTemplate-${Date.now()}`
    const collectionIdOrAlias = `setTemplateDefault${Date.now()}`
    const templateDto: CreateTemplateDTO = {
      name: templateName,
      isDefault: false,
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
                value: 'Belicheck, Bill'
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
          instructionText: 'The author data'
        }
      ]
    }

    let createdTemplateId: number | undefined
    let collectionCreated = false

    try {
      await createCollectionViaApi(collectionIdOrAlias)
      collectionCreated = true
      await createTemplate.execute(templateDto, collectionIdOrAlias)
      const templatesAfterCreate = await getTemplatesByCollectionId.execute(collectionIdOrAlias)
      const createdTemplate = templatesAfterCreate.find(
        (template) => template.name === templateName
      )

      if (!createdTemplate) {
        throw new Error('Created template was not found in collection templates.')
      }

      createdTemplateId = createdTemplate.id

      await setTemplateAsDefault.execute(createdTemplate.id, collectionIdOrAlias)

      const templatesAfterSet = await getTemplatesByCollectionId.execute(collectionIdOrAlias)
      const updatedTemplate = templatesAfterSet.find(
        (template) => template.id === createdTemplate.id
      )

      expect(updatedTemplate?.isDefault).toBe(true)
    } finally {
      if (createdTemplateId !== undefined) {
        await deleteDatasetTemplateViaApi(createdTemplateId)
      }
      if (collectionCreated) {
        await deleteCollectionViaApi(collectionIdOrAlias)
      }
    }
  })
})
