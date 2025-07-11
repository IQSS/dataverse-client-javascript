import { ApiConfig, getAllNotificationsByUser, Notification } from '../../../src'
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

  test('should successfully return notifications for authenticated user', async () => {
    const notifications: Notification[] = await getAllNotificationsByUser.execute()

    expect(notifications).not.toBeNull()
    expect(Array.isArray(notifications)).toBe(true)
  })

  test('should have correct notification properties if notifications exist', async () => {
    const notifications = await getAllNotificationsByUser.execute()
    if (notifications.length === 0) {
      return
    }
    const first = notifications[0]
    expect(first).toHaveProperty('id')
    expect(first).toHaveProperty('type')
    expect(first).toHaveProperty('subjectText')
    expect(first).toHaveProperty('messageText')
    expect(first).toHaveProperty('sentTimestamp')
  })
})
