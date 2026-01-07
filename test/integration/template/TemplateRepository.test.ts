import { ApiConfig, MetadataFieldTypeClass, WriteError } from '../../../src'
import { createDatasetTemplate, getDatasetTemplates } from '../../../src/template'
import { CreateDatasetTemplateDTO } from '../../../src/template/domain/dtos/CreateDatasetTemplateDTO'
import { TemplatesRepository } from '../../../src/template/infra/repositories/TemplatesRepository'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import { TestConstants } from '../../testHelpers/TestConstants'
import {
  createCollectionViaApi,
  deleteCollectionViaApi
} from '../../testHelpers/collections/collectionHelper'
import {
  createDatasetTemplateViaApi,
  deleteDatasetTemplateViaApi
} from '../../testHelpers/datasets/datasetTemplatesHelper'

describe('TemplatesRepository', () => {
  const sut: TemplatesRepository = new TemplatesRepository()
  const testCollectionAlias = 'testGetDatasetTemplates'

  beforeAll(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
    await createCollectionViaApi(testCollectionAlias)
  })

  afterAll(async () => {
    await deleteCollectionViaApi(testCollectionAlias)
  })

  describe('createDatasetTemplate', () => {
    const templateDto: CreateDatasetTemplateDTO = {
      name: 'CollectionsRepository template',
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

    test('should create a template in :root with provided JSON', async () => {
      await createDatasetTemplate.execute(templateDto)
      const templates = await getDatasetTemplates.execute(':root')

      expect(templates[templates.length - 1].name).toBe(templateDto.name)
      expect(templates[templates.length - 1].isDefault).toBe(templateDto.isDefault)
      expect(templates[templates.length - 1].instructions.length).toBe(
        templateDto.instructions?.length ?? 0
      )

      deleteDatasetTemplateViaApi(templates[templates.length - 1].id)
    })

    test('should return error when creating a template with invalidCollectionAlias', async () => {
      const expectedError = new WriteError(
        `[404] Can't find dataverse with identifier='invalidCollectionAlias'`
      )
      await expect(
        createDatasetTemplate.execute(templateDto, 'invalidCollectionAlias')
      ).rejects.toThrow(expectedError)
    })
  })

  describe('getDatasetTemplates', () => {
    test('should return the right number of dataset templates', async () => {
      const actual = await sut.getDatasetTemplates(testCollectionAlias)

      expect(actual.length).toBe(1)
    })

    test('should return dataset templates for a collection', async () => {
      const templateCreated = await createDatasetTemplateViaApi(testCollectionAlias)

      const actual = await sut.getDatasetTemplates(testCollectionAlias)

      expect(actual.length).toBe(1)

      expect(actual[0].name).toBe(templateCreated.name)
      expect(actual[0].isDefault).toBe(templateCreated.isDefault)
      expect(actual[0].datasetMetadataBlocks.length).toBe(1)
      expect(actual[0].datasetMetadataBlocks[0].name).toBe('citation')
      expect(actual[0].datasetMetadataBlocks[0].fields.author.length).toBe(1)
      expect(actual[0].instructions.length).toBe(templateCreated.instructions.length)

      await deleteDatasetTemplateViaApi(actual[0].id)
    })
  })
})
