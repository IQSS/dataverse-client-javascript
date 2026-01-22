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

describe('SetTemplateAsDefault.execute', () => {
  const collectionIdOrAlias = ':root'

  beforeEach(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
  })

  test('should set the default template for a collection', async () => {
    const templateName = `TestDefaultTemplate-${Date.now()}`
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

    const templatesBefore = await getTemplatesByCollectionId.execute(collectionIdOrAlias)
    const originalDefaultTemplateId =
      templatesBefore.find((template) => template.isDefault)?.id ?? null

    await createTemplate.execute(templateDto, collectionIdOrAlias)
    const templatesAfterCreate = await getTemplatesByCollectionId.execute(collectionIdOrAlias)
    const createdTemplate = templatesAfterCreate.find((template) => template.name === templateName)

    if (!createdTemplate) {
      throw new Error('Created template was not found in collection templates.')
    }

    await setTemplateAsDefault.execute(createdTemplate.id, collectionIdOrAlias)

    const templatesAfterSet = await getTemplatesByCollectionId.execute(collectionIdOrAlias)
    const updatedTemplate = templatesAfterSet.find((template) => template.id === createdTemplate.id)

    expect(updatedTemplate?.isDefault).toBe(true)

    if (originalDefaultTemplateId && originalDefaultTemplateId !== createdTemplate.id) {
      await setTemplateAsDefault.execute(originalDefaultTemplateId, collectionIdOrAlias)
    } else if (!originalDefaultTemplateId) {
      await unsetTemplateAsDefault.execute(collectionIdOrAlias)
    }

    await deleteDatasetTemplateViaApi(createdTemplate.id)
  })
})
