import { ApiConfig, getAllNotificationsByUser } from '../../../src'
import { TestConstants } from '../../testHelpers/TestConstants'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import { NotificationSubset } from '../../../src/notifications/domain/models/NotificationSubset'
describe('execute', () => {
  beforeEach(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
  })

  test('should successfully return notifications for authenticated user', async () => {
    const result: NotificationSubset = await getAllNotificationsByUser.execute()
    const notifications = result.notifications

    expect(notifications).not.toBeNull()
    expect(Array.isArray(notifications)).toBe(true)
  })

  test('should have correct notification properties if notifications exist', async () => {
    const result: NotificationSubset = await getAllNotificationsByUser.execute()
    const notifications = result.notifications

    expect(notifications[0]).toHaveProperty('id')
    expect(notifications[0]).toHaveProperty('type')
    expect(notifications[0]).toHaveProperty('sentTimestamp')
  })

  test('should have correct in-app notification properties when inAppNotificationFormat is true', async () => {
    const result: NotificationSubset = await getAllNotificationsByUser.execute(true)
    const notifications = result.notifications

    expect(notifications[0]).toHaveProperty('id')
    expect(notifications[0]).toHaveProperty('type')
    expect(notifications[0]).toHaveProperty('sentTimestamp')
    expect(notifications[0]).toHaveProperty('displayAsRead')
  })

  test('should have correct in-app notification properties when filter and paging params are set', async () => {
    const result: NotificationSubset = await getAllNotificationsByUser.execute(true, true, 1, 0)
    const notifications = result.notifications

    expect(notifications[0]).toHaveProperty('id')
    expect(notifications[0]).toHaveProperty('type')
    expect(notifications[0]).toHaveProperty('sentTimestamp')
    expect(notifications[0]).toHaveProperty('displayAsRead')
    expect(notifications.length).toBeLessThanOrEqual(1)
  })
})
