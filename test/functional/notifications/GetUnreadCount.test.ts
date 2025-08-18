import { getUnreadCount } from '../../../src/notifications'

describe('GetUnreadCount', () => {
  test('should return unread count', async () => {
    const unreadCount = await getUnreadCount.execute()

    expect(typeof unreadCount).toBe('number')
    expect(unreadCount).toBeGreaterThanOrEqual(0)
  })
})
