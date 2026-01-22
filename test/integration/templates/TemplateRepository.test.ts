import { ApiConfig, MetadataFieldTypeClass, WriteError } from '../../../src'
import { createTemplate, getTemplatesByCollectionId } from '../../../src/templates'
import { CreateTemplateDTO } from '../../../src/templates/domain/dtos/CreateTemplateDTO'
import { TemplatesRepository } from '../../../src/templates/infra/repositories/TemplatesRepository'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import { TestConstants } from '../../testHelpers/TestConstants'
import {
  createCollectionViaApi,
  deleteCollectionViaApi
} from '../../testHelpers/collections/collectionHelper'
import { deleteDatasetTemplateViaApi } from '../../testHelpers/datasets/datasetTemplatesHelper'

describe('TemplatesRepository', () => {
  const sut: TemplatesRepository = new TemplatesRepository()
  const testCollectionAlias = 'testGetTemplatesByCollectionId'

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

  describe('createTemplate', () => {
    const templateDto: CreateTemplateDTO = {
      name: 'CollectionsRepository template',
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

    test('should create a template in :root with provided JSON', async () => {
      await createTemplate.execute(templateDto)
      const templates = await getTemplatesByCollectionId.execute(':root')

      expect(templates[templates.length - 1].name).toBe(templateDto.name)
      expect(templates[templates.length - 1].isDefault).toBe(templateDto.isDefault)
      expect(templates[templates.length - 1].instructions.length).toBe(
        templateDto.instructions?.length ?? 0
      )

      await deleteDatasetTemplateViaApi(templates[templates.length - 1].id)
    })

    test('should return error when creating a template with invalidCollectionAlias', async () => {
      const expectedError = new WriteError(
        `[404] Can't find dataverse with identifier='invalidCollectionAlias'`
      )
      await expect(createTemplate.execute(templateDto, 'invalidCollectionAlias')).rejects.toThrow(
        expectedError
      )
    })
  })

  describe('getTemplatesByCollectionId', () => {
    test('should return empty templates', async () => {
      const actual = await sut.getTemplatesByCollectionId(testCollectionAlias)

      expect(actual.length).toBe(0)
    })

    test('should return templates for a collection', async () => {
      await createTemplate.execute(
        {
          name: 'Template for GetTemplatesByCollectionId',
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
        },
        testCollectionAlias
      )

      const actual = await sut.getTemplatesByCollectionId(testCollectionAlias)

      expect(actual.length).toBe(1)

      expect(actual[0].name).toBe('Template for GetTemplatesByCollectionId')
      expect(actual[0].isDefault).toBe(false)
      expect(actual[0].datasetMetadataBlocks.length).toBe(1)
      expect(actual[0].datasetMetadataBlocks[0].name).toBe('citation')
      expect(actual[0].datasetMetadataBlocks[0].fields.author.length).toBe(1)
      expect(actual[0].instructions.length).toBe(1)

      await deleteDatasetTemplateViaApi(actual[0].id)
    })
  })

  describe('getTemplate', () => {
    test('should return a template by id', async () => {
      await createTemplate.execute(
        {
          name: 'Template for GetTemplate',
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
        },
        testCollectionAlias
      )
      const templates = await getTemplatesByCollectionId.execute(testCollectionAlias)
      const templateId = templates[templates.length - 1].id
      const templateExpectedIsDefault = templates[templates.length - 1].isDefault

      const actual = await sut.getTemplate(templateId)

      expect(actual.name).toBe('Template for GetTemplate')
      expect(actual.isDefault).toBe(templateExpectedIsDefault)
      expect(actual.datasetMetadataBlocks.length).toBe(1)
      expect(actual.datasetMetadataBlocks[0].name).toBe('citation')
      expect(actual.datasetMetadataBlocks[0].fields.author.length).toBe(1)
      expect(actual.instructions.length).toBe(1)

      await deleteDatasetTemplateViaApi(templateId)
    })

    test('should return error when template does not exist', async () => {
      await expect(sut.getTemplate(999999)).rejects.toThrow()
    })
  })

  describe('deleteTemplate', () => {
    test('should delete a template by id', async () => {
      await createTemplate.execute(
        {
          name: 'Template for DeleteTemplate',
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
        },
        testCollectionAlias
      )
      const templates = await getTemplatesByCollectionId.execute(testCollectionAlias)
      const templateId = templates[templates.length - 1].id

      await sut.deleteTemplate(templateId)

      await expect(sut.getTemplate(templateId)).rejects.toThrow()
    })

    test('should return error when deleting a template that does not exist', async () => {
      await expect(sut.deleteTemplate(999999)).rejects.toThrow()
    })
  })

  describe('setTemplateAsDefault', () => {
    test('should set a template as default for a collection', async () => {
      await createTemplate.execute(
        {
          name: 'Template for setTemplateAsDefault',
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
        },
        testCollectionAlias
      )

      const templates = await getTemplatesByCollectionId.execute(testCollectionAlias)
      const templateId = templates[templates.length - 1].id

      await sut.setTemplateAsDefault(testCollectionAlias, templateId)

      const templatesAfter = await getTemplatesByCollectionId.execute(testCollectionAlias)
      const updatedTemplate = templatesAfter.find((template) => template.id === templateId)

      expect(updatedTemplate?.isDefault).toBe(true)

      await deleteDatasetTemplateViaApi(templateId)
    })

    test('should return error when template does not exist', async () => {
      await expect(sut.setTemplateAsDefault(testCollectionAlias, 999999)).rejects.toThrow()
    })
  })

  describe('unsetTemplateAsDefault', () => {
    test('should remove the default template from a collection', async () => {
      await createTemplate.execute(
        {
          name: 'Template for unsetTemplateAsDefault',
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
        },
        testCollectionAlias
      )

      const templates = await getTemplatesByCollectionId.execute(testCollectionAlias)
      const templateId = templates[templates.length - 1].id

      await sut.setTemplateAsDefault(testCollectionAlias, templateId)
      await sut.unsetTemplateAsDefault(testCollectionAlias)

      const templatesAfter = await getTemplatesByCollectionId.execute(testCollectionAlias)
      const hasDefaultTemplate = templatesAfter.some((template) => template.isDefault)

      expect(hasDefaultTemplate).toBe(false)

      await deleteDatasetTemplateViaApi(templateId)
    })

    test('should return error when collection does not exist', async () => {
      await expect(sut.unsetTemplateAsDefault('invalidCollectionAlias')).rejects.toThrow()
    })
  })
})
