import {
  ApiConfig,
  createDataset,
  getDataset,
  publishDataset,
  updateDatasetLicense,
  DatasetLicenseUpdateRequest
} from '../../../src'
import { TestConstants } from '../../testHelpers/TestConstants'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import {
  waitForNoLocks,
  deleteUnpublishedDatasetViaApi,
  deletePublishedDatasetViaApi
} from '../../testHelpers/datasets/datasetHelper'
import { DatasetNotNumberedVersion, VersionUpdateType } from '../../../src/datasets'

describe('execute', () => {
  beforeEach(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
  })

  test('should update the license of a draft dataset (predefined by name)', async () => {
    const created = await createDataset.execute(TestConstants.TEST_NEW_DATASET_DTO)

    const payload: DatasetLicenseUpdateRequest = { name: 'CC BY 4.0' }
    const response = await updateDatasetLicense.execute(created.numericId, payload)

    expect(response).toBeUndefined()

    const after = await getDataset.execute(
      created.numericId,
      DatasetNotNumberedVersion.DRAFT,
      false,
      false
    )
    expect(after.license?.name).toBe('CC BY 4.0')

    await deleteUnpublishedDatasetViaApi(created.numericId)
  })

  test('should update the license of a published dataset (custom terms creates draft)', async () => {
    const created = await createDataset.execute(TestConstants.TEST_NEW_DATASET_DTO)

    await publishDataset.execute(created.numericId, VersionUpdateType.MAJOR)
    await waitForNoLocks(created.numericId, 10)

    const payload: DatasetLicenseUpdateRequest = {
      customTerms: {
        termsOfUse: 'Updated terms of use (functional test)'
      }
    }
    const response = await updateDatasetLicense.execute(created.numericId, payload)

    expect(response).toBeUndefined()

    const draft = await getDataset.execute(
      created.numericId,
      DatasetNotNumberedVersion.DRAFT,
      false,
      false
    )
    expect(draft.license).toBeUndefined()
    expect(draft.termsOfUse.customTerms?.termsOfUse).toBe('Updated terms of use (functional test)')

    await deletePublishedDatasetViaApi(created.persistentId)
  })
})
