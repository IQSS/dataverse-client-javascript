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

    expect(notifications[0]).toHaveProperty('id')
    expect(notifications[0]).toHaveProperty('type')
    expect(notifications[0]).toHaveProperty('sentTimestamp')
  })

  test('should have correct in-app notification properties when inAppNotificationFormat is true', async () => {
    const notifications = await getAllNotificationsByUser.execute(true)

    expect(notifications[0]).toHaveProperty('id')
    expect(notifications[0]).toHaveProperty('type')
    expect(notifications[0]).toHaveProperty('sentTimestamp')
    expect(notifications[0]).toHaveProperty('displayAsRead')
  })
})
