import {
  createDatasetMetadataBlockModel,
  createDatasetDTO,
  createNewDatasetRequestPayload,
  createDatasetNestedMetadataBlockModel
} from '../../testHelpers/datasets/datasetHelper'
import { createDatasetLicenseModel } from '../../testHelpers/datasets/datasetHelper'
import {
  transformDatasetModelToNewDatasetRequestPayload,
  transformDatasetModelToUpdateDatasetRequestPayload
} from '../../../src/datasets/infra/repositories/transformers/datasetTransformers'

describe('transformNewDatasetModelToRequestPayload', () => {
  test('should correctly transform a new dataset model to a new dataset request payload', async () => {
    const testDataset = createDatasetDTO()
    const testMetadataBlocks = [createDatasetMetadataBlockModel()]
    const expectedNewDatasetRequestPayload = createNewDatasetRequestPayload()
    const actual = transformDatasetModelToNewDatasetRequestPayload(testDataset, testMetadataBlocks)

    expect(actual).toEqual(expectedNewDatasetRequestPayload)
  })

  it('should correctly transform a new dataset model to a new dataset request payload when it contains a license', () => {
    const testDataset = createDatasetDTO(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      createDatasetLicenseModel()
    )
    const testMetadataBlocks = [createDatasetMetadataBlockModel()]
    const expectedNewDatasetRequestPayload = createNewDatasetRequestPayload(
      createDatasetLicenseModel()
    )
    const actual = transformDatasetModelToNewDatasetRequestPayload(testDataset, testMetadataBlocks)

    expect(actual).toEqual(expectedNewDatasetRequestPayload)
  })

  it('should correctly transform a new dataset model to a new dataset request payload when it contains a license and a datasetType', () => {
    const testDataset = createDatasetDTO(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      createDatasetLicenseModel()
    )
    const testMetadataBlocks = [createDatasetMetadataBlockModel()]
    const datasetType = 'software'
    const expectedNewDatasetRequestPayload = createNewDatasetRequestPayload(
      createDatasetLicenseModel(),
      datasetType
    )
    const actual = transformDatasetModelToNewDatasetRequestPayload(
      testDataset,
      testMetadataBlocks,
      datasetType
    )

    expect(actual).toEqual(expectedNewDatasetRequestPayload)
  })

  it('should include the template id at the top level of a new dataset request payload', () => {
    const testDataset = { ...createDatasetDTO(), templateId: 3 }
    const testMetadataBlocks = [createDatasetMetadataBlockModel()]

    const actual = transformDatasetModelToNewDatasetRequestPayload(testDataset, testMetadataBlocks)

    expect(actual).toEqual({ ...createNewDatasetRequestPayload(), templateId: 3 })
  })

  test('should support deeply nested compound values', () => {
    const metadataBlock = createDatasetNestedMetadataBlockModel()
    const dataset = {
      metadataBlockValues: [
        {
          name: 'citation',
          fields: { author: [{ authorDetails: { authorName: 'Deeply nested value' } }] }
        }
      ]
    }
    const expectedFields = [
      {
        typeName: 'author',
        typeClass: 'compound',
        multiple: true,
        value: [
          {
            authorDetails: {
              typeName: 'authorDetails',
              typeClass: 'compound',
              multiple: false,
              value: {
                authorName: {
                  typeName: 'authorName',
                  typeClass: 'primitive',
                  multiple: false,
                  value: 'Deeply nested value'
                }
              }
            }
          }
        ]
      }
    ]

    const actual = transformDatasetModelToNewDatasetRequestPayload(dataset, [metadataBlock])

    expect(actual.datasetVersion.metadataBlocks.citation.fields).toStrictEqual(expectedFields)
  })
})

describe('transformDatasetModelToUpdateDatasetRequestPayload', () => {
  test('should support deeply nested compound values', () => {
    const metadataBlock = createDatasetNestedMetadataBlockModel()
    const dataset = {
      metadataBlockValues: [
        {
          name: 'citation',
          fields: { author: [{ authorDetails: { authorName: 'Deeply nested value' } }] }
        }
      ]
    }
    const expectedFields = [
      {
        typeName: 'author',
        typeClass: 'compound',
        multiple: true,
        value: [
          {
            authorDetails: {
              typeName: 'authorDetails',
              typeClass: 'compound',
              multiple: false,
              value: {
                authorName: {
                  typeName: 'authorName',
                  typeClass: 'primitive',
                  multiple: false,
                  value: 'Deeply nested value'
                }
              }
            }
          }
        ]
      }
    ]

    const actual = transformDatasetModelToUpdateDatasetRequestPayload(dataset, [metadataBlock])

    expect(actual.fields).toStrictEqual(expectedFields)
  })
})
