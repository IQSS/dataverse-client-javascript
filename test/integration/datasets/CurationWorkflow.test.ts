import axios from 'axios'
import { randomUUID } from 'node:crypto'
import {
  ApiConfig,
  DatasetLockType,
  DatasetNotNumberedVersion,
  DatasetVersionState,
  getDataset,
  getDatasetLocks,
  publishCollection,
  publishDataset,
  VersionUpdateType
} from '../../../src'
import { DatasetsRepository } from '../../../src/datasets/infra/repositories/DatasetsRepository'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import {
  CurationWorkflowFixture,
  createCurationWorkflowFixture,
  useCurationAdmin
} from '../../testHelpers/datasets/curationWorkflowHelper'
import { waitForNoLocks } from '../../testHelpers/datasets/datasetHelper'
import { createBuiltInUser } from '../../testHelpers/users/builtinUserApiHelper'
import { TestConstants } from '../../testHelpers/TestConstants'

describe('DatasetsRepository curation methods', () => {
  const sut = new DatasetsRepository()
  let fixture: CurationWorkflowFixture
  let cleanup: (() => Promise<void>) | undefined

  beforeEach(async () => {
    useCurationAdmin()
    cleanup = undefined
    fixture = await createCurationWorkflowFixture()
    cleanup = fixture.cleanup
  })
  afterEach(async () => {
    useCurationAdmin()
    if (cleanup) await cleanup()
  })

  describe.each(['numeric', 'persistent'])('with a %s identifier', (kind) => {
    let id: number | string
    beforeEach(() => {
      id = kind === 'numeric' ? fixture.dataset.numericId : fixture.dataset.persistentId
    })

    describe('getAllowedDatasetCurationLabels', () => {
      test('should return the effective configured labels', async () => {
        expect(await sut.getAllowedDatasetCurationLabels(id)).toEqual(fixture.labels)
      })
    })
    describe('getDatasetCurationStatus', () => {
      test('should return null before the first assignment', async () => {
        expect(await sut.getDatasetCurationStatus(id)).toBeNull()
      })
      test('should return the assigned label, timestamp and user', async () => {
        await sut.setDatasetCurationStatus(id, fixture.labels[0])
        const actual = await sut.getDatasetCurationStatus(id)
        expect(actual?.label).toBe(fixture.labels[0])
        expect(actual?.createTime).toBeTruthy()
        expect(actual?.assigner).toBeTruthy()
      })
    })
    describe('getDatasetCurationStatusHistory', () => {
      test('should return an empty history before the first assignment', async () => {
        expect(await sut.getDatasetCurationStatusHistory(id)).toEqual([])
      })
      test('should include changes and removal in newest-first order', async () => {
        await sut.setDatasetCurationStatus(id, fixture.labels[0])
        await sut.setDatasetCurationStatus(id, fixture.labels[1])
        await sut.deleteDatasetCurationStatus(id)
        const actual = await sut.getDatasetCurationStatusHistory(id)
        expect(actual.map((status) => status.label)).toEqual([
          undefined,
          fixture.labels[1],
          fixture.labels[0]
        ])
        for (const status of actual) {
          expect(status.createTime).toBeTruthy()
          expect(status.assigner).toBeTruthy()
        }
      })
    })
    describe('setDatasetCurationStatus', () => {
      test('should assign and change labels containing spaces', async () => {
        await sut.setDatasetCurationStatus(id, fixture.labels[0])
        await sut.setDatasetCurationStatus(id, fixture.labels[1])
        expect((await sut.getDatasetCurationStatus(id))?.label).toBe(fixture.labels[1])
      })
      test('should reject an unconfigured label', async () => {
        await expect(
          sut.setDatasetCurationStatus(id, 'Not configured &label=Privacy Review')
        ).rejects.toThrow(/label not allowed/i)
      })
      test('should leave review locks and publication state unchanged', async () => {
        const locks = await getDatasetLocks.execute(id)
        await sut.setDatasetCurationStatus(id, fixture.labels[0])
        expect(await getDatasetLocks.execute(id)).toEqual(locks)
        expect(
          (await getDataset.execute(id, DatasetNotNumberedVersion.DRAFT)).versionInfo.state
        ).toBe(DatasetVersionState.DRAFT)
      })
    })
    describe('deleteDatasetCurationStatus', () => {
      test('should retain a removal record without ending review', async () => {
        await sut.submitDatasetForReview(id)
        await sut.setDatasetCurationStatus(id, fixture.labels[0])
        const locks = await getDatasetLocks.execute(id)
        await sut.deleteDatasetCurationStatus(id)
        expect((await sut.getDatasetCurationStatus(id))?.label).toBeUndefined()
        expect(await getDatasetLocks.execute(id)).toEqual(locks)
        expect(
          (await getDataset.execute(id, DatasetNotNumberedVersion.DRAFT)).versionInfo.state
        ).toBe(DatasetVersionState.DRAFT)
      })
    })
    describe('submitDatasetForReview', () => {
      test('should submit a draft and add the review lock', async () => {
        const actual = await sut.submitDatasetForReview(id)
        expect(actual.inReview).toBe(true)
        expect(actual.message).toContain('submitted for review')
        expect(await getDatasetLocks.execute(id)).toEqual(
          expect.arrayContaining([expect.objectContaining({ lockType: DatasetLockType.IN_REVIEW })])
        )
      })
      test('should reject a draft already in review', async () => {
        await sut.submitDatasetForReview(id)
        await expect(sut.submitDatasetForReview(id)).rejects.toThrow(/already.*review/i)
      })
    })
  })

  const operations = [
    {
      name: 'getAllowedDatasetCurationLabels',
      execute: () => sut.getAllowedDatasetCurationLabels(fixture.dataset.numericId)
    },
    {
      name: 'getDatasetCurationStatus',
      execute: () => sut.getDatasetCurationStatus(fixture.dataset.numericId)
    },
    {
      name: 'getDatasetCurationStatusHistory',
      execute: () => sut.getDatasetCurationStatusHistory(fixture.dataset.numericId)
    },
    {
      name: 'setDatasetCurationStatus',
      execute: () => sut.setDatasetCurationStatus(fixture.dataset.numericId, fixture.labels[0])
    },
    {
      name: 'deleteDatasetCurationStatus',
      execute: () => sut.deleteDatasetCurationStatus(fixture.dataset.numericId)
    },
    {
      name: 'submitDatasetForReview',
      execute: () => sut.submitDatasetForReview(fixture.dataset.numericId)
    }
  ]

  describe('without dataset permission', () => {
    const username = `curation${randomUUID().replace(/-/g, '')}`
    let token: string
    beforeAll(async () => {
      token = await createBuiltInUser(username)
    })
    afterAll(async () => {
      if (token)
        await axios.delete(`${TestConstants.TEST_API_URL}/admin/authenticatedUsers/${username}`, {
          headers: { 'X-Dataverse-Key': process.env.TEST_API_KEY }
        })
    })
    test.each(operations)('$name should reject another user', async ({ execute }) => {
      ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.API_KEY, token)
      await expect(execute()).rejects.toThrow(/\[403\]|permission|not permitted|authoriz/i)
    })
  })
  describe('without authentication', () => {
    test.each(operations)('$name should reject an anonymous request', async ({ execute }) => {
      ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.API_KEY)
      await expect(execute()).rejects.toThrow(/\[401\]|authenticat|not permitted/i)
    })
  })
  describe('with a published dataset', () => {
    beforeEach(async () => {
      await publishCollection.execute(fixture.alias)
      await sut.submitDatasetForReview(fixture.dataset.numericId)
      await sut.setDatasetCurationStatus(fixture.dataset.numericId, fixture.labels[0])
      await publishDataset.execute(fixture.dataset.numericId, VersionUpdateType.MAJOR)
      await waitForNoLocks(fixture.dataset.numericId)
    })
    test('should clear the review lock and label on publication', async () => {
      expect(await getDatasetLocks.execute(fixture.dataset.numericId)).toEqual([])
      expect((await sut.getDatasetCurationStatus(fixture.dataset.numericId))?.label).toBeUndefined()
    })
    test.each(
      operations.filter(({ name }) =>
        [
          'setDatasetCurationStatus',
          'deleteDatasetCurationStatus',
          'submitDatasetForReview'
        ].includes(name)
      )
    )('$name should reject a released dataset without a draft', async ({ execute }) => {
      await expect(execute()).rejects.toThrow(/release|publish/i)
    })
  })
})
