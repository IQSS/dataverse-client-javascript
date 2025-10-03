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
import {
  publishDatasetViaApi,
  waitForNoLocks,
  deletePublishedDatasetViaApi
} from '../../testHelpers/datasets/datasetHelper'
import { WriteError } from '../../../src'
import { createCollection } from '../../../src/collections'
import {
  createCollectionDTO,
  deleteCollectionViaApi
} from '../../testHelpers/collections/collectionHelper'

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

    const expectedError = new WriteError(
      `[404] Notification ${nonExistentNotificationId} not found.`
    )

    await expect(sut.deleteNotification(nonExistentNotificationId)).rejects.toThrow(expectedError)
  })

  test('should return notifications with basic properties when inAppNotificationFormat is true', async () => {
    const notifications: Notification[] = await sut.getAllNotificationsByUser(true)

    const notification = notifications[0]
    expect(notification).toHaveProperty('id')
    expect(notification).toHaveProperty('type')
    expect(notification).toHaveProperty('sentTimestamp')
    expect(notification).toHaveProperty('displayAsRead')
  })

  test('should return only unread notifications when onlyUnread is true (if any exist)', async () => {
    const notifications: Notification[] = await sut.getAllNotificationsByUser(true, true)

    expect(Array.isArray(notifications)).toBe(true)
    expect(Array.isArray(notifications)).toBe(true)
    expect(notifications.every((n) => n.displayAsRead === false)).toBe(true)
  })

  test('should paginate results using limit and offset', async () => {
    const limit = 1
    const page1: Notification[] = await sut.getAllNotificationsByUser(true, undefined, limit, 0)
    const page2: Notification[] = await sut.getAllNotificationsByUser(true, undefined, limit, 1)

    expect(page1.length).toBeLessThanOrEqual(limit)
    expect(page2.length).toBeLessThanOrEqual(limit)

    // Always run the assertion, but only if both pages have one notification each
    expect(page1.length !== 1 || page2.length !== 1 || page1[0].id !== page2[0].id).toBe(true)
    const notifications: Notification[] = await sut.getAllNotificationsByUser(true)

    const assignRoleNotification = notifications.find(
      (n) => n.type === NotificationType.ASSIGNROLE && !n.objectDeleted
    )

    expect(assignRoleNotification).toBeDefined()
    expect(assignRoleNotification?.type).toBe(NotificationType.ASSIGNROLE)
    expect(assignRoleNotification?.sentTimestamp).toBeDefined()
    expect(assignRoleNotification?.displayAsRead).toBeDefined()
    expect(assignRoleNotification?.collectionDisplayName).toBeDefined()

    expect(assignRoleNotification?.roleAssignments).toBeDefined()
    expect(assignRoleNotification?.roleAssignments?.length).toBeGreaterThan(0)
    expect(assignRoleNotification?.roleAssignments?.[0]).toHaveProperty('roleName')
    expect(assignRoleNotification?.roleAssignments?.[0]).toHaveProperty('assignee')
    expect(assignRoleNotification?.roleAssignments?.[0]).toHaveProperty('roleId')
    expect(assignRoleNotification?.roleAssignments?.[0]).toHaveProperty('definitionPointId')
  })

  test('should generate 5+ notifications and verify pagination across pages', async () => {
    const createdDatasets: CreatedDatasetIdentifiers[] = []
    try {
      const howMany = 5
      for (let i = 0; i < howMany; i++) {
        const ids = await createDataset.execute(TestConstants.TEST_NEW_DATASET_DTO)
        createdDatasets.push(ids)
        await publishDatasetViaApi(ids.numericId)
        await waitForNoLocks(ids.numericId, 10)
      }

      const limit = 5
      const page1: Notification[] = await sut.getAllNotificationsByUser(true, undefined, limit, 0)
      const page2: Notification[] = await sut.getAllNotificationsByUser(true, undefined, limit, 5)
      const page3: Notification[] = await sut.getAllNotificationsByUser(true, undefined, limit, 10)
      expect(page1.length).toBeLessThanOrEqual(limit)
      expect(page2.length).toBeLessThanOrEqual(limit)
      expect(page3.length).toBeLessThanOrEqual(limit)

      const ids1 = new Set(page1.map((n) => n.id))
      const ids2 = new Set(page2.map((n) => n.id))
      const ids3 = new Set(page3.map((n) => n.id))

      const intersects = (a: Set<number>, b: Set<number>): boolean => {
        for (const x of a) {
          if (b.has(x)) return true
        }
        return false
      }

      expect(page1.length === 0 || page2.length === 0 || !intersects(ids1, ids2)).toBe(true)
      expect(page1.length === 0 || page3.length === 0 || !intersects(ids1, ids3)).toBe(true)
      expect(page2.length === 0 || page3.length === 0 || !intersects(ids2, ids3)).toBe(true)
    } finally {
      for (const d of createdDatasets) {
        await deletePublishedDatasetViaApi(d.persistentId)
      }
    }
  })

  test('should create a collection and find the notification with CREATEDV type', async () => {
    const testCollectionAlias = 'test-notification-collection'
    const createdCollectionId = await createCollection.execute(
      createCollectionDTO(testCollectionAlias)
    )

    expect(createdCollectionId).toBeDefined()
    expect(createdCollectionId).toBeGreaterThan(0)

    const notifications: Notification[] = await sut.getAllNotificationsByUser(true)
    expect(Array.isArray(notifications)).toBe(true)
    expect(notifications.length).toBeGreaterThan(0)

    const createdvNotification = notifications.find(
      (n) => n.collectionAlias === testCollectionAlias
    )

    expect(createdvNotification).toBeDefined()
    expect(createdvNotification?.type).toBe(NotificationType.CREATEDV)
    expect(createdvNotification?.collectionAlias).toBe(testCollectionAlias)
    expect(createdvNotification?.sentTimestamp).toBeDefined()
    expect(createdvNotification?.displayAsRead).toBe(false)
    expect(createdvNotification?.collectionDisplayName).toBe('Test Collection')
    expect(createdvNotification?.collectionAlias).toBe(testCollectionAlias)

    await deleteCollectionViaApi(testCollectionAlias)
  })

  test('should return array when inAppNotificationFormat is false', async () => {
    const notifications: Notification[] = await sut.getAllNotificationsByUser(false)

    expect(Array.isArray(notifications)).toBe(true)
  })

  test('should return unread count', async () => {
    const unreadCount = await sut.getUnreadNotificationsCount()

    expect(typeof unreadCount).toBe('number')
    expect(unreadCount).toBeGreaterThanOrEqual(0)
  })

  test('should mark notification as read successfully', async () => {
    const notifications: Notification[] = await sut.getAllNotificationsByUser()

    expect(notifications.length).toBeGreaterThan(0)

    const unreadNotification = notifications[0]

    await expect(sut.markNotificationAsRead(unreadNotification.id)).resolves.toBeUndefined()

    const updatedNotifications: Notification[] = await sut.getAllNotificationsByUser()
    const updatedNotification = updatedNotifications.find((n) => n.id === unreadNotification.id)

    expect(updatedNotification?.displayAsRead).toBe(true)
  })

  test('should throw error when marking non-existent notification as read', async () => {
    const nonExistentNotificationId = 99999

    const expectedError = new WriteError(
      `[404] Notification ${nonExistentNotificationId} not found.`
    )

    await expect(sut.markNotificationAsRead(nonExistentNotificationId)).rejects.toThrow(
      expectedError
    )
  })
})
