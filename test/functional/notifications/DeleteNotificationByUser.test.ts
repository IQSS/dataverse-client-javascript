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
    const notificationId = 1
    await deleteNotificationByUser.execute(notificationId)

    const notifications = await getAllNotificationsByUser.execute()
    expect(notifications.length).toBe(0)
  })

  test('should throw an error when the notification id does not exist', async () => {
    await expect(deleteNotificationByUser.execute(123)).rejects.toThrow(WriteError)
  })
})
