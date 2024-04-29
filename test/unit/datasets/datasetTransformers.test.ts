import {
  createDatasetMetadataBlockModel,
  createDatasetDTO,
  createDatasetRequestPayload
} from '../../testHelpers/datasets/datasetHelper'
import { transformDatasetModelToRequestPayload } from '../../../src/datasets/infra/repositories/transformers/datasetTransformers'
import { createDatasetLicenseModel } from '../../testHelpers/datasets/datasetHelper'

describe('transformNewDatasetModelToRequestPayload', () => {
  test('should correctly transform a new dataset model to a new dataset request payload', async () => {
    const testDataset = createDatasetDTO()
    const testMetadataBlocks = [createDatasetMetadataBlockModel()]
    const expectedNewDatasetRequestPayload = createDatasetRequestPayload()
    const actual = transformDatasetModelToRequestPayload(testDataset, testMetadataBlocks)

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
    const expectedNewDatasetRequestPayload = createDatasetRequestPayload(
      createDatasetLicenseModel()
    )
    const actual = transformDatasetModelToRequestPayload(testDataset, testMetadataBlocks)

    expect(actual).toEqual(expectedNewDatasetRequestPayload)
  })
})
