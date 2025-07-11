import {
  ApiConfig,
  DataverseApiAuthMechanism
} from '../../../src/core/infra/repositories/ApiConfig'
import { TestConstants } from '../../testHelpers/TestConstants'
import { NotificationsRepository } from '../../../src/notifications/infra/repositories/NotificationsRepository'
import { Notification } from '../../../src/notifications/domain/models/Notification'
import { createDataset } from '../../../src/datasets'
import { publishDatasetViaApi, waitForNoLocks } from '../../testHelpers/datasets/datasetHelper'
import { WriteError } from '../../../src'

describe('NotificationsRepository', () => {
  const sut: NotificationsRepository = new NotificationsRepository()

  beforeEach(() => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
  })

  test('should return notifications after creating and publishing a dataset', async () => {
    // Create a dataset and publish it so that a notification of Dataset published is created
    const testDatasetIds = await createDataset.execute(TestConstants.TEST_NEW_DATASET_DTO)

    await publishDatasetViaApi(testDatasetIds.numericId)
    await waitForNoLocks(testDatasetIds.numericId, 10)

    const notifications: Notification[] = await sut.getAllNotificationsByUser()

    expect(Array.isArray(notifications)).toBe(true)
    expect(notifications.length).toBe(2)

    const publishedNotification = notifications.find((n) => n.type === 'PUBLISHEDDS')

    expect(publishedNotification).toBeDefined()

    expect(publishedNotification).toHaveProperty('id')
    expect(publishedNotification).toHaveProperty('type')
    expect(publishedNotification).toHaveProperty('subjectText')
    expect(publishedNotification).toHaveProperty('messageText')
    expect(publishedNotification).toHaveProperty('sentTimestamp')

    expect(publishedNotification?.subjectText).toContain(
      'Dataset created using the createDataset use case'
    )
    expect(publishedNotification?.messageText).toContain(
      'Your dataset named Dataset created using the createDataset use case'
    )
  })

  test('should delete a notification by ID', async () => {
    const notifications: Notification[] = await sut.getAllNotificationsByUser()

    const notificationToDelete = notifications[0]

    await sut.deleteNotificationByUser(notificationToDelete.id)

    const notificationsAfterDelete: Notification[] = await sut.getAllNotificationsByUser()
    const deletedNotification = notificationsAfterDelete.find(
      (n) => n.id === notificationToDelete.id
    )
    expect(deletedNotification).toBeUndefined()
  })

  test('should throw error when trying to delete notification with wrong ID', async () => {
    const nonExistentMetadataBlockName = 99999

    const expectedError = new WriteError(
      `[404] Notification ${nonExistentMetadataBlockName} not found.`
    )

    await expect(sut.deleteNotificationByUser(nonExistentMetadataBlockName)).rejects.toThrow(
      expectedError
    )
  })
})
