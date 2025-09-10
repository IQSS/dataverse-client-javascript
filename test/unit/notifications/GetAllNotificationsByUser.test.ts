import { GetAllNotificationsByUser } from '../../../src/notifications/domain/useCases/GetAllNotificationsByUser'
import { INotificationsRepository } from '../../../src/notifications/domain/repositories/INotificationsRepository'
import {
  Notification,
  NotificationType
} from '../../../src/notifications/domain/models/Notification'

const mockNotifications: Notification[] = [
  {
    id: 1,
    type: NotificationType.PUBLISHEDDS,
    subjectText: 'Test notification',
    messageText: 'Test message',
    sentTimestamp: '2025-01-01T00:00:00Z',
    displayAsRead: false
  },
  {
    id: 2,
    type: NotificationType.ASSIGNROLE,
    subjectText: 'Role assignment',
    messageText: 'Role assigned',
    sentTimestamp: '2025-01-01T00:00:00Z',
    displayAsRead: false
  }
]

describe('execute', () => {
  test('should return notifications from repository', async () => {
    const notificationsRepositoryStub: INotificationsRepository = {} as INotificationsRepository
    notificationsRepositoryStub.getAllNotificationsByUser = jest
      .fn()
      .mockResolvedValue(mockNotifications)
    const sut = new GetAllNotificationsByUser(notificationsRepositoryStub)

    const result = await sut.execute()

    expect(result).toEqual(mockNotifications)
  })

  test('should throw error when repository throws error', async () => {
    const notificationsRepositoryStub: INotificationsRepository = {} as INotificationsRepository
    notificationsRepositoryStub.getAllNotificationsByUser = jest
      .fn()
      .mockRejectedValue(new Error('Repository error'))
    const sut = new GetAllNotificationsByUser(notificationsRepositoryStub)

    await expect(sut.execute()).rejects.toThrow('Repository error')
  })
})
