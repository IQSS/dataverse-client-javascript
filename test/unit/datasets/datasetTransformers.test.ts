import {
  createDatasetMetadataBlockModel,
  createDatasetDTO,
  createNewDatasetRequestPayload
} from '../../testHelpers/datasets/datasetHelper'
import { createDatasetLicenseModel } from '../../testHelpers/datasets/datasetHelper'
import { transformDatasetModelToNewDatasetRequestPayload } from '../../../src/datasets/infra/repositories/transformers/datasetTransformers'

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
})
