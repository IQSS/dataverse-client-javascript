import {
  ApiConfig,
  DataverseApiAuthMechanism
} from '../../../src/core/infra/repositories/ApiConfig'
import { TestConstants } from '../../testHelpers/TestConstants'
import { NotificationsRepository } from '../../../src/notifications/infra/repositories/NotificationsRepository'
import {
  Notification,
  NotificationType
} from '../../../src/notifications/domain/models/Notification'
import { createDataset, CreatedDatasetIdentifiers } from '../../../src/datasets'
import { publishDatasetViaApi, waitForNoLocks } from '../../testHelpers/datasets/datasetHelper'
import { WriteError } from '../../../src'

describe('NotificationsRepository', () => {
  const sut: NotificationsRepository = new NotificationsRepository()
  let testDatasetIds: CreatedDatasetIdentifiers

  beforeEach(() => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
  })

  test('should return notifications after creating and publishing a dataset', async () => {
    // Create a dataset and publish it so that a notification of Dataset published is created
    testDatasetIds = await createDataset.execute(TestConstants.TEST_NEW_DATASET_DTO)

    await publishDatasetViaApi(testDatasetIds.numericId)
    await waitForNoLocks(testDatasetIds.numericId, 10)

    const notifications: Notification[] = await sut.getAllNotificationsByUser()

    expect(Array.isArray(notifications)).toBe(true)
    expect(notifications.length).toBeGreaterThan(0)

    const publishedNotification = notifications.find(
      (n) => n.type === NotificationType.PUBLISHEDDS
    ) as Notification

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

    await sut.deleteNotification(notificationToDelete.id)

    const notificationsAfterDelete: Notification[] = await sut.getAllNotificationsByUser()
    const deletedNotification = notificationsAfterDelete.find(
      (n) => n.id === notificationToDelete.id
    )
    expect(deletedNotification).toBeUndefined()
  })

  test('should throw error when trying to delete notification with wrong ID', async () => {
    const nonExistentNotificationId = 99999

    const expectedError = new WriteError()

    await expect(sut.deleteNotification(nonExistentNotificationId)).rejects.toThrow(expectedError)
  })

  test('should return notifications with basic properties when inAppNotificationFormat is true', async () => {
    const notifications: Notification[] = await sut.getAllNotificationsByUser(true)

    const notification = notifications[0]
    expect(notification).toHaveProperty('id')
    expect(notification).toHaveProperty('type')
    expect(notification.type).toBe(NotificationType.ASSIGNROLE)
    expect(notification).toHaveProperty('sentTimestamp')
    expect(notification).toHaveProperty('displayAsRead')
    expect(notification).toHaveProperty('dataverseDisplayName')

    expect(notification).toHaveProperty('roleAssignments')
    expect(notification.roleAssignments).toBeDefined()
    expect(notification.roleAssignments?.length).toBeGreaterThan(0)
    expect(notification.roleAssignments?.[0]).toHaveProperty('roleName')
    expect(notification.roleAssignments?.[0]).toHaveProperty('assignee')
    expect(notification.roleAssignments?.[0]).toHaveProperty('roleId')
    expect(notification.roleAssignments?.[0]).toHaveProperty('definitionPointId')
  })

  test('should return array when inAppNotificationFormat is false', async () => {
    const notifications: Notification[] = await sut.getAllNotificationsByUser(false)

    expect(Array.isArray(notifications)).toBe(true)
  })

  test('should return unread count', async () => {
    const unreadCount = await sut.getUnreadCount()

    console.log('unreadCount', unreadCount)
    expect(typeof unreadCount).toBe('number')
    expect(unreadCount).toBeGreaterThanOrEqual(0)
  })

  test('should mark notification as read successfully', async () => {
    const notifications: Notification[] = await sut.getAllNotificationsByUser()

    expect(notifications.length).toBeGreaterThan(0)

    const unreadNotification = notifications[0]

    await expect(sut.markAsRead(unreadNotification.id)).resolves.toBeUndefined()

    const updatedNotifications: Notification[] = await sut.getAllNotificationsByUser()
    const updatedNotification = updatedNotifications.find((n) => n.id === unreadNotification.id)

    expect(updatedNotification?.displayAsRead).toBe(true)
  })

  test('should throw error when marking non-existent notification as read', async () => {
    const nonExistentNotificationId = 99999

    const expectedError = new WriteError(
      `[404] Notification ${nonExistentNotificationId} not found.`
    )

    await expect(sut.markAsRead(nonExistentNotificationId)).rejects.toThrow(expectedError)
  })
})
