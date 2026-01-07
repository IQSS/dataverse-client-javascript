import { ApiConfig } from '../../../src'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import { TestConstants } from '../../testHelpers/TestConstants'
import { createDatasetTemplate, getDatasetTemplates } from '../../../src/template'
import { CreateDatasetTemplateDTO } from '../../../src/template/domain/dtos/CreateDatasetTemplateDTO'
import { MetadataFieldTypeClass } from '../../../src/metadataBlocks/domain/models/MetadataBlock'
import { deleteDatasetTemplateViaApi } from '../../testHelpers/datasets/datasetTemplatesHelper'

describe('CreateTemplate.execute', () => {
  beforeEach(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
  })

  test('should create a template in :root with provided JSON', async () => {
    const templateDto: CreateDatasetTemplateDTO = {
      name: 'TestDataverse template',
      isDefault: true,
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
    await createDatasetTemplate.execute(templateDto)
    const templates = await getDatasetTemplates.execute(':root')

    expect(templates[templates.length - 1].name).toBe(templateDto.name)
    expect(templates[templates.length - 1].isDefault).toBe(templateDto.isDefault)
    expect(templates[templates.length - 1].instructions.length).toBe(
      templateDto.instructions?.length ?? 0
    )

    deleteDatasetTemplateViaApi(templates[templates.length - 1].id)
  })
})
