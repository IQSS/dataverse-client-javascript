import {
  ApiConfig,
  deleteNotificationByUser,
  getAllNotificationsByUser,
  WriteError
} from '../../../src'
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
    const notifications = await getAllNotificationsByUser.execute()
    const notificationId = notifications[notifications.length - 1].id

    await deleteNotificationByUser.execute(notificationId)

    const notificationsAfterDelete = await getAllNotificationsByUser.execute()
    expect(notificationsAfterDelete.length).toBe(notifications.length - 1)
  })

  test('should throw an error when the notification id does not exist', async () => {
    await expect(deleteNotificationByUser.execute(123)).rejects.toThrow(WriteError)
  })
})
