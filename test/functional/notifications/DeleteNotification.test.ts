import { ApiConfig, deleteNotification, getAllNotificationsByUser, WriteError } from '../../../src'
import { TestConstants } from '../../testHelpers/TestConstants'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'

describe('execute', () => {
  beforeEach(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
  })

  test('should successfully delete a notification for authenticated user', async () => {
    const notificationSubset = await getAllNotificationsByUser.execute()
    const notifications = notificationSubset.notifications
    const notificationId = notifications[notifications.length - 1].id

    await deleteNotification.execute(notificationId)

    const notificationsAfterDeleteSubset = await getAllNotificationsByUser.execute()
    const notificationsAfterDelete = notificationsAfterDeleteSubset.notifications
    expect(notificationsAfterDelete.length).toBe(notifications.length - 1)
  })

  test('should throw an error when the notification id does not exist', async () => {
    await expect(deleteNotification.execute(123)).rejects.toThrow(WriteError)
  })
})
