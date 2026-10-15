import {
  getAllowedDatasetCurationLabels,
  getDatasetCurationStatus,
  getDatasetCurationStatusHistory,
  setDatasetCurationStatus,
  deleteDatasetCurationStatus,
  submitDatasetForReview,
  getDatasetLocks,
  DatasetLockType
} from '../../../src'
import {
  CurationWorkflowFixture,
  createCurationWorkflowFixture,
  useCurationAdmin
} from '../../testHelpers/datasets/curationWorkflowHelper'

describe('Dataset curation public use cases', () => {
  let fixture: CurationWorkflowFixture
  beforeAll(async () => {
    fixture = await createCurationWorkflowFixture()
  })
  beforeEach(useCurationAdmin)
  afterEach(useCurationAdmin)
  afterAll(async () => {
    if (fixture) await fixture.cleanup()
  })

  test('should submit a draft and track the curator’s label changes and removal', async () => {
    const id = fixture.dataset.persistentId
    expect(await getDatasetCurationStatus.execute(id)).toBeNull()
    expect(await getDatasetCurationStatusHistory.execute(id)).toEqual([])
    const labels = await getAllowedDatasetCurationLabels.execute(id)
    expect(labels).toEqual(fixture.labels)
    expect((await submitDatasetForReview.execute(id)).inReview).toBe(true)
    await setDatasetCurationStatus.execute(id, labels[0])
    expect((await getDatasetCurationStatus.execute(id))?.label).toBe(labels[0])
    await setDatasetCurationStatus.execute(id, labels[1])
    expect((await getDatasetCurationStatus.execute(id))?.label).toBe(labels[1])
    await deleteDatasetCurationStatus.execute(id)
    expect((await getDatasetCurationStatus.execute(id))?.label).toBeUndefined()
    expect(
      (await getDatasetCurationStatusHistory.execute(id)).map((status) => status.label)
    ).toEqual([undefined, labels[1], labels[0]])
    expect(await getDatasetLocks.execute(id)).toEqual(
      expect.arrayContaining([expect.objectContaining({ lockType: DatasetLockType.IN_REVIEW })])
    )
  })
})
