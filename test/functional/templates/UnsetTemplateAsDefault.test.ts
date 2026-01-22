import { ApiConfig } from '../../../src'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import { TestConstants } from '../../testHelpers/TestConstants'
import {
  createTemplate,
  getTemplatesByCollectionId,
  setTemplateAsDefault,
  unsetTemplateAsDefault
} from '../../../src/templates'
import { CreateTemplateDTO } from '../../../src/templates/domain/dtos/CreateTemplateDTO'
import { MetadataFieldTypeClass } from '../../../src/metadataBlocks/domain/models/MetadataBlock'
import { deleteDatasetTemplateViaApi } from '../../testHelpers/datasets/datasetTemplatesHelper'

describe('UnsetTemplateAsDefault.execute', () => {
  const collectionIdOrAlias = ':root'

  beforeEach(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
  })

  test('should remove the default template from a collection', async () => {
    const templateName = `TestUnsetTemplateAsDefault-${Date.now()}`
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

    await createTemplate.execute(templateDto, collectionIdOrAlias)
    const templatesAfterCreate = await getTemplatesByCollectionId.execute(collectionIdOrAlias)
    const createdTemplate = templatesAfterCreate.find((template) => template.name === templateName)

    if (!createdTemplate) {
      throw new Error('Created template was not found in collection templates.')
    }

    await setTemplateAsDefault.execute(createdTemplate.id, collectionIdOrAlias)
    await unsetTemplateAsDefault.execute(collectionIdOrAlias)

    const templatesAfterRemove = await getTemplatesByCollectionId.execute(collectionIdOrAlias)
    const hasDefaultTemplate = templatesAfterRemove.some((template) => template.isDefault)

    expect(hasDefaultTemplate).toBe(false)

    await deleteDatasetTemplateViaApi(createdTemplate.id)
  })
})
