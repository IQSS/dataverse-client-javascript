import { TestConstants } from '../../testHelpers/TestConstants'
import {
  ApiConfig,
  DataverseApiAuthMechanism
} from '../../../src/core/infra/repositories/ApiConfig'
import {
  createDataset,
  DatasetNotNumberedVersion,
  getDataset,
  updateTermsOfAccess
} from '../../../src/datasets'
import { WriteError } from '../../../src'

describe('UpdateTermsOfAccess (functional)', () => {
  beforeAll(() => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
  })

  test('should update terms of access with provided fields', async () => {
    const ids = await createDataset.execute(TestConstants.TEST_NEW_DATASET_DTO)

    await updateTermsOfAccess.execute(ids.numericId, {
      fileAccessRequest: true,
      termsOfAccessForRestrictedFiles: 'Your terms',
      dataAccessPlace: 'Place'
    })

    const dataset = await getDataset.execute(
      ids.numericId,
      DatasetNotNumberedVersion.LATEST,
      false,
      false
    )

    expect(dataset.termsOfUse.termsOfAccess.fileAccessRequest).toBe(true)
    expect(dataset.termsOfUse.termsOfAccess.termsOfAccessForRestrictedFiles).toBe('Your terms')
    expect(dataset.termsOfUse.termsOfAccess.dataAccessPlace).toBe('Place')
  })

  test('should throw when dataset does not exist', async () => {
    await expect(
      updateTermsOfAccess.execute(999999, {
        fileAccessRequest: false
      })
    ).rejects.toBeInstanceOf(WriteError)
  })
})
